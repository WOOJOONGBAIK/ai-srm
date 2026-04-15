import { DataTable } from '../../components/table.js';
import { SearchFilter } from '../../components/table.js';
import { Modal, showConfirm } from '../../components/modal.js';
import { Notification } from '../../components/utils.js';

export const render = async (container, supabase) => {
  container.innerHTML = `
    <div style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>📋 게시판 관리</h2>
        <button class="nav-btn active" onclick="addBoardPost()">새 글 작성</button>
      </div>

      <div id="searchFilterContainer"></div>

      <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div id="tableContainer"></div>
      </div>
    </div>
  `;

  // 컴포넌트 초기화
  const searchFilter = new SearchFilter(
    document.getElementById('searchFilterContainer'),
    {
      searchPlaceholder: '제목 검색...',
      categories: [
        { value: '공지', label: '공지' },
        { value: '질문', label: '질문' },
        { value: '자유', label: '자유' }
      ]
    }
  );

  const table = new DataTable(
    document.getElementById('tableContainer'),
    {
      columns: [
        { header: '번호', field: 'id' },
        { header: '카테고리', field: 'category' },
        { header: '제목', field: 'title' },
        { header: '작성자', field: 'author' },
        {
          header: '작성일',
          field: 'date',
          formatter: (value) => new Date(value).toLocaleDateString('ko-KR')
        },
        { header: '조회', field: 'views' }
      ],
      actions: [
        { label: '수정', handler: 'editBoardPost', color: '#28a745' },
        { label: '삭제', handler: 'deleteBoardPost', color: '#dc3545' }
      ]
    }
  );

  // 검색 필터 이벤트
  searchFilter.render(
    (searchTerm, categoryValue) => {
      table.filter(searchTerm, 'category', categoryValue);
    },
    (categoryValue) => {
      table.filter('', 'category', categoryValue);
    }
  );

  loadBoardPosts(table);
};

const loadBoardPosts = async (table) => {
  // 가상 데이터로 게시글 목록 표시
  const mockPosts = [
    { id: 1, category: '공지', title: '시스템 점검 안내', author: '관리자', date: '2024-01-15', views: 125 },
    { id: 2, category: '질문', title: '구매요청 승인 절차 문의', author: '김철수', date: '2024-01-14', views: 45 },
    { id: 3, category: '자유', title: '신년 인사', author: '이영희', date: '2024-01-13', views: 78 },
  ];

  table.setData(mockPosts);
};

window.addBoardPost = () => {
  const modal = new Modal({ size: 'large' })
    .setTitle('새 글 작성')
    .setContent(`
      <form id="boardForm">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">카테고리</label>
          <select name="category" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <option value="공지">공지</option>
            <option value="질문">질문</option>
            <option value="자유">자유</option>
          </select>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">제목</label>
          <input type="text" name="title" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">내용</label>
          <textarea name="content" rows="10" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; resize: vertical;" required></textarea>
        </div>
      </form>
    `)
    .setFooter([
      { label: '취소' },
      { label: '저장', handler: () => saveBoardPost(modal), primary: true }
    ])
    .open();
};

const saveBoardPost = async (modal) => {
  const form = document.getElementById('boardForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // 여기서 실제 저장 로직 구현
  console.log('저장할 데이터:', data);

  Notification.success('게시글이 저장되었습니다.');
  modal.close();
  // 테이블 리프레시
  location.reload();
};

window.editBoardPost = (id) => {
  Notification.info(`게시글 ${id} 수정 기능 준비중입니다.`);
};

window.deleteBoardPost = (id) => {
  showConfirm(`게시글 ${id}을(를) 삭제하시겠습니까?`, () => {
    Notification.success('삭제되었습니다.');
    // 실제 삭제 로직과 테이블 리프레시
    location.reload();
  });
};