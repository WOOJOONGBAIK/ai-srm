import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid, statusBadge } from '../../components/grid.js';

const MOCK_DATA = [
  { prNo:'PR-2026-0422', title:'물류창고 지게차 배터리 교체',   requester:'강동원', dept:'물류팀',    amt:3200000,  date:'2026-04-27', urgent:true,  dday:'오늘' },
  { prNo:'PR-2026-0421', title:'서버 HDD 증설 구매요청',        requester:'김민준', dept:'IT인프라팀',amt:4800000,  date:'2026-04-26', urgent:true,  dday:'1일' },
  { prNo:'PR-2026-0416', title:'ERP 라이선스 갱신',             requester:'한지민', dept:'정보전략팀',amt:9200000,  date:'2026-04-25', urgent:false, dday:'2일' },
  { prNo:'PR-2026-0410', title:'냉각 시스템 필터 교체 자재',    requester:'윤서진', dept:'설비팀',    amt:2100000,  date:'2026-04-24', urgent:false, dday:'3일' },
  { prNo:'PR-2026-0408', title:'품질 검사 장비 소모품',         requester:'신미래', dept:'품질팀',    amt:760000,   date:'2026-04-23', urgent:false, dday:'4일' },
];

function fmt(n) { return n.toLocaleString('ko-KR') + '원'; }

