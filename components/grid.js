/*
============================================================
History Log
------------------------------------------------------------
| 날짜       | 작성자   | 변경 사유                                |
| 2026-06-17 | AI Agent | [GRID] TOAST UI Grid 표준 래퍼 추가      |
============================================================
*/

/* [2026-06-17] 수정 시작 - 작성자: AI Agent
   사유: AISRM 전체 목록/조회 화면의 그리드를 TOAST UI Grid로 표준화
--------------------------------------------------------------------------
// [AS-IS] 화면별 HTML table 또는 components/table.js 문자열 렌더링 사용

// [TO-BE] 신규 코드 */
const GRID_CSS_URL = 'https://uicdn.toast.com/grid/latest/tui-grid.css';
const GRID_JS_URL = 'https://uicdn.toast.com/grid/latest/tui-grid.js';
const THEME_CSS_URL = new URL('./grid-theme.css', import.meta.url).href;

let gridLoadPromise = null;
let themeApplied = false;

export const gridFormatters = {
  text: value => value ?? '',
  number: value => `<span class="grid-cell-number">${formatNumber(value)}</span>`,
  amount: value => `<span class="grid-cell-number">${formatNumber(value)}</span>`,
  date: value => value ?? '',
  link: value => `<span class="grid-cell-link">${escapeHtml(value ?? '')}</span>`,
  badge: (value, color = 'gray') => `<span class="grid-badge ${color}">${escapeHtml(value ?? '')}</span>`
};

export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString('ko-KR');
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function statusBadge(label, tone = 'gray') {
  return `<span class="grid-badge ${tone}">${escapeHtml(label)}</span>`;
}

export function actionButtons(buttons = []) {
  return `<span class="grid-actions">${buttons.map(btn => {
    const cls = btn.primary ? 'grid-btn primary' : btn.danger ? 'grid-btn danger' : 'grid-btn';
    const disabled = btn.disabled ? ' disabled' : '';
    const attrs = Object.entries(btn.dataset ?? {})
      .map(([key, value]) => ` data-${key}="${escapeHtml(value)}"`)
      .join('');
    return `<button type="button" class="${cls}"${attrs}${disabled}>${escapeHtml(btn.label)}</button>`;
  }).join('')}</span>`;
}

