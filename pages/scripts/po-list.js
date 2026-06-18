import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid, statusBadge } from '../../components/grid.js';

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
  let grid = null;
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
    <div class="aisrm-grid-wrap">
      <div id="po-grid" class="aisrm-grid"></div>
    </div>`;

  function render(data) {
    const today = new Date('2026-04-27');
    const gridData = data.map(r => {
      const s = ST[r.status];
      const due = new Date(r.due);
      const dday = Math.ceil((due - today) / 86400000);
      const ddayLabel = dday < 0 ? `D+${Math.abs(dday)}` : `D-${dday}`;
      return { ...r, qtyText: `${r.qty.toLocaleString()} ${r.unit}`, amtText: fmt(r.amt), dueText: `${r.due} ${ddayLabel}`, statusLabel: s.label };
    });
    if (!grid) {
      grid = createAISRMGrid(root.querySelector('#po-grid'), {
        columns: [
          { name: 'poNo', header: '발주번호', width: 140, formatter: 'link' },
          { name: 'title', header: '품목/용역명', minWidth: 210 },
          { name: 'vendor', header: '협력사', width: 140 },
          { name: 'qtyText', header: '수량', width: 100, align: 'right' },
          { name: 'amtText', header: '발주금액', width: 120, align: 'right' },
          { name: 'issued', header: '발주일', width: 110 },
          { name: 'dueText', header: '납기일', width: 130 },
          { name: 'ack', header: 'ACK', width: 100, formatter: ({ value }) => statusBadge(value, value === '확인완료' ? 'green' : 'red') },
          { name: 'statusLabel', header: '상태', width: 100, formatter: ({ row }) => statusBadge(row.statusLabel, row.status === 'complete' ? 'gray' : row.status === 'pending' ? 'amber' : 'blue') },
          { name: '__actions', header: '관리', width: 130, formatter: ({ row }) => actionButtons([
            { label: '상세', primary: true, dataset: { action: 'detail', pono: row.poNo } },
            ...(row.status === 'delivered' ? [{ label: '입고 확인', dataset: { action: 'receive', pono: row.poNo } }] : [])
          ]) }
        ],
        data: gridData,
        bodyHeight: 360
      });
      return;
    }
    grid.setData(gridData);
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
