import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const LINKED_ITEMS = [
  { no:1, code:'M-4521', name:'금형 설계 (메인)', spec:'CAD/CAM 설계', unit:'식', qty:1, unitPrice:12000000, total:12000000 },
  { no:2, code:'M-4522', name:'금형 제작 감리',   spec:'현장 감리',    unit:'식', qty:1, unitPrice:5000000,  total:5000000  },
  { no:3, code:'M-4523', name:'시험성형 1회',      spec:'T1 샷',        unit:'회', qty:1, unitPrice:8000000,  total:8000000  },
  { no:4, code:'M-4524', name:'납기 보증',         spec:'계약 조건',    unit:'식', qty:1, unitPrice:7000000,  total:7000000  },
];

function fmt(n) { return n.toLocaleString() + '원'; }

export default function init(container) {
  renderProcessTracker(container, 'po');
  renderPageHeader(container, {
    title: '발주서 작성',
    subtitle: '구매 발주서(PO)를 작성하고 협력사에 발행합니다.',
    actions: [
      { label: '발주 목록', pageId: 'po-list' },
      { label: '발주 발행', primary: true, onClick: () => submitPO() },
    ],
  });

  const root = container.querySelector('#page-po-new');
  root.innerHTML = `
    <div class="form-section">
      <div class="form-section-title">발주 기본 정보</div>
      <div class="form-grid">
        <div class="form-field"><label class="form-label">발주번호</label><input class="form-input" value="PO-2026-0202" readonly></div>
        <div class="form-field"><label class="form-label">발주일</label><input class="form-input" type="date" value="2026-04-27" id="f-date"></div>
        <div class="form-field"><label class="form-label">협력사 <span class="req">*</span></label><input class="form-input" id="f-vendor" value="(주)정밀금형" readonly></div>
        <div class="form-field"><label class="form-label">담당자</label><input class="form-input" value="홍길동 (구매팀)"></div>
        <div class="form-field"><label class="form-label">납기 요청일 <span class="req">*</span></label><input class="form-input" type="date" id="f-due" value="2026-05-27"></div>
        <div class="form-field"><label class="form-label">결제 조건</label>
          <select class="form-select" id="f-pay">
            <option>월말 마감 익월 10일</option><option>선급 30% / 잔금 검수 후</option><option>즉시 결제</option><option>Net 30</option>
          </select>
        </div>
        <div class="form-field"><label class="form-label">연결 계약</label><input class="form-input" value="CT-2026-0123" readonly></div>
        <div class="form-field"><label class="form-label">연결 PR</label><input class="form-input" value="PR-2026-0418" readonly></div>
        <div class="form-field span2"><label class="form-label">배송지 주소</label><input class="form-input" id="f-addr" value="경기도 화성시 공장로 100, (주)한국정밀 물류창고"></div>
        <div class="form-field span2"><label class="form-label">특이사항 / 발주 조건</label>
          <textarea class="form-textarea" id="f-note" rows="3" placeholder="납기 요건, 포장 조건, 검수 기준 등"></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>발주 품목</span>
        <button class="pg-btn" id="btn-add-item" style="font-size:12px;padding:5px 12px">+ 품목 추가</button>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>품목코드</th><th>품목명</th><th>규격</th><th>단위</th><th style="text-align:right">수량</th><th style="text-align:right">단가</th><th style="text-align:right">금액</th><th>삭제</th></tr></thead>
          <tbody id="item-tbody"></tbody>
          <tfoot>
            <tr style="background:var(--bg-gray);font-weight:700">
              <td colspan="7" style="text-align:right;padding:10px 16px">합계</td>
              <td style="text-align:right;padding:10px 16px;color:var(--primary-color)" id="total-amt"></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">첨부 파일</div>
      <div style="padding:20px;border:2px dashed var(--border-color);border-radius:8px;text-align:center;cursor:pointer"
           id="drop-zone">
        <div style="font-size:24px;margin-bottom:6px">📎</div>
        <div style="font-size:13px;color:var(--text-sub)">발주서 원본, 규격서, 도면 등 첨부</div>
        <button class="pg-btn" style="margin-top:10px;font-size:12px">파일 선택</button>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button class="pg-btn" onclick="history.back()">취소</button>
      <button class="pg-btn" onclick="alert('임시저장 완료')">임시저장</button>
      <button class="pg-btn primary" onclick="submitPO()">발주 발행</button>
    </div>`;

  let items = LINKED_ITEMS.map(i => ({ ...i }));
  let seq = items.length + 1;

  function calcTotal() {
    const total = items.reduce((s, r) => s + r.total, 0);
    root.querySelector('#total-amt').textContent = fmt(total);
  }

  function renderItems() {
    const tbody = root.querySelector('#item-tbody');
    tbody.innerHTML = items.map((it, i) => `
      <tr>
        <td>${it.no}</td>
        <td><input class="form-input" style="width:85px" value="${it.code}" data-f="code" data-i="${i}"></td>
        <td><input class="form-input" style="width:130px" value="${it.name}" data-f="name" data-i="${i}"></td>
        <td><input class="form-input" style="width:100px" value="${it.spec}" data-f="spec" data-i="${i}"></td>
        <td><select class="form-select" style="width:60px" data-f="unit" data-i="${i}">${['EA','SET','식','KG','M','회','L'].map(u=>`<option${it.unit===u?' selected':''}>${u}</option>`).join('')}</select></td>
        <td><input class="form-input" type="number" style="width:65px;text-align:right" value="${it.qty}" data-f="qty" data-i="${i}"></td>
        <td><input class="form-input" type="number" style="width:100px;text-align:right" value="${it.unitPrice}" data-f="unitPrice" data-i="${i}"></td>
        <td style="text-align:right;font-weight:600;padding-right:12px">${fmt(it.total)}</td>
        <td><button class="tbl-btn danger" data-del="${i}">삭제</button></td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-f]').forEach(el => el.addEventListener('change', () => {
      const idx = +el.dataset.i;
      items[idx][el.dataset.f] = el.type === 'number' ? +el.value : el.value;
      if (el.dataset.f === 'qty' || el.dataset.f === 'unitPrice') {
        items[idx].total = items[idx].qty * items[idx].unitPrice;
      }
      renderItems();
    }));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
      items.splice(+btn.dataset.del, 1);
      renderItems();
    }));
    calcTotal();
  }

  root.querySelector('#btn-add-item').addEventListener('click', () => {
    items.push({ no: seq++, code:'', name:'', spec:'', unit:'EA', qty:1, unitPrice:0, total:0 });
    renderItems();
  });

  renderItems();

  window.submitPO = () => {
    if (!root.querySelector('#f-due').value) { alert('납기 요청일을 입력하세요.'); return; }
    if (!items.length) { alert('발주 품목을 입력하세요.'); return; }
    alert('발주서가 발행되었습니다.\n협력사에 이메일 및 시스템 알림이 전송됩니다.');
    history.pushState({ pageId: 'po-list' }, '', '?page=po-list');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'po-list' } }));
  };
}
export function cleanup() { delete window.submitPO; }
