import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

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

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" id="chk-all"></th>
            <th>PR번호</th><th>구매요청명</th><th>요청자</th><th>부서</th>
            <th style="text-align:right">금액</th><th>요청일</th><th>대기</th><th>처리</th>
          </tr>
        </thead>
        <tbody id="approve-tbody"></tbody>
      </table>
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
    const tbody = root.querySelector('#approve-tbody');
    tbody.innerHTML = MOCK_DATA.map(r => `
      <tr>
        <td><input type="checkbox" class="row-chk" data-prno="${r.prNo}"></td>
        <td style="font-weight:600;color:var(--primary-color)">${r.prNo}</td>
        <td>${r.title} ${r.urgent ? '<span class="badge badge-urgent">긴급</span>' : ''}</td>
        <td>${r.requester}</td><td>${r.dept}</td>
        <td style="text-align:right;font-weight:600">${fmt(r.amt)}</td>
        <td>${r.date}</td>
        <td style="font-weight:700;color:${r.dday==='오늘'?'#dc2626':'var(--text-sub)'}">${r.dday}</td>
        <td class="td-actions">
          <button class="tbl-btn primary" data-action="approve" data-prno="${r.prNo}">승인</button>
          <button class="tbl-btn danger"  data-action="reject"  data-prno="${r.prNo}">반려</button>
          <button class="tbl-btn"         data-action="view"    data-prno="${r.prNo}">상세</button>
        </td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { action, prno } = btn.dataset;
        if (action === 'view') {
          history.pushState({ pageId: 'pr-detail' }, '', '?page=pr-detail');
          window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'pr-detail' } }));
          return;
        }
        openModal(action, prno);
      });
    });

    root.querySelectorAll('.row-chk').forEach(chk => {
      chk.addEventListener('change', updateBulkPanel);
    });
  }

  function updateBulkPanel() {
    const checked = root.querySelectorAll('.row-chk:checked').length;
    const panel = root.querySelector('#bulk-panel');
    root.querySelector('#bulk-count').textContent = checked;
    panel.style.display = checked > 0 ? 'block' : 'none';
  }

  root.querySelector('#chk-all').addEventListener('change', e => {
    root.querySelectorAll('.row-chk').forEach(c => { c.checked = e.target.checked; });
    updateBulkPanel();
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
    const checked = [...root.querySelectorAll('.row-chk:checked')].map(c => c.dataset.prno);
    if (!checked.length) return;
    alert(`${checked.length}건 반려 처리 완료`);
  });

  window.bulkApprove = function() {
    const checked = [...root.querySelectorAll('.row-chk:checked')].map(c => c.dataset.prno);
    if (!checked.length) { alert('선택된 항목이 없습니다.'); return; }
    alert(`${checked.length}건 일괄 승인 완료`);
  };

  renderTable();
}

export function cleanup() { delete window.bulkApprove; }
