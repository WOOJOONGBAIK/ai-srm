export const render = async (container, supabase) => {
  container.innerHTML = `
    <div style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>📁 자료실 관리</h2>
        <button class="nav-btn active" onclick="uploadArchiveFile()">파일 업로드</button>
      </div>

      <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="padding: 1rem; border-bottom: 1px solid #e0e0e0; display: flex; gap: 1rem;">
          <select id="archiveCategory" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <option value="">전체 카테고리</option>
            <option value="매뉴얼">매뉴얼</option>
            <option value="양식">양식</option>
            <option value="보고서">보고서</option>
            <option value="기타">기타</option>
          </select>
          <input type="text" id="archiveSearch" placeholder="파일명 검색..." style="flex: 1; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
          <button onclick="searchArchiveFiles()" style="padding: 8px 16px; background: #005EB8; color: #fff; border: none; border-radius: 4px; cursor: pointer;">검색</button>
        </div>

        <div style="padding: 1rem;">
          <div id="archiveGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            <!-- 파일 목록이 여기에 표시됩니다 -->
          </div>
        </div>
      </div>
    </div>
  `;

  loadArchiveFiles();
};

const loadArchiveFiles = async () => {
  // 가상 데이터로 파일 목록 표시
  const mockFiles = [
    { id: 1, name: '구매요청_매뉴얼.pdf', category: '매뉴얼', size: '2.3MB', uploader: '관리자', date: '2024-01-15', downloads: 45 },
    { id: 2, name: '계약서_양식.docx', category: '양식', size: '156KB', uploader: '김철수', date: '2024-01-14', downloads: 23 },
    { id: 3, name: '월간_보고서.xlsx', category: '보고서', size: '890KB', uploader: '이영희', date: '2024-01-13', downloads: 12 },
    { id: 4, name: '시스템_사용법.pptx', category: '매뉴얼', size: '5.2MB', uploader: '관리자', date: '2024-01-12', downloads: 78 },
  ];

  const grid = document.getElementById('archiveGrid');
  grid.innerHTML = mockFiles.map(file => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; background: #fff;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 24px; margin-right: 8px;">📄</span>
        <div style="flex: 1; overflow: hidden;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</div>
          <div style="font-size: 12px; color: #666;">${file.category} · ${file.size}</div>
        </div>
      </div>
      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
        업로더: ${file.uploader} · ${file.date} · 다운로드: ${file.downloads}회
      </div>
      <div style="display: flex; gap: 4px;">
        <button onclick="downloadArchiveFile(${file.id})" style="flex: 1; padding: 6px; background: #005EB8; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">다운로드</button>
        <button onclick="editArchiveFile(${file.id})" style="padding: 6px 8px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">수정</button>
        <button onclick="deleteArchiveFile(${file.id})" style="padding: 6px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">삭제</button>
      </div>
    </div>
  `).join('');
};

window.uploadArchiveFile = () => {
  alert('파일 업로드 기능 준비중입니다.');
};

window.downloadArchiveFile = (id) => {
  alert(`파일 ${id} 다운로드 기능 준비중입니다.`);
};

window.editArchiveFile = (id) => {
  alert(`파일 ${id} 수정 기능 준비중입니다.`);
};

window.deleteArchiveFile = (id) => {
  if (confirm(`파일 ${id}을(를) 삭제하시겠습니까?`)) {
    alert('삭제되었습니다.');
    loadArchiveFiles();
  }
};

window.searchArchiveFiles = () => {
  const category = document.getElementById('archiveCategory').value;
  const search = document.getElementById('archiveSearch').value;
  alert(`카테고리: ${category}, 검색어: ${search} - 검색 기능 준비중입니다.`);
};