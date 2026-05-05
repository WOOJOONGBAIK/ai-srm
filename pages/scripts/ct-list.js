import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { ctNo:'CT-2026-0124', title:'베어링·씰류 단가계약',       vendor:'ABC베어링',    type:'단가계약', amt:120000000, start:'2026-01-01', end:'2026-12-31', status:'active',  dday:249 },
  { ctNo:'CT-2026-0123', title:'금형 설계 외주 용역 계약',   vendor:'(주)정밀금형', type:'일반계약', amt:32000000,  start:'2026-04-27', end:'2026-07-31', status:'pending', dday:95  },
  { ctNo:'CT-2026-0118', title:'ERP 유지보수 서비스',        vendor:'테크모터(주)', type:'서비스계약',amt:55000000, start:'2026-01-01', end:'2026-12-31', status:'active',  dday:249 },
  { ctNo:'CT-2025-0201', title:'원자재 A-350 연간 공급계약', vendor:'한국원자재',   type:'단가계약', amt:800000000, start:'2026-01-01', end:'2026-12-31', status:'active',  dday:249 },
  { ctNo:'CT-2025-0188', title:'물류 운송 서비스 계약',      vendor:'대한물류',     type:'서비스계약',amt:36000000, start:'2025-07-01', end:'2026-06-30', status:'expiring',dday:64  },
  { ctNo:'CT-2025-0145', title:'사무용 복합기 리스',         vendor:'코리아오피스', type:'리스계약', amt:18000000,  start:'2023-01-01', end:'2026-05-31', status:'expiring',dday:34  },
];
const ST = {
  active:   { label:'유효',     cls:'badge-approved'  },
  pending:  { label:'서명대기', cls:'badge-pending'   },
  expiring: { label:'만료임박', cls:'badge-urgent'    },
  expired:  { label:'만료',     cls:'badge-draft'     },
};
function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

export default function init(container) {
  renderProcessTracker(container, 'contract');
  renderPageHeader(container, {
    title: '계약 목록',
    subtitle: '체결된 계약 현황을 관리합니다.',
    actions: [
      { label: '+ 계약 작성', primary: true, pageId: 'ct-new' },
      { label: '서명 대기함', pageId: 'ct-sign-queue' },
      { label: '⬇ 엑셀', onClick: () => alert('엑셀 다운로드') },
    ],
  });

  const root = container.querySelector('#page-ct-list');
  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary"><div class="stat-card-label">전체 계약</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card success"><div class="stat-card-label">유효 계약</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='active').length}건</div></div>
      <div class="stat-card warn"><div class="stat-card-label">서명 대기</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='pending').length}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">만료 임박(90일)</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='expiring').length}건</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 상태</option><option value="active">유효</option><option value="pending">서명대기</option><option value="expiring">만료임박</option></select>
      <select id="f-type"><option value="">전체 유형</option><option value="단가계약">단가계약</option><option value="일반계약">일반계약</option><option value="서비스계약">서비스계약</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="계약번호·명칭·협력사 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>계약번호</th><th>계약명</th><th>협력사</th><th>유형</th><th style="text-align:right">계약금액</th><th>계약기간</th><th>잔여일</th><th>상태</th><th>관리</th></tr></thead>
        <tbody id="ct-tbody"></tbody>
      </table>
    </div>`;

  function render(data) {
    root.querySelector('#ct-tbody').innerHTML = data.map(r => {
      const s = ST[r.status];
      const ddayColor = r.dday <= 30 ? '#dc2626' : r.dday <= 90 ? '#c2410c' : 'var(--text-sub)';
      return `<tr>
        <td style="font-weight:600;color:var(--primary-color)">${r.ctNo}</td>
        <td>${r.title}</td>
        <td>${r.vendor}</td>
        <td><span class="badge badge-draft">${r.type}</span></td>
        <td style="text-align:right;font-weight:600">${fmt(r.amt)}</td>
        <td style="font-size:12px">${r.start} ~ ${r.end}</td>
        <td style="font-weight:700;color:${ddayColor}">${r.dday}일</td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td class="td-actions">
          <button class="tbl-btn primary">상세</button>
          ${r.status==='pending'?'<button class="tbl-btn warn" style="color:#c2410c;border-color:#fde68a">서명</button>':''}
          ${r.status==='expiring'?'<button class="tbl-btn" style="color:#16a34a">갱신</button>':''}
        </td>
      </tr>`;
    }).join('');
  }

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const tp = root.querySelector('#f-type').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r => (!st||r.status===st)&&(!tp||r.type===tp)&&(!kw||r.ctNo.toLowerCase().includes(kw)||r.title.toLowerCase().includes(kw)||r.vendor.toLowerCase().includes(kw))));
  });

  render(MOCK);
}
export function cleanup() {}
