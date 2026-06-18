import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid, statusBadge } from '../../components/grid.js';

const MOCK_DATA = [
  { prNo:'PR-2026-0421', title:'서버 HDD 증설 구매요청',    category:'장비', requester:'김민준', dept:'IT인프라팀', amt:4800000,  date:'2026-04-21', status:'pending',  urgent:true  },
  { prNo:'PR-2026-0420', title:'생산라인 부품 긴급 수급',    category:'자재', requester:'이서연', dept:'생산관리팀', amt:12500000, date:'2026-04-20', status:'approved', urgent:true  },
  { prNo:'PR-2026-0419', title:'사무용 소모품 정기 구매',    category:'소모품',requester:'박지훈', dept:'총무팀',    amt:380000,   date:'2026-04-19', status:'approved', urgent:false },
  { prNo:'PR-2026-0418', title:'금형 설계 외주 용역',        category:'서비스',requester:'최수아', dept:'개발팀',    amt:35000000, date:'2026-04-18', status:'draft',    urgent:false },
  { prNo:'PR-2026-0417', title:'안전장갑 및 보호구 구매',    category:'소모품',requester:'정태양', dept:'안전팀',    amt:650000,   date:'2026-04-17', status:'approved', urgent:false },
  { prNo:'PR-2026-0416', title:'ERP 라이선스 갱신',          category:'서비스',requester:'한지민', dept:'정보전략팀',amt:9200000,  date:'2026-04-16', status:'pending',  urgent:false },
  { prNo:'PR-2026-0415', title:'원자재 A-350 정기 발주',     category:'자재', requester:'오동현', dept:'자재팀',    amt:28000000, date:'2026-04-15', status:'approved', urgent:false },
  { prNo:'PR-2026-0414', title:'협력사 교육비 지원',         category:'서비스',requester:'임하은', dept:'구매팀',    amt:1500000,  date:'2026-04-14', status:'rejected', urgent:false },
  { prNo:'PR-2026-0413', title:'QC 검사장비 교정 서비스',    category:'서비스',requester:'강준호', dept:'품질팀',    amt:780000,   date:'2026-04-13', status:'approved', urgent:false },
  { prNo:'PR-2026-0412', title:'냉각 시스템 필터 교체 자재', category:'자재', requester:'윤서진', dept:'설비팀',    amt:2100000,  date:'2026-04-12', status:'pending',  urgent:false },
];

const STATUS_MAP = {
  draft:    { label:'임시저장', cls:'badge-draft'    },
  pending:  { label:'승인대기', cls:'badge-pending'  },
  approved: { label:'승인완료', cls:'badge-approved' },
  rejected: { label:'반려',     cls:'badge-rejected' },
};

function fmt(n) { return n.toLocaleString('ko-KR') + '원'; }

