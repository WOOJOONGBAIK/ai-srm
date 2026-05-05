import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { claimNo:'CLM-2026-0045', iqcNo:'IQC-2026-0175', vendor:'(주)정밀금형', item:'시제품 금형', type:'치수 불량', qty:2, amt:9000000, issued:'2026-04-03', status:'processing', response:'반품 후 재제작 협의중' },
  { claimNo:'CLM-2026-0040', iqcNo:'IQC-2026-0190', vendor:'코리아오피스', item:'사무용 복합기 소모품', type:'기능 불량', qty:2, amt:180000, issued:'2026-04-12', status:'resolved',   response:'교환품 수령 완료' },
  { claimNo:'CLM-2026-0035', iqcNo:'IQC-2026-0140', vendor:'한국원자재',   item:'원자재 A-300',  type:'성분 규격 미달', qty:500, amt:10500000, issued:'2026-03-20', status:'pending',    response:'-' },
  { claimNo:'CLM-2026-0028', iqcNo:'IQC-2026-0120', vendor:'대성금형공업', item:'프레스 금형',   type:'표면 처리 불량', qty:1, amt:4500000, issued:'2026-03-05', status:'closed',     response:'배상금 수령 및 종결' },
  { claimNo:'CLM-2026-0020', iqcNo:'IQC-2026-0105', vendor:'ABC베어링',    item:'고정밀 베어링', type:'치수 공차 초과', qty:30, amt:1200000, issued:'2026-02-18', status:'resolved',   response:'대체품 공급 완료' },
];

const ST = {
  pending:    { label:'접수',    cls:'badge-draft'    },
  processing: { label:'처리중',  cls:'badge-pending'  },
  resolved:   { label:'해결',    cls:'badge-approved' },
  closed:     { label:'종결',    cls:'badge-draft'    },
};

const TYPE_CLS = { '치수 불량':'badge-urgent', '기능 불량':'badge-warn', '성분 규격 미달':'badge-urgent', '표면 처리 불량':'badge-warn', '치수 공차 초과':'badge-pending' };

function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

