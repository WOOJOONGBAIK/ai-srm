import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { iqcNo:'IQC-2026-0201', poNo:'PO-2026-0198', vendor:'ABC베어링',    item:'베어링·씰류 자재',   lot:'LOT-2604-001', qty:500, inspected:500, pass:498, fail:2, failRate:0.4, received:'2026-04-26', status:'pass',    inspector:'김검수' },
  { iqcNo:'IQC-2026-0198', poNo:'PO-2026-0195', vendor:'테크모터(주)', item:'ERP 유지보수 서비스', lot:'-',             qty:1,  inspected:1,   pass:1,  fail:0, failRate:0,   received:'2026-04-25', status:'pass',    inspector:'이품질' },
  { iqcNo:'IQC-2026-0190', poNo:'PO-2026-0180', vendor:'코리아오피스', item:'사무용 복합기 소모품',lot:'LOT-2603-042', qty:20, inspected:20,  pass:18, fail:2, failRate:10,  received:'2026-04-10', status:'cond',    inspector:'박검사' },
  { iqcNo:'IQC-2026-0185', poNo:'PO-2026-0170', vendor:'한국원자재',   item:'원자재 A-350',        lot:'LOT-2604-010', qty:2000,inspected:100,pass:60, fail:40,failRate:40,  received:'2026-04-27', status:'pending', inspector:'-'      },
  { iqcNo:'IQC-2026-0180', poNo:'PO-2026-0160', vendor:'대한물류',     item:'운송 포장재',          lot:'LOT-2603-055', qty:200,inspected:200, pass:200,fail:0, failRate:0,   received:'2026-04-05', status:'pass',    inspector:'최품질' },
  { iqcNo:'IQC-2026-0175', poNo:'PO-2026-0155', vendor:'(주)정밀금형', item:'시제품 금형',          lot:'LOT-2603-030', qty:3,  inspected:3,   pass:1,  fail:2, failRate:66.7,received:'2026-04-01', status:'fail',    inspector:'김검수' },
];

const ST = {
  pending: { label:'검사 대기', cls:'badge-draft'    },
  pass:    { label:'합격',      cls:'badge-approved' },
  cond:    { label:'조건부 합격',cls:'badge-warn'    },
  fail:    { label:'불합격',    cls:'badge-urgent'   },
};

export default function init(container) {
  renderProcessTracker(container, 'iqc');
  renderPageHeader(container, {
    title: 'IQC 검사 목록',
    subtitle: '입고 품질 검사(IQC) 현황 및 결과를 관리합니다.',
    actions: [
      { label: '클레임 목록', pageId: 'qa-claim-list' },
      { label: '⬇ 성적서 출력', onClick: () => window.print() },
    ],
  });

  const root = container.querySelector('#page-qa-iqc-list');
  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary"><div class="stat-card-label">전체 검사</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card warn"><div class="stat-card-label">검사 대기</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='pending').length}건</div></div>
      <div class="stat-card success"><div class="stat-card-label">합격</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='pass').length}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">불합격</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='fail').length}건</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 결과</option><option value="pending">검사 대기</option><option value="pass">합격</option><option value="cond">조건부 합격</option><option value="fail">불합격</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="IQC번호·협력사·품목명 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>IQC번호</th><th>연결 PO</th><th>협력사</th><th>품목명</th><th>LOT번호</th><th style="text-align:right">입고수량</th><th style="text-align:right">검사수량</th><th style="text-align:right">합격</th><th style="text-align:right">불합격</th><th>불량률</th><th>입고일</th><th>결과</th><th>관리</th></tr></thead>
        <tbody id="iqc-tbody"></tbody>
      </table>
    </div>`;

  function render(data) {
    root.querySelector('#iqc-tbody').innerHTML = data.map(r => {
      const s = ST[r.status];
      const failColor = r.failRate >= 30 ? '#dc2626' : r.failRate >= 10 ? '#c2410c' : 'var(--text-sub)';
      return `<tr>
        <td style="font-weight:600;color:var(--primary-color)">${r.iqcNo}</td>
        <td style="font-size:12px;color:var(--text-sub)">${r.poNo}</td>
        <td>${r.vendor}</td>
        <td>${r.item}</td>
        <td style="font-size:12px">${r.lot}</td>
        <td style="text-align:right">${r.qty.toLocaleString()}</td>
        <td style="text-align:right">${r.inspected.toLocaleString()}</td>
        <td style="text-align:right;color:#16a34a;font-weight:600">${r.pass.toLocaleString()}</td>
        <td style="text-align:right;color:${r.fail?'#dc2626':'var(--text-sub)'};font-weight:${r.fail?'700':'400'}">${r.fail}</td>
        <td><span style="font-weight:700;color:${failColor}">${r.failRate}%</span></td>
        <td style="font-size:12px">${r.received}</td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td class="td-actions">
          ${r.status==='pending'?`<button class="tbl-btn primary insp-btn" data-iqc="${r.iqcNo}">검사 입력</button>`:''}
          ${r.status==='fail'?`<button class="tbl-btn danger claim-btn" data-iqc="${r.iqcNo}">클레임 등록</button>`:''}
          <button class="tbl-btn">성적서</button>
        </td>
      </tr>`;
    }).join('');

    root.querySelectorAll('.insp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const result = prompt(`${btn.dataset.iqc} 검사 결과를 입력하세요:\n1 = 합격\n2 = 조건부 합격\n3 = 불합격`);
        if (result === '1') alert('합격 처리 완료. 창고 입고 승인이 진행됩니다.');
        else if (result === '2') alert('조건부 합격 처리. 사용 부서 승인 후 입고됩니다.');
        else if (result === '3') alert('불합격 처리. 반품/클레임 절차를 진행하세요.');
      });
    });

    root.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(`${btn.dataset.iqc} 불합격 건에 대한 클레임을 등록하시겠습니까?`)) {
          alert('클레임 등록 완료. 협력사에 통보됩니다.');
        }
      });
    });
  }

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r =>
      (!st || r.status === st) &&
      (!kw || r.iqcNo.toLowerCase().includes(kw) || r.vendor.toLowerCase().includes(kw) || r.item.toLowerCase().includes(kw))
    ));
  });

  render(MOCK);
}
export function cleanup() {}
