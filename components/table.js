// 공통 테이블 컴포넌트
export class DataTable {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.data = [];
    this.filteredData = [];
  }

  setData(data) {
    this.data = data;
    this.filteredData = [...data];
    this.render();
  }

  filter(searchTerm, categoryField, categoryValue) {
    this.filteredData = this.data.filter(item => {
      const matchesSearch = !searchTerm ||
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory = !categoryValue ||
        item[categoryField] === categoryValue;

      return matchesSearch && matchesCategory;
    });
    this.render();
  }

  render() {
    const { columns, actions } = this.config;

    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background: #f8f9fa;">
          <tr>
            ${columns.map(col => `
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">${col.header}</th>
            `).join('')}
            ${actions ? `<th style="padding: 12px; text-align: center; border-bottom: 1px solid #e0e0e0;">관리</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this.filteredData.map((item, index) => `
            <tr style="border-bottom: 1px solid #f0f0f0;">
              ${columns.map(col => `
                <td style="padding: 12px;">${this.formatCell(item, col)}</td>
              `).join('')}
              ${actions ? `
                <td style="padding: 12px; text-align: center;">
                  ${actions.map(action => `
                    <button onclick="${action.handler}(${item.id})" style="padding: 4px 8px; margin-right: 4px; background: ${action.color || '#005EB8'}; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">${action.label}</button>
                  `).join('')}
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    this.container.innerHTML = tableHTML;
  }

  formatCell(item, column) {
    const value = item[column.field];
    if (column.formatter) {
      return column.formatter(value, item);
    }
    return value || '';
  }
}

// 검색 필터 컴포넌트
export class SearchFilter {
  constructor(container, config) {
    this.container = container;
    this.config = config;
  }

  render(onSearch, onFilter) {
    const { searchPlaceholder, categories } = this.config;

    const filterHTML = `
      <div style="padding: 1rem; border-bottom: 1px solid #e0e0e0; display: flex; gap: 1rem;">
        ${categories ? `
          <select id="categoryFilter" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <option value="">전체 카테고리</option>
            ${categories.map(cat => `<option value="${cat.value}">${cat.label}</option>`).join('')}
          </select>
        ` : ''}
        <input type="text" id="searchInput" placeholder="${searchPlaceholder || '검색...'}" style="flex: 1; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
        <button onclick="performSearch()" style="padding: 8px 16px; background: #005EB8; color: #fff; border: none; border-radius: 4px; cursor: pointer;">검색</button>
      </div>
    `;

    this.container.innerHTML = filterHTML;

    // 이벤트 핸들러 설정
    window.performSearch = () => {
      const searchTerm = document.getElementById('searchInput').value;
      const categoryValue = document.getElementById('categoryFilter')?.value;
      if (onSearch) onSearch(searchTerm, categoryValue);
    };
  }
}