export default function init(container) {
  renderProcessTracker(container, 'iqc');
  renderPageHeader(container, {
    title: '클레임 목록',
    subtitle: '협력사 품질 클레임 접수 및 처리 현황을 관리합니다.',
    actions: [
      { label: 'IQC 검사 목록', pageId: 'qa-iqc-list' },
      { label: '+ 클레임 등록', primary: true, onClick: () => showClaimModal() },
    ],
  });

  const root = container.querySelector('#page-qa-claim-list');
  const totalAmt = MOCK.reduce((s,r)=>s+r.amt, 0);
  const resolvedAmt = MOCK.filter(r=>['resolved','closed'].includes(r.status)).reduce((s,r)=>s+r.amt, 0);

  root.innerHTML = `
    <div class="stat-cards" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card primary"><div class="stat-card-label">전체 클레임</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card warn"><div class="stat-card-label">처리중</div><div class="stat-card-value">${MOCK.filter(r=>['pending','processing'].includes(r.status)).length}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">클레임 총액</div><div class="stat-card-value">${fmt(totalAmt)}</div></div>
      <div class="stat-card success"><div class="stat-card-label">회수/해결 금액</div><div class="stat-card-value">${fmt(resolvedAmt)}</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 상태</option><option value="pending">접수</option><option value="processing">처리중</option><option value="resolved">해결</option><option value="closed">종결</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="클레임번호·협력사·품목명·유형 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>클레임번호</th><th>IQC번호</th><th>협력사</th><th>품목명</th><th>불량 유형</th><th style="text-align:right">클레임 수량</th><th style="text-align:right">청구 금액</th><th>접수일</th><th>상태</th><th>처리 내용</th><th>관리</th></tr></thead>
        <tbody id="claim-tbody"></tbody>
      </table>
    </div>

    <!-- 협력사별 클레임 현황 -->
    <div class="form-section" style="margin-top:24px">
      <div class="form-section-title">협력사별 클레임 현황</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${Object.entries(
          MOCK.reduce((acc, r) => {
            if (!acc[r.vendor]) acc[r.vendor] = { count:0, amt:0 };
            acc[r.vendor].count++;
            acc[r.vendor].amt += r.amt;
            return acc;
          }, {})
        ).sort((a,b)=>b[1].count-a[1].count).map(([vendor, d]) => `
          <div style="flex:1;min-width:160px;padding:14px 16px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-gray)">
            <div style="font-weight:700;margin-bottom:6px;font-size:13px">${vendor}</div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-sub)">
              <span>클레임 <strong style="color:var(--text-main)">${d.count}건</strong></span>
              <span>${fmt(d.amt)}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 클레임 등록 모달 -->
    <div id="claim-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center" hidden>
      <div style="background:var(--panel-bg);border-radius:12px;padding:28px;width:500px;max-width:90vw;max-height:80vh;overflow-y:auto">
        <div style="font-size:16px;font-weight:700;margin-bottom:20px">클레임 신규 등록</div>
        <div class="form-grid">
          <div class="form-field"><label class="form-label">IQC번호</label><input class="form-input" id="m-iqc" placeholder="IQC-2026-XXXX"></div>
          <div class="form-field"><label class="form-label">협력사 <span class="req">*</span></label><input class="form-input" id="m-vendor" placeholder="협력사명"></div>
          <div class="form-field span2"><label class="form-label">품목명 <span class="req">*</span></label><input class="form-input" id="m-item" placeholder="품목명"></div>
          <div class="form-field"><label class="form-label">불량 유형 <span class="req">*</span></label>
            <select class="form-select" id="m-type"><option>치수 불량</option><option>기능 불량</option><option>성분 규격 미달</option><option>표면 처리 불량</option><option>기타</option></select>
          </div>
          <div class="form-field"><label class="form-label">클레임 수량</label><input class="form-input" type="number" id="m-qty" placeholder="수량"></div>
          <div class="form-field span2"><label class="form-label">청구 금액 (원)</label><input class="form-input" type="number" id="m-amt" placeholder="원 단위 입력"></div>
          <div class="form-field span2"><label class="form-label">불량 내용 <span class="req">*</span></label>
            <textarea class="form-textarea" id="m-desc" rows="3" placeholder="불량 발생 경위 및 내용 기재"></textarea>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
          <button class="pg-btn" id="m-cancel">취소</button>
          <button class="pg-btn primary" id="m-submit">클레임 등록</button>
        </div>
      </div>
    </div>`;

  function render(data) {
    root.querySelector('#claim-tbody').innerHTML = data.map(r => {
      const s = ST[r.status];
      const tc = TYPE_CLS[r.type] || 'badge-draft';
      return `<tr>
        <td style="font-weight:600;color:var(--primary-color)">${r.claimNo}</td>
        <td style="font-size:12px;color:var(--text-sub)">${r.iqcNo}</td>
        <td>${r.vendor}</td>
        <td>${r.item}</td>
        <td><span class="badge ${tc}">${r.type}</span></td>
        <td style="text-align:right">${r.qty}</td>
        <td style="text-align:right;font-weight:600">${fmt(r.amt)}</td>
        <td style="font-size:12px">${r.issued}</td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td style="font-size:12px;color:var(--text-sub);max-width:160px">${r.response}</td>
        <td class="td-actions">
          <button class="tbl-btn primary">상세</button>
          ${['pending','processing'].includes(r.status)?'<button class="tbl-btn">처리</button>':''}
        </td>
      </tr>`;
    }).join('');
  }

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r =>
      (!st || r.status === st) &&
      (!kw || r.claimNo.toLowerCase().includes(kw) || r.vendor.toLowerCase().includes(kw) ||
              r.item.toLowerCase().includes(kw) || r.type.toLowerCase().includes(kw))
    ));
  });

  const modal = root.querySelector('#claim-modal');

  window.showClaimModal = () => {
    modal.hidden = false;
    modal.style.display = 'flex';
  };

  root.querySelector('#m-cancel').addEventListener('click', () => {
    modal.hidden = true;
    modal.style.display = 'none';
  });

  root.querySelector('#m-submit').addEventListener('click', () => {
    const vendor = root.querySelector('#m-vendor').value;
    const item   = root.querySelector('#m-item').value;
    const desc   = root.querySelector('#m-desc').value;
    if (!vendor || !item || !desc) { alert('필수 항목을 입력하세요.'); return; }
    alert('클레임이 등록되었습니다.\n협력사에 통보 메일이 발송됩니다.');
    modal.hidden = true;
    modal.style.display = 'none';
  });

  render(MOCK);
}
export function cleanup() { delete window.showClaimModal; }
