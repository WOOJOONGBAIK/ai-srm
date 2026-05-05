/**
 * page-header.js
 * 공통 페이지 헤더 컴포넌트
 *
 * 사용법:
 *   renderPageHeader(container, {
 *     title: 'PR 목록',
 *     subtitle: '전체 구매요청 현황을 조회합니다.',   // 선택
 *     actions: [
 *       { label: '신규 등록', primary: true, pageId: 'pr-new' },
 *       { label: '엑셀 다운', icon: '⬇', onClick: () => {} },
 *     ]
 *   });
 */

const CSS = `
<style data-component="page-header">
.pg-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 20px; gap: 16px; flex-wrap: wrap;
}
.pg-header-left { display: flex; flex-direction: column; gap: 4px; }
.pg-header-title {
  font-size: 20px; font-weight: 800; color: var(--text-main);
  letter-spacing: -0.3px; line-height: 1.2;
}
.pg-header-sub {
  font-size: 13px; color: var(--text-sub); font-weight: 400;
}
.pg-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pg-btn {
  padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
  border: 1px solid var(--border-color); background: var(--panel-bg); color: var(--text-main);
}
.pg-btn:hover { background: var(--bg-gray); }
.pg-btn.primary {
  background: var(--primary-color); color: #fff; border-color: var(--primary-color);
}
.pg-btn.primary:hover { background: var(--primary-hover); }
.pg-btn.danger { border-color: #fca5a5; color: #dc2626; }
.pg-btn.danger:hover { background: #fff5f5; }
[data-theme='dark'] .pg-btn { background: var(--panel-bg); }
[data-theme='dark'] .pg-btn:hover { background: rgba(255,255,255,0.05); }
[data-theme='dark'] .pg-btn.primary { background: #3b82f6; border-color: #3b82f6; }

/* 공통 상태 뱃지 */
.badge {
  display: inline-flex; align-items: center; padding: 3px 8px;
  border-radius: 10px; font-size: 11px; font-weight: 600; white-space: nowrap;
}
.badge-draft    { background: #f1f5f9; color: #64748b; }
.badge-pending  { background: #fff7ed; color: #c2410c; }
.badge-approved { background: #f0fdf4; color: #16a34a; }
.badge-rejected { background: #fff1f2; color: #e11d48; }
.badge-completed{ background: #eff6ff; color: #1d4ed8; }
.badge-progress { background: #fefce8; color: #854d0e; }
.badge-cancel   { background: #fafafa; color: #737373; }
.badge-urgent   { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
[data-theme='dark'] .badge-draft    { background: #1e293b; color: #94a3b8; }
[data-theme='dark'] .badge-approved { background: #14532d; color: #4ade80; }
[data-theme='dark'] .badge-pending  { background: #431407; color: #fb923c; }
[data-theme='dark'] .badge-rejected { background: #4c0519; color: #f43f5e; }
[data-theme='dark'] .badge-completed{ background: #1e3a5f; color: #60a5fa; }

/* 공통 필터 바 */
.filter-bar {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 12px 16px; background: var(--bg-gray); border-radius: 8px;
  margin-bottom: 16px; border: 1px solid var(--border-color);
}
.filter-bar select, .filter-bar input[type="text"],
.filter-bar input[type="date"] {
  padding: 7px 10px; border: 1px solid var(--border-color);
  border-radius: 6px; font-size: 13px; background: var(--panel-bg);
  color: var(--text-main); outline: none; transition: border 0.15s;
}
.filter-bar select:focus, .filter-bar input:focus {
  border-color: var(--primary-color);
}
.filter-bar .filter-sep { width: 1px; height: 20px; background: var(--border-color); }
.filter-keyword { flex: 1; min-width: 180px; max-width: 280px; }

/* 공통 데이터 테이블 */
.data-table-wrap {
  border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden;
}
.data-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
  background: var(--panel-bg);
}
.data-table thead { background: var(--bg-gray); }
.data-table th {
  padding: 10px 14px; text-align: left; font-weight: 700;
  color: var(--text-sub); border-bottom: 1px solid var(--border-color);
  white-space: nowrap; font-size: 12px;
}
.data-table td {
  padding: 11px 14px; border-bottom: 1px solid var(--border-color);
  color: var(--text-main); vertical-align: middle;
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: var(--bg-gray); cursor: pointer; }
.data-table .td-actions { display: flex; gap: 4px; }
.tbl-btn {
  padding: 3px 9px; border-radius: 4px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: 1px solid var(--border-color);
  background: var(--panel-bg); color: var(--text-main); transition: 0.15s;
}
.tbl-btn:hover { background: var(--bg-gray); }
.tbl-btn.primary { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
.tbl-btn.danger { color: #dc2626; border-color: #fca5a5; }
.tbl-btn.danger:hover { background: #fff5f5; }

/* 페이지네이션 */
.pagination {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  padding: 16px 0 4px;
}
.pg-page {
  min-width: 32px; height: 32px; border-radius: 6px; font-size: 13px; font-weight: 500;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 1px solid var(--border-color);
  background: var(--panel-bg); color: var(--text-sub); transition: 0.15s;
}
.pg-page:hover { background: var(--bg-gray); color: var(--text-main); }
.pg-page.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); font-weight: 700; }
.pg-page.disabled { opacity: 0.3; pointer-events: none; }

/* 폼 공통 */
.form-section {
  background: var(--panel-bg); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 24px; margin-bottom: 16px;
}
.form-section-title {
  font-size: 14px; font-weight: 700; color: var(--text-main);
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.form-grid.col3 { grid-template-columns: repeat(3, 1fr); }
.form-grid.col1 { grid-template-columns: 1fr; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field.span2 { grid-column: span 2; }
.form-field.span3 { grid-column: span 3; }
.form-label {
  font-size: 12px; font-weight: 600; color: var(--text-sub);
}
.form-label .req { color: #e11d48; margin-left: 2px; }
.form-input, .form-select, .form-textarea {
  padding: 9px 12px; border: 1px solid var(--border-color);
  border-radius: 7px; font-size: 13px; background: var(--panel-bg);
  color: var(--text-main); outline: none; font-family: inherit;
  transition: border 0.15s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary-color); background: var(--panel-bg);
}
.form-textarea { resize: vertical; min-height: 80px; }
.form-input[readonly] { background: var(--bg-gray); color: var(--text-sub); }

/* 통계 카드 */
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-card {
  background: var(--panel-bg); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 16px 20px;
}
.stat-card-label { font-size: 12px; color: var(--text-sub); font-weight: 500; margin-bottom: 8px; }
.stat-card-value { font-size: 22px; font-weight: 800; color: var(--text-main); line-height: 1; }
.stat-card-sub { font-size: 11px; color: var(--text-sub); margin-top: 6px; }
.stat-card.primary .stat-card-value { color: var(--primary-color); }
.stat-card.success .stat-card-value { color: #16a34a; }
.stat-card.warn .stat-card-value    { color: #c2410c; }
.stat-card.danger .stat-card-value  { color: #dc2626; }
@media (max-width: 900px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .form-grid { grid-template-columns: 1fr; }
  .form-field.span2, .form-field.span3 { grid-column: span 1; }
}
</style>`;

