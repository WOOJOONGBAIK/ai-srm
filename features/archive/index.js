export const render = async (container, supabase) => {
  try {
    // HTML 템플릿 로드
    const response = await fetch('./features/archive/index.html');
    const html = await response.text();

    // HTML 파싱 및 body 내용 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.body.innerHTML;

    container.innerHTML = bodyContent;

    // 모듈 초기화 함수 호출
    if (window.archiveModule && window.archiveModule.init) {
      await window.archiveModule.init(container, supabase);
    }
  } catch (error) {
    console.error('Failed to load archive module:', error);
    container.innerHTML = '<p style="color:#c92a2a;">모듈 로드에 실패했습니다.</p>';
  }
};
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