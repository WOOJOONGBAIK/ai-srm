import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { poNo:'PO-2026-0201', title:'금형 설계 외주 용역', vendor:'(주)정밀금형', qty:1,  unit:'식',  amt:32000000, issued:'2026-04-27', due:'2026-05-27', ack:'확인완료', status:'progress' },
  { poNo:'PO-2026-0198', title:'베어링·씰류 자재 구매', vendor:'ABC베어링',    qty:500,unit:'EA', amt:8500000,  issued:'2026-04-25', due:'2026-05-10', ack:'확인완료', status:'delivered' },
  { poNo:'PO-2026-0195', title:'ERP 유지보수 서비스', vendor:'테크모터(주)',  qty:1,  unit:'식',  amt:55000000, issued:'2026-04-20', due:'2026-12-31', ack:'확인완료', status:'progress' },
  { poNo:'PO-2026-0190', title:'원자재 A-350 1분기 공급', vendor:'한국원자재', qty:2000,unit:'KG',amt:42000000, issued:'2026-04-15', due:'2026-04-30', ack:'미확인',   status:'pending'  },
  { poNo:'PO-2026-0185', title:'물류 운송 서비스 4월', vendor:'대한물류',     qty:1,  unit:'식',  amt:3200000,  issued:'2026-04-01', due:'2026-04-30', ack:'확인완료', status:'complete'  },
  { poNo:'PO-2026-0180', title:'사무용 복합기 소모품', vendor:'코리아오피스', qty:20, unit:'SET', amt:1800000,  issued:'2026-03-25', due:'2026-04-10', ack:'확인완료', status:'complete'  },
];

const ST = {
  pending:   { label:'ACK 대기',  cls:'badge-pending'  },
  progress:  { label:'진행중',    cls:'badge-approved' },
  delivered: { label:'입고대기',  cls:'badge-warn'     },
  complete:  { label:'완료',      cls:'badge-draft'    },
};

function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

export default function init(container) {
  renderProcessTracker(container, 'po');
  renderPageHeader(container, {
    title: '발주 목록',
    subtitle: '발행된 구매 발주서 현황을 관리합니다.',
    actions: [
      { label: '+ 발주 등록', primary: true, pageId: 'po-new' },
      { label: '⬇ 엑셀', onClick: () => alert('엑셀 다운로드') },
    ],
  });

  const root = container.querySelector('#page-po-list');
  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary"><div class="stat-card-label">전체 발주</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card warn"><div class="stat-card-label">ACK 미확인</div><div class="stat-card-value">${MOCK.filter(r=>r.ack==='미확인').length}건</div></div>
      <div class="stat-card success"><div class="stat-card-label">진행중</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='progress').length}건</div></div>
      <div class="stat-card"><div class="stat-card-label">완료</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='complete').length}건</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 상태</option><option value="pending">ACK 대기</option><option value="progress">진행중</option><option value="delivered">입고대기</option><option value="complete">완료</option></select>
      <select id="f-ack"><option value="">ACK 전체</option><option value="확인완료">확인완료</option><option value="미확인">미확인</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="발주번호·품목명·협력사 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>발주번호</th><th>품목/용역명</th><th>협력사</th><th style="text-align:right">수량</th><th style="text-align:right">발주금액</th><th>발주일</th><th>납기일</th><th>ACK</th><th>상태</th><th>관리</th></tr></thead>
        <tbody id="po-tbody"></tbody>
      </table>
    </div>`;

  function render(data) {
    const today = new Date('2026-04-27');
    root.querySelector('#po-tbody').innerHTML = data.map(r => {
      const s = ST[r.status];
      const due = new Date(r.due);
      const dday = Math.ceil((due - today) / 86400000);
      const ddayColor = dday < 0 ? '#dc2626' : dday <= 7 ? '#c2410c' : 'var(--text-sub)';
      const ddayLabel = dday < 0 ? `D+${Math.abs(dday)}` : `D-${dday}`;
      return `<tr>
        <td style="font-weight:600;color:var(--primary-color)">${r.poNo}</td>
        <td>${r.title}</td>
        <td>${r.vendor}</td>
        <td style="text-align:right">${r.qty.toLocaleString()} ${r.unit}</td>
        <td style="text-align:right;font-weight:600">${fmt(r.amt)}</td>
        <td style="font-size:12px">${r.issued}</td>
        <td style="font-size:12px">${r.due} <span style="font-weight:700;color:${ddayColor}">${ddayLabel}</span></td>
        <td><span class="badge ${r.ack==='확인완료'?'badge-approved':'badge-urgent'}">${r.ack}</span></td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td class="td-actions">
          <button class="tbl-btn primary">상세</button>
          ${r.status==='delivered'?'<button class="tbl-btn" style="color:#16a34a">입고 확인</button>':''}
        </td>
      </tr>`;
    }).join('');
  }

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const ack = root.querySelector('#f-ack').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r =>
      (!st  || r.status === st) &&
      (!ack || r.ack === ack) &&
      (!kw  || r.poNo.toLowerCase().includes(kw) || r.title.toLowerCase().includes(kw) || r.vendor.toLowerCase().includes(kw))
    ));
  });

  render(MOCK);
}
export function cleanup() {}