export default function init(container) {
  renderProcessTracker(container, 'pr');
  renderPageHeader(container, {
    title: 'PR 목록',
    subtitle: '전체 구매요청 현황을 조회하고 관리합니다.',
    actions: [
      { label: '+ 신규 등록', primary: true, pageId: 'pr-new' },
      { label: '⬇ 엑셀', onClick: () => alert('엑셀 다운로드') },
      { label: '🖨 출력', onClick: () => window.print() },
    ],
  });

  const root = container.querySelector('#page-pr-list');
  let grid = null;

  const total    = MOCK_DATA.length;
  const pending  = MOCK_DATA.filter(r => r.status === 'pending').length;
  const approved = MOCK_DATA.filter(r => r.status === 'approved').length;
  const urgent   = MOCK_DATA.filter(r => r.urgent).length;

  root.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card primary">
        <div class="stat-card-label">전체 PR</div>
        <div class="stat-card-value">${total}건</div>
        <div class="stat-card-sub">이번 달 누계</div>
      </div>
      <div class="stat-card warn">
        <div class="stat-card-label">승인 대기</div>
        <div class="stat-card-value">${pending}건</div>
        <div class="stat-card-sub">처리 필요</div>
      </div>
      <div class="stat-card success">
        <div class="stat-card-label">승인 완료</div>
        <div class="stat-card-value">${approved}건</div>
        <div class="stat-card-sub">이번 달</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-card-label">긴급 PR</div>
        <div class="stat-card-value">${urgent}건</div>
        <div class="stat-card-sub">즉시 처리 필요</div>
      </div>
    </div>

    <div class="filter-bar">
      <select id="f-status">
        <option value="">전체 상태</option>
        <option value="draft">임시저장</option>
        <option value="pending">승인대기</option>
        <option value="approved">승인완료</option>
        <option value="rejected">반려</option>
      </select>
      <select id="f-category">
        <option value="">전체 분류</option>
        <option value="자재">자재</option>
        <option value="장비">장비</option>
        <option value="소모품">소모품</option>
        <option value="서비스">서비스</option>
      </select>
      <select id="f-dept">
        <option value="">전체 부서</option>
        <option value="IT인프라팀">IT인프라팀</option>
        <option value="생산관리팀">생산관리팀</option>
        <option value="구매팀">구매팀</option>
        <option value="품질팀">품질팀</option>
      </select>
      <span class="filter-sep"></span>
      <input type="date" id="f-from" value="2026-04-01">
      <span style="font-size:12px;color:var(--text-sub)">~</span>
      <input type="date" id="f-to"   value="2026-04-30">
      <span class="filter-sep"></span>
      <input type="text" class="filter-keyword" id="f-keyword" placeholder="PR번호·제목·요청자 검색">
      <button class="pg-btn primary" id="btn-search">검색</button>
      <button class="pg-btn" id="btn-reset">초기화</button>
    </div>

    <div class="aisrm-grid-wrap">
      <div id="pr-grid" class="aisrm-grid"></div>
    </div>
    <div class="pagination" id="pagination"></div>`;

  let filtered = [...MOCK_DATA];

  function renderTable(data) {
    const gridData = data.map(r => {
      const s = STATUS_MAP[r.status];
      const tone = r.status === 'approved' ? 'green' : r.status === 'pending' ? 'amber' : r.status === 'rejected' ? 'red' : 'gray';
      return { ...r, statusLabel: s.label, statusTone: tone };
    });
    if (!grid) {
      grid = createAISRMGrid(root.querySelector('#pr-grid'), {
        rowHeaders: ['checkbox'],
        columns: [
          { name: 'prNo', header: 'PR번호', width: 140, formatter: 'link' },
          { name: 'title', header: '구매요청명', minWidth: 220, formatter: ({ row }) => `${row.title}${row.urgent ? ' ' + statusBadge('긴급', 'red') : ''}` },
          { name: 'category', header: '분류', width: 90, formatter: ({ value }) => statusBadge(value, 'gray') },
          { name: 'requester', header: '요청자', width: 90 },
          { name: 'dept', header: '부서', width: 120 },
          { name: 'amt', header: '예상금액', width: 120, formatter: ({ value }) => `${Number(value).toLocaleString('ko-KR')}원`, align: 'right' },
          { name: 'date', header: '요청일', width: 110 },
          { name: 'statusLabel', header: '상태', width: 100, formatter: ({ row }) => statusBadge(row.statusLabel, row.statusTone) },
          { name: '__actions', header: '관리', width: 150, formatter: ({ row }) => actionButtons([
            { label: '상세', primary: true, dataset: { action: 'detail', prno: row.prNo } },
            ...(row.status === 'draft' ? [{ label: '수정', dataset: { action: 'edit', prno: row.prNo } }] : []),
            ...(row.status === 'approved' ? [{ label: 'RFQ전환', dataset: { action: 'rfq', prno: row.prNo } }] : [])
          ]) }
        ],
        data: gridData,
        bodyHeight: 420
      });
      return;
    }
    grid.setData(gridData);
  }

  root.querySelector('#pr-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'detail') {
        history.pushState({ pageId: 'pr-detail' }, '', '?page=pr-detail');
        window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'pr-detail' } }));
    }
  });

  function renderPagination(total, page = 1, perPage = 10) {
    const pages = Math.ceil(total / perPage);
    const pg = root.querySelector('#pagination');
    pg.innerHTML = [
      `<button class="pg-page${page === 1 ? ' disabled' : ''}">‹</button>`,
      ...Array.from({ length: Math.min(pages, 5) }, (_, i) =>
        `<button class="pg-page${i + 1 === page ? ' active' : ''}">${i + 1}</button>`),
      `<button class="pg-page${page === pages ? ' disabled' : ''}">›</button>`,
    ].join('');
  }

  function applyFilter() {
    const status   = root.querySelector('#f-status').value;
    const category = root.querySelector('#f-category').value;
    const dept     = root.querySelector('#f-dept').value;
    const keyword  = root.querySelector('#f-keyword').value.toLowerCase();
    filtered = MOCK_DATA.filter(r =>
      (!status   || r.status   === status)   &&
      (!category || r.category === category) &&
      (!dept     || r.dept     === dept)     &&
      (!keyword  || r.prNo.toLowerCase().includes(keyword) ||
                    r.title.toLowerCase().includes(keyword) ||
                    r.requester.toLowerCase().includes(keyword))
    );
    renderTable(filtered);
    renderPagination(filtered.length);
  }

  root.querySelector('#btn-search').addEventListener('click', applyFilter);
  root.querySelector('#btn-reset').addEventListener('click', () => {
    ['f-status','f-category','f-dept','f-keyword'].forEach(id => {
      root.querySelector(`#${id}`).value = '';
    });
    applyFilter();
  });
  renderTable(MOCK_DATA);
  renderPagination(MOCK_DATA.length);
}

export function cleanup() {}
