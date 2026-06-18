import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid } from '../../components/grid.js';

export default function init(container) {
  renderProcessTracker(container, 'pr');
  renderPageHeader(container, {
    title: 'PR 등록',
    subtitle: '신규 구매요청을 작성합니다.',
    actions: [
      { label: '목록으로', pageId: 'pr-list' },
      { label: '임시저장', onClick: () => savePR('draft') },
      { label: '승인 요청', primary: true, onClick: () => savePR('submit') },
    ],
  });

  const root = container.querySelector('#page-pr-new');
  root.innerHTML = `
    <!-- 기본 정보 -->
    <div class="form-section">
      <div class="form-section-title">기본 정보</div>
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">PR번호 <span class="req">*</span></label>
          <input class="form-input" value="PR-2026-0422" readonly>
        </div>
        <div class="form-field">
          <label class="form-label">요청일 <span class="req">*</span></label>
          <input class="form-input" type="date" id="f-date" value="2026-04-27">
        </div>
        <div class="form-field">
          <label class="form-label">요청자 <span class="req">*</span></label>
          <input class="form-input" value="홍길동" readonly>
        </div>
        <div class="form-field">
          <label class="form-label">소속 부서 <span class="req">*</span></label>
          <input class="form-input" value="구매팀" readonly>
        </div>
        <div class="form-field span2">
          <label class="form-label">구매요청명 <span class="req">*</span></label>
          <input class="form-input" id="f-title" placeholder="구매요청 내용을 간략하게 입력하세요">
        </div>
        <div class="form-field">
          <label class="form-label">구매 분류 <span class="req">*</span></label>
          <select class="form-select" id="f-category">
            <option value="">선택</option>
            <option value="자재">자재</option>
            <option value="장비">장비</option>
            <option value="소모품">소모품</option>
            <option value="서비스">서비스</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">납기 요청일</label>
          <input class="form-input" type="date" id="f-due">
        </div>
        <div class="form-field">
          <label class="form-label">긴급 여부</label>
          <select class="form-select" id="f-urgent">
            <option value="N">일반</option>
            <option value="Y">긴급</option>
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">예상 총액</label>
          <input class="form-input" id="f-total" readonly placeholder="품목 입력 시 자동 계산">
        </div>
      </div>
      <div class="form-grid col1" style="margin-top:12px">
        <div class="form-field">
          <label class="form-label">요청 사유 / 상세 내용</label>
          <textarea class="form-textarea" id="f-reason" rows="3" placeholder="구매 목적 및 필요 사유를 상세히 작성하세요"></textarea>
        </div>
      </div>
    </div>

    <!-- 품목 목록 -->
    <div class="form-section">
      <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>품목 목록</span>
        <button class="pg-btn primary" id="btn-add-item" style="font-size:12px;padding:5px 12px">+ 품목 추가</button>
      </div>
      <div class="aisrm-grid-wrap">
        <div id="pr-item-grid" class="aisrm-grid"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;font-size:13px;font-weight:900;color:var(--primary-color)">합계 <span id="total-amt" style="margin-left:6px">0원</span></div>
    </div>

    <!-- 첨부파일 -->
    <div class="form-section">
      <div class="form-section-title">첨부파일</div>
      <div style="display:flex;align-items:center;gap:12px">
        <button class="pg-btn" onclick="document.getElementById('file-input').click()">📎 파일 첨부</button>
        <input type="file" id="file-input" multiple style="display:none">
        <span style="font-size:12px;color:var(--text-sub)">최대 10MB, 파일 5개까지 첨부 가능</span>
      </div>
      <div id="file-list" style="margin-top:12px;display:flex;flex-direction:column;gap:6px"></div>
    </div>

    <!-- 결재선 -->
    <div class="form-section">
      <div class="form-section-title">결재선</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        ${['기안자: 홍길동 (구매팀)', '1차결재: 김팀장 (구매팀장)', '최종결재: 박본부장 (구매본부장)'].map((s, i) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 20px;
               border:1px solid var(--border-color);border-radius:8px;background:var(--bg-gray);min-width:140px">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--primary-color);
                 color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">${i + 1}</div>
            <div style="font-size:12px;font-weight:600;color:var(--text-main);text-align:center">${s}</div>
          </div>`).join('<div style="display:flex;align-items:center;color:var(--text-sub);font-size:20px">›</div>')}
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button class="pg-btn" onclick="history.back()">취소</button>
      <button class="pg-btn" onclick="savePR('draft')">임시저장</button>
      <button class="pg-btn primary" onclick="savePR('submit')">승인 요청</button>
    </div>`;

  let items = [];
  let itemSeq = 1;
  let itemGrid = null;

  function recalc() {
    const total = items.reduce((s, r) => s + (r.qty * r.price), 0);
    root.querySelector('#total-amt').textContent = total.toLocaleString('ko-KR') + '원';
    root.querySelector('#f-total').value = total ? total.toLocaleString('ko-KR') + '원' : '';
  }

  function renderItems() {
    const data = items.map((item, i) => ({
      ...item,
      idx: i,
      no: i + 1,
      amount: item.qty * item.price
    }));
    if (!itemGrid) {
      itemGrid = createAISRMGrid(root.querySelector('#pr-item-grid'), {
        columns: [
          { name: 'no', header: '#', width: 60, align: 'center' },
          { name: 'code', header: '품목코드', width: 120, editor: 'text' },
          { name: 'name', header: '품목명', minWidth: 150, editor: 'text' },
          { name: 'spec', header: '규격/사양', minWidth: 130, editor: 'text' },
          { name: 'unit', header: '단위', width: 80, editor: 'text' },
          { name: 'qty', header: '수량', width: 80, align: 'right', editor: 'text' },
          { name: 'price', header: '단가', width: 110, align: 'right', editor: 'text', formatter: 'number' },
          { name: 'amount', header: '금액', width: 120, align: 'right', formatter: 'number' },
          { name: 'note', header: '비고', minWidth: 110, editor: 'text' },
          { name: '__actions', header: '삭제', width: 80, formatter: ({ row }) => actionButtons([{ label: '삭제', danger: true, dataset: { del: row.idx } }]) }
        ],
        data,
        bodyHeight: 260,
        onEditingFinish: ({ rowKey, columnName, value, grid }) => {
          const row = grid.getRow(rowKey);
          if (!row || row.idx === undefined) return;
          items[row.idx][columnName] = ['qty', 'price'].includes(columnName) ? Number(value) || 0 : value;
          renderItems();
        }
      });
      return recalc();
    }
    itemGrid.setData(data);
    recalc();
  }

  root.querySelector('#pr-item-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    items.splice(+btn.dataset.del, 1);
    renderItems();
  });

  root.querySelector('#btn-add-item').addEventListener('click', () => {
    items.push({ code: `ITM-${String(itemSeq++).padStart(3,'0')}`, name:'', spec:'', unit:'EA', qty:1, price:0, note:'' });
    renderItems();
  });

  root.querySelector('#file-input').addEventListener('change', e => {
    const list = root.querySelector('#file-list');
    [...e.target.files].forEach(f => {
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:13px;padding:6px 10px;background:var(--bg-gray);border-radius:6px';
      div.innerHTML = `📄 ${f.name} <span style="color:var(--text-sub)">(${(f.size/1024).toFixed(1)}KB)</span><button class="tbl-btn danger" style="margin-left:auto">삭제</button>`;
      div.querySelector('button').addEventListener('click', () => div.remove());
      list.appendChild(div);
    });
  });

  window.savePR = (mode) => {
    const title = root.querySelector('#f-title').value;
    if (!title) { alert('구매요청명을 입력하세요.'); return; }
    alert(mode === 'draft' ? '임시저장 완료' : '승인 요청이 전송되었습니다.');
    history.pushState({ pageId: 'pr-list' }, '', '?page=pr-list');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'pr-list' } }));
  };
}

export function cleanup() { delete window.savePR; }