export function renderPageHeader(container, { title, subtitle = '', actions = [] }) {
  const existing = container.querySelector('.pg-header');
  if (existing) existing.remove();

  if (!document.head.querySelector('style[data-component="page-header"]')) {
    const tmp = document.createElement('div');
    tmp.innerHTML = CSS;
    document.head.appendChild(tmp.querySelector('style'));
  }

  const actionsHtml = actions.map(a => {
    const cls = a.primary ? 'primary' : a.danger ? 'danger' : '';
    const icon = a.icon ? `<span>${a.icon}</span>` : '';
    return `<button class="pg-btn ${cls}" data-action="${a.pageId || ''}">${icon}${a.label}</button>`;
  }).join('');

  const header = document.createElement('div');
  header.className = 'pg-header';
  header.innerHTML = `
    <div class="pg-header-left">
      <div class="pg-header-title">${title}</div>
      ${subtitle ? `<div class="pg-header-sub">${subtitle}</div>` : ''}
    </div>
    <div class="pg-header-actions">${actionsHtml}</div>`;

  actions.forEach((a, i) => {
    if (a.onClick || a.pageId) {
      header.querySelectorAll('.pg-btn')[i].addEventListener('click', () => {
        if (a.onClick) { a.onClick(); return; }
        if (a.pageId) {
          const url = new URL(window.location.href);
          url.searchParams.set('page', a.pageId);
          history.pushState({ pageId: a.pageId }, '', url.toString());
          window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: a.pageId } }));
        }
      });
    }
  });

  const tracker = container.querySelector('.proc-tracker');
  if (tracker) tracker.after(header);
  else container.insertBefore(header, container.firstChild);
}
