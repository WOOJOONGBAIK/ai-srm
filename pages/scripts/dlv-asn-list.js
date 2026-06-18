import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid, statusBadge } from '../../components/grid.js';

const MOCK = [
  { asnNo:'ASN-2026-0301', poNo:'PO-2026-0198', vendor:'ABC베어링',    title:'베어링·씰류 자재', qty:500, unit:'EA', etd:'2026-05-08', eta:'2026-05-10', status:'transit',  carrier:'한진택배',   trackNo:'1234567890' },
  { asnNo:'ASN-2026-0298', poNo:'PO-2026-0195', vendor:'테크모터(주)', title:'ERP 유지보수 서비스', qty:1, unit:'식', etd:'2026-04-20', eta:'2026-04-28', status:'arrived',  carrier:'-',          trackNo:'-'          },
  { asnNo:'ASN-2026-0290', poNo:'PO-2026-0180', vendor:'코리아오피스', title:'사무용 복합기 소모품', qty:20, unit:'SET', etd:'2026-04-08', eta:'2026-04-10', status:'received', carrier:'CJ대한통운', trackNo:'9876543210' },
  { asnNo:'ASN-2026-0285', poNo:'PO-2026-0185', vendor:'대한물류',     title:'물류 운송 서비스 4월', qty:1, unit:'식', etd:'2026-04-28', eta:'2026-04-30', status:'pending',  carrier:'-',          trackNo:'-'          },
  { asnNo:'ASN-2026-0270', poNo:'PO-2026-0170', vendor:'한국원자재',   title:'원자재 A-350 선적', qty:2000, unit:'KG', etd:'2026-04-25', eta:'2026-05-02', status:'transit',  carrier:'해운물류',    trackNo:'SHIP-20260425' },
];

const ST = {
  pending:  { label:'출하 예정',  cls:'badge-draft'    },
  transit:  { label:'운송중',     cls:'badge-pending'  },
  arrived:  { label:'입고 대기',  cls:'badge-warn'     },
  received: { label:'입고 완료',  cls:'badge-approved' },
};

export default function init(container) {
  renderProcessTracker(container, 'delivery');
  renderPageHeader(container, {
    title: 'ASN 목록 (납기 현황)',
    subtitle: '협력사 출하 통보(ASN) 및 입고 현황을 확인합니다.',
    actions: [
      { label: '납기 지연 분석', pageId: 'dlv-delay-analysis' },
      { label: '⬇ 엑셀', onClick: () => alert('엑셀 다운로드') },
    ],
  });

  const root = container.querySelector('#page-dlv-asn-list');
  let grid = null;
  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary"><div class="stat-card-label">전체 ASN</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card warn"><div class="stat-card-label">운송중</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='transit').length}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">입고 대기</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='arrived').length}건</div></div>
      <div class="stat-card success"><div class="stat-card-label">입고 완료</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='received').length}건</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 상태</option><option value="pending">출하 예정</option><option value="transit">운송중</option><option value="arrived">입고 대기</option><option value="received">입고 완료</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="ASN번호·PO번호·협력사·품목명 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="aisrm-grid-wrap">
      <div id="asn-grid" class="aisrm-grid"></div>
    </div>`;

  function render(data) {
    const today = new Date('2026-04-27');
    const gridData = data.map(r => {
      const s = ST[r.status];
      const eta = new Date(r.eta);
      const dday = Math.ceil((eta - today) / 86400000);
      const isLate = dday < 0 && r.status !== 'received';
      return { ...r, qtyText: `${r.qty.toLocaleString()} ${r.unit}`, etaText: `${r.eta}${r.status !== 'received' ? ` ${isLate ? `D+${Math.abs(dday)}` : `D-${dday}`}` : ''}`, statusLabel: s.label };
    });
    if (!grid) {
      grid = createAISRMGrid(root.querySelector('#asn-grid'), {
        columns: [
          { name: 'asnNo', header: 'ASN번호', width: 145, formatter: 'link' },
          { name: 'poNo', header: '연결 PO', width: 140 },
          { name: 'vendor', header: '협력사', width: 140 },
          { name: 'title', header: '품목명', minWidth: 190 },
          { name: 'qtyText', header: '수량', width: 100, align: 'right' },
          { name: 'etd', header: '출하일(ETD)', width: 120 },
          { name: 'etaText', header: '도착예정(ETA)', width: 140 },
          { name: 'carrier', header: '운송사', width: 110 },
          { name: 'trackNo', header: '운송장번호', width: 140, formatter: 'link' },
          { name: 'statusLabel', header: '상태', width: 105, formatter: ({ row }) => statusBadge(row.statusLabel, row.status === 'received' ? 'green' : row.status === 'arrived' ? 'amber' : row.status === 'transit' ? 'blue' : 'gray') },
          { name: '__actions', header: '관리', width: 120, formatter: ({ row }) => actionButtons([
            ...(row.status === 'arrived' ? [{ label: '입고 처리', primary: true, dataset: { action: 'receive', asn: row.asnNo } }] : []),
            ...(row.status === 'transit' ? [{ label: '추적', dataset: { action: 'track', asn: row.asnNo } }] : []),
            ...(row.status === 'received' ? [{ label: '내역', dataset: { action: 'history', asn: row.asnNo } }] : [])
          ]) }
        ],
        data: gridData,
        bodyHeight: 360
      });
      return;
    }
    grid.setData(gridData);
  }

  root.querySelector('#asn-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'receive') {
        if (confirm(`${btn.dataset.asn} 입고 처리하시겠습니까?\n입고 처리 후 IQC 검사 단계로 이동합니다.`)) {
          alert('입고 처리 완료. IQC 검사 대기열에 등록되었습니다.');
        }
    }
    if (btn.dataset.action === 'track') alert(`운송 추적: ${btn.dataset.asn}`);
  });

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r =>
      (!st || r.status === st) &&
      (!kw || r.asnNo.toLowerCase().includes(kw) || r.poNo.toLowerCase().includes(kw) ||
              r.vendor.toLowerCase().includes(kw) || r.title.toLowerCase().includes(kw))
    ));
  });

  render(MOCK);
}
export function cleanup() {}