export default function init(container) {
  renderProcessTracker(container, 'pr');
  renderPageHeader(container, {
    title: '승인 대기 목록',
    subtitle: '나의 결재를 기다리는 구매요청 목록입니다.',
    actions: [
      { label: '일괄 승인', primary: true, onClick: () => bulkApprove() },
      { label: '목록으로',  pageId: 'pr-list' },
    ],
  });

  const root = container.querySelector('#page-pr-approve-list');
  let grid = null;
  root.innerHTML = `
    <div class="stat-cards" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card warn">
        <div class="stat-card-label">승인 대기</div>
        <div class="stat-card-value">${MOCK_DATA.length}건</div>
        <div class="stat-card-sub">즉시 처리 필요</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-card-label">긴급 건</div>
        <div class="stat-card-value">${MOCK_DATA.filter(r=>r.urgent).length}건</div>
        <div class="stat-card-sub">오늘 처리 권고</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">평균 대기 기간</div>
        <div class="stat-card-value">2.4일</div>
        <div class="stat-card-sub">이번 달 기준</div>
      </div>
    </div>

    <div class="aisrm-grid-wrap">
      <div id="approve-grid" class="aisrm-grid"></div>
    </div>

    <!-- 일괄 처리 패널 -->
    <div id="bulk-panel" style="display:none;margin-top:16px;padding:16px 20px;
         background:var(--bg-gray);border:1px solid var(--border-color);border-radius:10px">
      <div style="font-size:13px;font-weight:700;margin-bottom:10px">일괄 처리 <span id="bulk-count" style="color:var(--primary-color)">0</span>건 선택됨</div>
      <div class="form-field" style="max-width:500px;margin-bottom:12px">
        <label class="form-label">의견 (선택)</label>
        <textarea class="form-textarea" id="bulk-opinion" rows="2" placeholder="일괄 승인/반려 사유를 입력하세요"></textarea>
      </div>
      <div style="display:flex;gap:8px">
        <button class="pg-btn primary" id="btn-bulk-approve">✓ 일괄 승인</button>
        <button class="pg-btn danger"  id="btn-bulk-reject">✗ 일괄 반려</button>
      </div>
    </div>

    <!-- 단건 처리 모달 -->
    <div id="proc-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9000;
         display:none;align-items:center;justify-content:center">
      <div style="background:var(--panel-bg);border-radius:12px;width:480px;padding:28px;
           box-shadow:0 12px 40px rgba(0,0,0,0.2)">
        <div style="font-size:16px;font-weight:800;margin-bottom:4px" id="modal-title">승인 처리</div>
        <div style="font-size:13px;color:var(--text-sub);margin-bottom:20px" id="modal-prno"></div>
        <div class="form-field" style="margin-bottom:16px">
          <label class="form-label">의견</label>
          <textarea class="form-textarea" id="modal-opinion" rows="3" placeholder="승인/반려 의견을 입력하세요"></textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px">
          <button class="pg-btn" id="modal-cancel">취소</button>
          <button class="pg-btn primary" id="modal-confirm">확인</button>
        </div>
      </div>
    </div>`;

  function renderTable() {
    const gridData = MOCK_DATA.map(r => ({ ...r, amtText: fmt(r.amt) }));
    grid = createAISRMGrid(root.querySelector('#approve-grid'), {
      rowHeaders: ['checkbox'],
      columns: [
        { name: 'prNo', header: 'PR번호', width: 140, formatter: 'link' },
        { name: 'title', header: '구매요청명', minWidth: 220, formatter: ({ row }) => `${row.title}${row.urgent ? ' ' + statusBadge('긴급', 'red') : ''}` },
        { name: 'requester', header: '요청자', width: 90 },
        { name: 'dept', header: '부서', width: 120 },
        { name: 'amtText', header: '금액', width: 120, align: 'right' },
        { name: 'date', header: '요청일', width: 110 },
        { name: 'dday', header: '대기', width: 90, formatter: ({ value }) => statusBadge(value, value === '오늘' ? 'red' : 'amber') },
        { name: '__actions', header: '처리', width: 160, formatter: ({ row }) => actionButtons([
          { label: '승인', primary: true, dataset: { action: 'approve', prno: row.prNo } },
          { label: '반려', danger: true, dataset: { action: 'reject', prno: row.prNo } },
          { label: '상세', dataset: { action: 'view', prno: row.prNo } }
        ]) }
      ],
      data: gridData,
      bodyHeight: 340,
      onCheck: updateBulkPanel
    });
  }

  function updateBulkPanel() {
    const checked = grid?.getCheckedRows().length ?? 0;
    const panel = root.querySelector('#bulk-panel');
    root.querySelector('#bulk-count').textContent = checked;
    panel.style.display = checked > 0 ? 'block' : 'none';
  }

  root.querySelector('#approve-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, prno } = btn.dataset;
    if (action === 'view') {
      history.pushState({ pageId: 'pr-detail' }, '', '?page=pr-detail');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'pr-detail' } }));
      return;
    }
    openModal(action, prno);
  });

  let _modalAction = '', _modalPrno = '';
  const modal = root.querySelector('#proc-modal');

  function openModal(action, prno) {
    _modalAction = action; _modalPrno = prno;
    root.querySelector('#modal-title').textContent = action === 'approve' ? '승인 처리' : '반려 처리';
    root.querySelector('#modal-prno').textContent = prno;
    root.querySelector('#modal-opinion').value = '';
    modal.style.display = 'flex';
  }

  root.querySelector('#modal-cancel').addEventListener('click', () => { modal.style.display = 'none'; });
  root.querySelector('#modal-confirm').addEventListener('click', () => {
    alert(`${_modalPrno} ${_modalAction === 'approve' ? '승인' : '반려'} 처리 완료`);
    modal.style.display = 'none';
  });

  root.querySelector('#btn-bulk-approve').addEventListener('click', () => bulkApprove());
  root.querySelector('#btn-bulk-reject').addEventListener('click',  () => {
    const checked = (grid?.getCheckedRows() ?? []).map(r => r.prNo);
    if (!checked.length) return;
    alert(`${checked.length}건 반려 처리 완료`);
  });

  window.bulkApprove = function() {
    const checked = (grid?.getCheckedRows() ?? []).map(r => r.prNo);
    if (!checked.length) { alert('선택된 항목이 없습니다.'); return; }
    alert(`${checked.length}건 일괄 승인 완료`);
  };

  renderTable();
}

export function cleanup() { delete window.bulkApprove; }
