export const render = async (container, supabase) => {
  try {
    // HTML 템플릿 로드
    const response = await fetch('./features/notice/index.html');
    const html = await response.text();

    // HTML 파싱 및 body 내용 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.body.innerHTML;

    container.innerHTML = bodyContent;

    // 모듈 초기화 함수 호출
    if (window.noticeModule && window.noticeModule.init) {
      await window.noticeModule.init(container, supabase);
    }
  } catch (error) {
    console.error('Failed to load notice module:', error);
    container.innerHTML = '<p style="color:#c92a2a;">모듈 로드에 실패했습니다.</p>';
  }
};

const loadNotices = async () => {
  // 가상 데이터로 공지사항 목록 표시
  const mockNotices = [
    {
      id: 1,
      type: '긴급',
      title: '시스템 정기 점검 안내 (1/20 02:00-04:00)',
      content: '2024년 1월 20일 새벽 2시부터 4시까지 시스템 정기 점검이 진행됩니다. 해당 시간 동안 서비스 이용이 제한될 수 있으니 양해바랍니다.',
      author: '시스템관리자',
      created: '2024-01-15 09:00',
      updated: '2024-01-15 09:00',
      views: 245,
      important: true
    },
    {
      id: 2,
      type: '일반',
      title: '2024년 구매 프로세스 변경 안내',
      content: '2024년부터 구매요청 승인 프로세스가 일부 변경됩니다. 50만원 이상 품목의 경우 사업부장 결재가 추가로 필요합니다.',
      author: '구매팀장',
      created: '2024-01-10 14:30',
      updated: '2024-01-12 11:20',
      views: 189,
      important: false
    },
    {
      id: 3,
      type: '시스템',
      title: '신규 모듈 배포 완료',
      content: 'OCR 검증 모듈이 신규 배포되었습니다. 선적서류 검증 시 해당 기능을 활용해주세요.',
      author: '개발팀',
      created: '2024-01-08 16:45',
      updated: '2024-01-08 16:45',
      views: 156,
      important: false
    },
  ];

  const list = document.getElementById('noticeList');
  list.innerHTML = mockNotices.map(notice => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 12px; overflow: hidden; ${notice.important ? 'border-left: 4px solid #dc3545;' : ''}">
      <div style="padding: 1rem; background: ${notice.important ? '#fff5f5' : '#f8f9fa'}; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleNotice(${notice.id})">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="background: ${notice.type === '긴급' ? '#dc3545' : notice.type === '시스템' ? '#17a2b8' : '#005EB8'}; color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px;">${notice.type}</span>
            ${notice.important ? '<span style="color: #dc3545; font-weight: 600; font-size: 12px;">[중요]</span>' : ''}
          </div>
          <div style="font-weight: 600; margin-bottom: 4px;">${notice.title}</div>
          <div style="font-size: 12px; color: #666;">${notice.author} · ${notice.created} · 조회 ${notice.views}</div>
        </div>
        <span style="color: #666; font-size: 12px;">▼</span>
      </div>
      <div id="notice-content-${notice.id}" style="padding: 1rem; display: none; background: #fff; border-top: 1px solid #e0e0e0;">
        <div style="margin-bottom: 1rem; color: #333; line-height: 1.6;">${notice.content}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #999;">
          <span>최종수정: ${notice.updated}</span>
          <div>
            <button onclick="editNotice(${notice.id})" style="padding: 4px 8px; margin-right: 4px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer;">수정</button>
            <button onclick="deleteNotice(${notice.id})" style="padding: 4px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">삭제</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
};

window.toggleNotice = (id) => {
  const content = document.getElementById(`notice-content-${id}`);
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
};

window.addNotice = () => {
  alert('새 공지 작성 기능 준비중입니다.');
};

window.editNotice = (id) => {
  alert(`공지사항 ${id} 수정 기능 준비중입니다.`);
};

window.deleteNotice = (id) => {
  if (confirm(`공지사항 ${id}을(를) 삭제하시겠습니까?`)) {
    alert('삭제되었습니다.');
    loadNotices();
  }
};

window.searchNotices = () => {
  const type = document.getElementById('noticeType').value;
  const search = document.getElementById('noticeSearch').value;
  alert(`유형: ${type}, 검색어: ${search} - 검색 기능 준비중입니다.`);
};