import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const VENDOR_POOL = [
  { code:'V-001', name:'(주)정밀금형',  category:'금형',  grade:'A', contact:'010-1234-5678' },
  { code:'V-002', name:'한국몰드테크',  category:'금형',  grade:'A', contact:'010-2345-6789' },
  { code:'V-003', name:'ABC베어링',     category:'자재',  grade:'B', contact:'010-3456-7890' },
  { code:'V-004', name:'테크모터(주)',  category:'장비',  grade:'A', contact:'010-4567-8901' },
  { code:'V-005', name:'대성금형공업',  category:'금형',  grade:'B', contact:'010-5678-9012' },
  { code:'V-006', name:'케이블코리아',  category:'자재',  grade:'A', contact:'010-6789-0123' },
];

export default function init(container) {
  renderProcessTracker(container, 'rfq');
  renderPageHeader(container, {
    title: 'RFQ 등록',
    subtitle: '견적요청서를 작성하고 협력사에 발송합니다.',
    actions: [
      { label: '목록으로', pageId: 'rfq-list' },
      { label: '저장 후 발송', primary: true, onClick: () => sendRFQ() },
    ],
  });

  const root = container.querySelector('#page-rfq-new');
  root.innerHTML = `
    <!-- 기본 정보 -->
    <div class="form-section">
      <div class="form-section-title">기본 정보</div>
      <div class="form-grid">
        <div class="form-field"><label class="form-label">RFQ번호</label><input class="form-input" value="RFQ-2026-0090" readonly></div>
        <div class="form-field"><label class="form-label">등록일</label><input class="form-input" type="date" value="2026-04-27"></div>
        <div class="form-field span2"><label class="form-label">RFQ 제목 <span class="req">*</span></label><input class="form-input" id="f-title" placeholder="견적 요청 내용을 입력하세요"></div>
        <div class="form-field"><label class="form-label">견적 마감일 <span class="req">*</span></label><input class="form-input" type="date" id="f-deadline"></div>
        <div class="form-field"><label class="form-label">납기 요청일</label><input class="form-input" type="date" id="f-due"></div>
        <div class="form-field"><label class="form-label">연결 PR</label><input class="form-input" value="PR-2026-0418" readonly></div>
        <div class="form-field"><label class="form-label">견적 유형</label>
          <select class="form-select" id="f-type">
            <option value="rfq">일반 견적 (RFQ)</option>
            <option value="bid">경쟁 입찰</option>
            <option value="limited">제한 경쟁</option>
          </select>
        </div>
        <div class="form-field span2"><label class="form-label">특기사항 / 요구조건</label>
          <textarea class="form-textarea" id="f-note" rows="3" placeholder="품질 인증 요건, 납기 조건, 포장 방식 등 특별 요구사항"></textarea>
        </div>
      </div>
    </div>

    <!-- 견적 품목 -->
    <div class="form-section">
      <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>견적 품목</span>
        <button class="pg-btn primary" id="btn-add" style="font-size:12px;padding:5px 12px">+ 품목 추가</button>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>품목코드</th><th>품목명</th><th>규격</th><th>단위</th><th>수량</th><th>비고</th><th>삭제</th></tr></thead>
          <tbody id="item-tbody"><tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-sub)">품목을 추가하세요</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- 발송 협력사 -->
    <div class="form-section">
      <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>발송 협력사</span>
        <button class="pg-btn" id="btn-add-vendor" style="font-size:12px;padding:5px 12px">+ 협력사 추가</button>
      </div>
      <div id="vendor-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px"></div>
      <div style="padding:14px;background:var(--bg-gray);border-radius:8px;border:1px dashed var(--border-color)">
        <div style="font-size:12px;font-weight:600;color:var(--text-sub);margin-bottom:8px">협력사 선택</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${VENDOR_POOL.map(v => `
            <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--panel-bg);
                 border:1px solid var(--border-color);border-radius:6px;cursor:pointer;font-size:12px">
              <input type="checkbox" data-vendor='${JSON.stringify(v)}'> ${v.name} <span class="badge badge-draft">${v.grade}</span>
            </label>`).join('')}
        </div>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button class="pg-btn" onclick="history.back()">취소</button>
      <button class="pg-btn primary" onclick="sendRFQ()">저장 후 발송</button>
    </div>`;

  let items = [], vendors = [], seq = 1;

  root.querySelector('#btn-add').addEventListener('click', () => {
    items.push({ no: seq++, code:'', name:'', spec:'', unit:'EA', qty:1, note:'' });
    renderItems();
  });

  function renderItems() {
    const tbody = root.querySelector('#item-tbody');
    if (!items.length) { tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-sub)">품목을 추가하세요</td></tr>`; return; }
    tbody.innerHTML = items.map((it, i) => `
      <tr>
        <td>${it.no}</td>
        <td><input class="form-input" style="width:90px" value="${it.code}" placeholder="품목코드" data-f="code" data-i="${i}"></td>
        <td><input class="form-input" style="width:130px" value="${it.name}" placeholder="품목명" data-f="name" data-i="${i}"></td>
        <td><input class="form-input" style="width:110px" value="${it.spec}" placeholder="규격" data-f="spec" data-i="${i}"></td>
        <td><select class="form-select" style="width:65px" data-f="unit" data-i="${i}">${['EA','SET','KG','M','L'].map(u=>`<option${it.unit===u?' selected':''}>${u}</option>`).join('')}</select></td>
        <td><input class="form-input" type="number" style="width:65px" value="${it.qty}" data-f="qty" data-i="${i}"></td>
        <td><input class="form-input" style="width:110px" value="${it.note}" placeholder="비고" data-f="note" data-i="${i}"></td>
        <td><button class="tbl-btn danger" data-del="${i}">삭제</button></td>
      </tr>`).join('');
    tbody.querySelectorAll('[data-f]').forEach(el => el.addEventListener('change', () => { items[+el.dataset.i][el.dataset.f] = el.value; }));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => { items.splice(+btn.dataset.del, 1); renderItems(); }));
  }

  function renderVendors() {
    root.querySelector('#vendor-list').innerHTML = vendors.map((v, i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-gray);
           border:1px solid var(--border-color);border-radius:8px">
        <span style="font-weight:600;font-size:13px">${v.name}</span>
        <span class="badge badge-draft">${v.category}</span>
        <span class="badge badge-approved">등급 ${v.grade}</span>
        <span style="font-size:12px;color:var(--text-sub);margin-left:auto">${v.contact}</span>
        <button class="tbl-btn danger" data-vi="${i}">제거</button>
      </div>`).join('') || '<div style="font-size:13px;color:var(--text-sub);padding:10px">협력사를 선택하세요</div>';
    root.querySelectorAll('[data-vi]').forEach(btn => btn.addEventListener('click', () => { vendors.splice(+btn.dataset.vi, 1); renderVendors(); }));
  }

  root.querySelectorAll('[data-vendor]').forEach(chk => {
    chk.addEventListener('change', () => {
      const v = JSON.parse(chk.dataset.vendor);
      if (chk.checked && !vendors.find(x => x.code === v.code)) vendors.push(v);
      else if (!chk.checked) vendors = vendors.filter(x => x.code !== v.code);
      renderVendors();
    });
  });

  window.sendRFQ = () => {
    if (!root.querySelector('#f-title').value) { alert('RFQ 제목을 입력하세요.'); return; }
    if (!vendors.length) { alert('발송할 협력사를 선택하세요.'); return; }
    alert(`RFQ가 ${vendors.length}개 협력사에 발송되었습니다.`);
    history.pushState({ pageId: 'rfq-list' }, '', '?page=rfq-list');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'rfq-list' } }));
  };
}
export function cleanup() { delete window.sendRFQ; }
