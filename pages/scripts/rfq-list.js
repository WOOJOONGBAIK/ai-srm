import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { rfqNo:'RFQ-2026-0089', title:'베어링·씰 류 긴급 수급',     prNo:'PR-2026-0420', vendorCnt:3, recvCnt:3, deadline:'2026-04-22', status:'closed',  created:'2026-04-20' },
  { rfqNo:'RFQ-2026-0088', title:'서버 HDD 256GB 증설',         prNo:'PR-2026-0421', vendorCnt:4, recvCnt:2, deadline:'2026-04-28', status:'open',    created:'2026-04-21' },
  { rfqNo:'RFQ-2026-0087', title:'ERP 유지보수 서비스 견적',    prNo:'PR-2026-0416', vendorCnt:2, recvCnt:0, deadline:'2026-04-30', status:'open',    created:'2026-04-22' },
  { rfqNo:'RFQ-2026-0086', title:'금형 설계 외주 용역',         prNo:'PR-2026-0418', vendorCnt:5, recvCnt:4, deadline:'2026-04-25', status:'eval',    created:'2026-04-19' },
  { rfqNo:'RFQ-2026-0085', title:'사무용 복합기 리스 계약',     prNo:'PR-2026-0411', vendorCnt:3, recvCnt:3, deadline:'2026-04-20', status:'closed',  created:'2026-04-17' },
  { rfqNo:'RFQ-2026-0084', title:'원자재 A-350 단가 계약 갱신', prNo:'PR-2026-0415', vendorCnt:2, recvCnt:2, deadline:'2026-04-18', status:'awarded', created:'2026-04-15' },
];
const ST = {
  open:    { label:'진행중',   cls:'badge-progress' },
  closed:  { label:'마감',     cls:'badge-completed' },
  eval:    { label:'심사중',   cls:'badge-pending'  },
  awarded: { label:'낙찰완료', cls:'badge-approved' },
};

export default function init(container) {
  renderProcessTracker(container, 'rfq');
  renderPageHeader(container, {
    title: 'RFQ 목록',
    subtitle: '견적요청(RFQ) 및 입찰 현황을 관리합니다.',
    actions: [
      { label: '+ RFQ 등록', primary: true, pageId: 'rfq-new' },
      { label: '⬇ 엑셀', onClick: () => alert('엑셀 다운로드') },
    ],
  });

  const root = container.querySelector('#page-rfq-list');
  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary"><div class="stat-card-label">전체 RFQ</div><div class="stat-card-value">${MOCK.length}건</div><div class="stat-card-sub">이번 달</div></div>
      <div class="stat-card warn"><div class="stat-card-label">진행중</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='open').length}건</div><div class="stat-card-sub">견적 접수 대기</div></div>
      <div class="stat-card"><div class="stat-card-label">심사중</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='eval').length}건</div><div class="stat-card-sub">견적 비교 중</div></div>
      <div class="stat-card success"><div class="stat-card-label">낙찰 완료</div><div class="stat-card-value">${MOCK.filter(r=>r.status==='awarded').length}건</div><div class="stat-card-sub">이번 달</div></div>
    </div>
    <div class="filter-bar">
      <select id="f-status"><option value="">전체 상태</option><option value="open">진행중</option><option value="eval">심사중</option><option value="closed">마감</option><option value="awarded">낙찰완료</option></select>
      <input type="text" class="filter-keyword" id="f-kw" placeholder="RFQ번호·제목 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>RFQ번호</th><th>RFQ명</th><th>연결 PR</th><th style="text-align:center">발송업체</th><th style="text-align:center">접수건</th><th>마감일</th><th>등록일</th><th>상태</th><th>관리</th></tr>
        </thead>
        <tbody id="rfq-tbody"></tbody>
      </table>
    </div>`;

  function render(data) {
    root.querySelector('#rfq-tbody').innerHTML = data.map(r => {
      const s = ST[r.status];
      const rate = r.vendorCnt ? Math.round(r.recvCnt / r.vendorCnt * 100) : 0;
      return `<tr>
        <td style="font-weight:600;color:var(--primary-color)">${r.rfqNo}</td>
        <td>${r.title}</td>
        <td style="color:var(--text-sub)">${r.prNo}</td>
        <td style="text-align:center">${r.vendorCnt}개사</td>
        <td style="text-align:center">${r.recvCnt}건 <span style="color:var(--text-sub);font-size:11px">(${rate}%)</span></td>
        <td>${r.deadline}</td>
        <td>${r.created}</td>
        <td><span class="badge ${s.cls}">${s.label}</span></td>
        <td class="td-actions">
          <button class="tbl-btn primary" data-id="${r.rfqNo}">상세</button>
          ${r.status==='eval'||r.recvCnt>0 ? '<button class="tbl-btn" data-compare="1">비교</button>' : ''}
        </td>
      </tr>`;
    }).join('');
    root.querySelectorAll('[data-compare]').forEach(b => {
      b.addEventListener('click', () => {
        history.pushState({ pageId: 'rfq-compare' }, '', '?page=rfq-compare');
        window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'rfq-compare' } }));
      });
    });
  }

  root.querySelector('#btn-search').addEventListener('click', () => {
    const st = root.querySelector('#f-status').value;
    const kw = root.querySelector('#f-kw').value.toLowerCase();
    render(MOCK.filter(r => (!st || r.status === st) && (!kw || r.rfqNo.toLowerCase().includes(kw) || r.title.toLowerCase().includes(kw))));
  });

  render(MOCK);
}
export function cleanup() {}