export function ensureGridAssets() {
  if (gridLoadPromise) return gridLoadPromise;

  gridLoadPromise = new Promise((resolve, reject) => {
    injectStylesheet(GRID_CSS_URL, 'toast-ui-grid-css');
    injectStylesheet(THEME_CSS_URL, 'aisrm-grid-theme-css');

    if (window.tui?.Grid) {
      applyTheme(window.tui.Grid);
      resolve(window.tui.Grid);
      return;
    }

    const existing = document.querySelector('script[data-grid-script="toast-ui-grid"]');
    if (existing) {
      existing.addEventListener('load', () => {
        applyTheme(window.tui.Grid);
        resolve(window.tui.Grid);
      });
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = GRID_JS_URL;
    script.async = true;
    script.dataset.gridScript = 'toast-ui-grid';
    script.onload = () => {
      if (!window.tui?.Grid) {
        reject(new Error('TOAST UI Grid global was not found.'));
        return;
      }
      applyTheme(window.tui.Grid);
      resolve(window.tui.Grid);
    };
    script.onerror = () => reject(new Error('TOAST UI Grid script failed to load.'));
    document.head.appendChild(script);
  });

  return gridLoadPromise;
}

export function createAISRMGrid(el, options = {}) {
  const container = normalizeContainer(el);
  const gridHost = document.createElement('div');
  const wrap = document.createElement('div');
  wrap.className = 'aisrm-grid-wrap';
  gridHost.className = 'aisrm-grid';
  gridHost.textContent = '';
  wrap.appendChild(gridHost);
  container.textContent = '';
  container.appendChild(wrap);

  const state = {
    instance: null,
    container,
    el: gridHost,
    data: options.data ?? [],
    setData(data) {
      state.data = data ?? [];
      if (state.instance) state.instance.resetData(state.data);
    },
    getCheckedRows() {
      return state.instance?.getCheckedRows?.() ?? [];
    },
    destroy() {
      state.instance?.destroy?.();
      state.instance = null;
    },
    refreshLayout() {
      state.instance?.refreshLayout?.();
    }
  };

  gridHost.innerHTML = '<div class="aisrm-grid-loading">그리드를 불러오는 중입니다.</div>';

  ensureGridAssets()
    .then(Grid => {
      gridHost.textContent = '';
      state.instance = new Grid({
        el: gridHost,
        data: state.data,
        scrollX: true,
        scrollY: true,
        bodyHeight: options.bodyHeight ?? 420,
        rowHeight: options.rowHeight ?? 38,
        minRowHeight: options.minRowHeight ?? 38,
        header: { height: options.headerHeight ?? 38 },
        columnOptions: { resizable: true, ...(options.columnOptions ?? {}) },
        rowHeaders: options.rowHeaders ?? [],
        columns: normalizeColumns(options.columns ?? []),
        pageOptions: options.pageOptions,
        summary: options.summary,
        treeColumnOptions: options.treeColumnOptions
      });

      bindGridEvents(state.instance, options);
      if (typeof options.onReady === 'function') {
        options.onReady({ grid: state.instance, state });
      }
    })
    .catch(error => {
      console.error('[AISRM Grid] load failed:', error);
      gridHost.innerHTML = `<div class="aisrm-grid-fallback">표준 그리드를 불러오지 못했습니다. 네트워크 또는 CDN 연결을 확인하세요.</div>`;
    });

  return state;
}

function normalizeContainer(el) {
  if (!el) throw new Error('Grid container is required.');
  if (el.tagName === 'TBODY') {
    const table = el.closest('table');
    const replacement = document.createElement('div');
    replacement.className = 'aisrm-grid-mount';
    table.replaceWith(replacement);
    return replacement;
  }
  return el;
}

function normalizeColumns(columns) {
  return columns.map(col => ({
    sortable: true,
    escapeHTML: false,
    ...col,
    formatter: normalizeFormatter(col)
  }));
}

function normalizeFormatter(col) {
  if (typeof col.formatter === 'function') return col.formatter;
  if (col.formatter === 'number') return ({ value }) => gridFormatters.number(value);
  if (col.formatter === 'amount') return ({ value }) => gridFormatters.amount(value);
  if (col.formatter === 'link') return ({ value }) => gridFormatters.link(value);
  return col.formatter;
}

function bindGridEvents(grid, options) {
  if (typeof options.onClick === 'function') {
    grid.on('click', ev => options.onClick({ ...ev, row: grid.getRow(ev.rowKey), grid }));
  }
  if (typeof options.onDblclick === 'function') {
    grid.on('dblclick', ev => options.onDblclick({ ...ev, row: grid.getRow(ev.rowKey), grid }));
  }
  if (typeof options.onCheck === 'function') {
    grid.on('check', ev => options.onCheck({ ...ev, checkedRows: grid.getCheckedRows(), grid }));
    grid.on('uncheck', ev => options.onCheck({ ...ev, checkedRows: grid.getCheckedRows(), grid }));
    grid.on('checkAll', ev => options.onCheck({ ...ev, checkedRows: grid.getCheckedRows(), grid }));
    grid.on('uncheckAll', ev => options.onCheck({ ...ev, checkedRows: grid.getCheckedRows(), grid }));
  }
  if (typeof options.onEditingFinish === 'function') {
    grid.on('editingFinish', ev => options.onEditingFinish({ ...ev, row: grid.getRow(ev.rowKey), grid }));
  }
}

function injectStylesheet(href, id) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function applyTheme(Grid) {
  if (themeApplied || !Grid?.applyTheme) return;
  Grid.applyTheme('clean', {
    outline: { border: '#d6dde6' },
    cell: {
      normal: {
        background: '#ffffff',
        border: '#e4ebf2',
        text: '#1f2933'
      },
      header: {
        background: '#f4f8fb',
        border: '#d6dde6',
        text: '#103b6d'
      },
      rowHeader: {
        background: '#f4f8fb',
        border: '#d6dde6',
        text: '#607080'
      },
      selectedHeader: {
        background: '#e8f2ff'
      },
      evenRow: {
        background: '#fbfdff'
      }
    }
  });
  themeApplied = true;
}
/* --------------------------------------------------------------------------
   [2026-06-17] 수정 종료 */
