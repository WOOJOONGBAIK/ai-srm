(function () {
  'use strict';

  const grids = new Map();

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeColumns(columns) {
    return columns.map((column) => ({
      name: column.name,
      header: column.header,
      minWidth: column.minWidth || 90,
      width: column.width,
      align: column.align || 'left',
      whiteSpace: column.whiteSpace || 'normal',
      formatter: column.formatter
        ? ({ row, value }) => column.formatter(value, row)
        : undefined,
    }));
  }

  function fallbackTable(container, columns, rows, emptyMessage) {
    if (!rows.length) {
      container.innerHTML = `<div class="tpms-grid-empty">${escapeHTML(emptyMessage)}</div>`;
      return;
    }

    container.innerHTML = `
      <div class="tpms-grid-fallback">
        <table>
          <thead>
            <tr>${columns.map((column) => `<th>${escapeHTML(column.header)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${columns.map((column) => {
                  const value = row[column.name];
                  const html = column.formatter ? column.formatter(value, row) : escapeHTML(value);
                  return `<td style="text-align:${column.align || 'left'}">${html}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  window.TPMSGrid = {
    render(id, options) {
      const container = document.getElementById(id);
      if (!container) return;

      const rows = options.rows || [];
      const columns = options.columns || [];
      const emptyMessage = options.emptyMessage || '표시할 데이터가 없습니다.';

      const previous = grids.get(id);
      if (previous) {
        previous.destroy();
        grids.delete(id);
      }

      container.innerHTML = '';

      if (!window.tui || !window.tui.Grid) {
        fallbackTable(container, columns, rows, emptyMessage);
        return;
      }

      try {
        const grid = new window.tui.Grid({
          el: container,
          data: rows,
          columns: normalizeColumns(columns),
          rowHeight: 'auto',
          minRowHeight: 38,
          bodyHeight: options.bodyHeight || 'fitToParent',
          scrollX: true,
          scrollY: false,
          columnOptions: {
            resizable: true,
          },
          pageOptions: options.pageOptions || undefined,
        });

        grid.on('onGridMounted', () => grid.refreshLayout());
        grids.set(id, grid);
      } catch (error) {
        fallbackTable(container, columns, rows, emptyMessage);
        console.warn('TPMSGrid fallback:', error);
      }
    },

    html(value) {
      return value == null || value === '' ? '-' : escapeHTML(value);
    },
  };
})();
