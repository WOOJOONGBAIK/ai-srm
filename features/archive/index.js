/* [2026-05-21] 수정 시작 - 작성자: AI Agent
   사유: fetch로 가져온 HTML의 inline module script는 innerHTML 삽입 시 실행되지 않아
         자료실 목록 초기화와 삭제 후 새로고침에서 ReferenceError가 발생하는 문제 보완
--------------------------------------------------------------------------
// [AS-IS] 기존 코드 (주석 처리)
// 자료실 목록 렌더링은 features/archive/index.html 내부 <script type="module">의
// loadArchiveFiles()에만 의존했다.

// [TO-BE] 신규 코드 */
const ARCHIVE_MOCK_FILES = [
  { id: 1, name: '구매요청_매뉴얼.pdf', category: '매뉴얼', size: '2.3MB', uploader: '관리자', date: '2024-01-15', downloads: 45 },
  { id: 2, name: '계약서_양식.docx', category: '양식', size: '156KB', uploader: '김철수', date: '2024-01-14', downloads: 23 },
  { id: 3, name: '월간_보고서.xlsx', category: '보고서', size: '890KB', uploader: '이영희', date: '2024-01-13', downloads: 12 },
  { id: 4, name: '시스템_사용법.pptx', category: '매뉴얼', size: '5.2MB', uploader: '관리자', date: '2024-01-12', downloads: 78 },
];

function loadArchiveFiles() {
  const grid = document.getElementById('archiveGrid');
  if (!grid) return;

  grid.innerHTML = ARCHIVE_MOCK_FILES.map(file => `
    <div class="archive-item">
      <div class="archive-item-header">
        <span class="archive-icon">📄</span>
        <div class="archive-info">
          <div class="archive-name">${file.name}</div>
          <div class="archive-meta">${file.category} · ${file.size}</div>
        </div>
      </div>
      <div class="archive-details">
        업로더: ${file.uploader} | 업로드일: ${file.date} | 다운로드: ${file.downloads}회
      </div>
      <div class="archive-actions">
        <button class="btn-download" onclick="downloadArchiveFile(${file.id})">다운로드</button>
        <button class="btn-delete" onclick="deleteArchiveFile(${file.id})">삭제</button>
      </div>
    </div>
  `).join('');
}
/* --------------------------------------------------------------------------
   [2026-05-21] 수정 종료 */

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
    } else {
      /* [2026-05-21] 수정 시작 - 작성자: AI Agent
         사유: innerHTML로 삽입한 inline module script가 실행되지 않는 경우에도
               자료실 초기 목록을 표시하도록 fallback 초기화 추가
      --------------------------------------------------------------------------
      // [AS-IS] 기존 코드 (주석 처리)
      // window.archiveModule이 없으면 아무 동작도 하지 않음

      // [TO-BE] 신규 코드 */
      loadArchiveFiles();
      /* --------------------------------------------------------------------------
         [2026-05-21] 수정 종료 */
    }
  } catch (error) {
    console.error('Failed to load archive module:', error);
    container.innerHTML = '<p style="color:#c92a2a;">모듈 로드에 실패했습니다.</p>';
  }
};

/* [2026-05-21] 수정 시작 - 작성자: AI Agent
   사유: 파일 하단에 HTML 템플릿 일부가 JS 코드로 남아 SyntaxError가 발생하여,
         원본 조각은 보존하되 주석 처리해 모듈 파싱 오류를 제거
--------------------------------------------------------------------------
// [AS-IS] 기존 코드 (주석 처리)
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

// [TO-BE] 자료실 HTML 렌더링은 features/archive/index.html 내부 템플릿과
//         window.archiveModule 초기화 로직을 사용한다.
/* --------------------------------------------------------------------------
   [2026-05-21] 수정 종료 */

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
