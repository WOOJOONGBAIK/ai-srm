import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid } from '../../components/grid.js';

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
      <div class="aisrm-grid-wrap">
        <div id="po-item-grid" class="aisrm-grid"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;font-size:13px;font-weight:900;color:var(--primary-color)">합계 <span id="total-amt" style="margin-left:6px"></span></div>
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
  let itemGrid = null;

  function calcTotal() {
    const total = items.reduce((s, r) => s + r.total, 0);
    root.querySelector('#total-amt').textContent = fmt(total);
  }

  function renderItems() {
    const data = items.map((it, idx) => ({ ...it, idx }));
    if (!itemGrid) {
      itemGrid = createAISRMGrid(root.querySelector('#po-item-grid'), {
        columns: [
          { name: 'no', header: '#', width: 60, align: 'center' },
          { name: 'code', header: '품목코드', width: 110, editor: 'text' },
          { name: 'name', header: '품목명', minWidth: 150, editor: 'text' },
          { name: 'spec', header: '규격', minWidth: 120, editor: 'text' },
          { name: 'unit', header: '단위', width: 80, editor: 'text' },
          { name: 'qty', header: '수량', width: 80, align: 'right', editor: 'text' },
          { name: 'unitPrice', header: '단가', width: 120, align: 'right', editor: 'text', formatter: 'number' },
          { name: 'total', header: '금액', width: 130, align: 'right', formatter: 'number' },
          { name: '__actions', header: '삭제', width: 80, formatter: ({ row }) => actionButtons([{ label: '삭제', danger: true, dataset: { del: row.idx } }]) }
        ],
        data,
        bodyHeight: 260,
        onEditingFinish: ({ rowKey, columnName, value, grid }) => {
          const row = grid.getRow(rowKey);
          if (!row || row.idx === undefined) return;
          items[row.idx][columnName] = ['qty', 'unitPrice'].includes(columnName) ? Number(value) || 0 : value;
          items[row.idx].total = items[row.idx].qty * items[row.idx].unitPrice;
          renderItems();
        }
      });
      return calcTotal();
    }
    itemGrid.setData(data);
    calcTotal();
  }

  root.querySelector('#po-item-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    items.splice(+btn.dataset.del, 1);
    renderItems();
  });

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
