export const render = async (container, supabase) => {
  container.innerHTML = `
    <div style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>📋 게시판 관리</h2>
        <button class="nav-btn active" onclick="addBoardPost()">새 글 작성</button>
      </div>

      <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="padding: 1rem; border-bottom: 1px solid #e0e0e0; display: flex; gap: 1rem;">
          <select id="boardCategory" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <option value="">전체 카테고리</option>
            <option value="공지">공지</option>
            <option value="질문">질문</option>
            <option value="자유">자유</option>
          </select>
          <input type="text" id="boardSearch" placeholder="제목 검색..." style="flex: 1; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
          <button onclick="searchBoardPosts()" style="padding: 8px 16px; background: #005EB8; color: #fff; border: none; border-radius: 4px; cursor: pointer;">검색</button>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #f8f9fa;">
            <tr>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">번호</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">카테고리</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">제목</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">작성자</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">작성일</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">조회</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e0e0e0;">관리</th>
            </tr>
          </thead>
          <tbody id="boardTableBody">
            <!-- 게시글 목록이 여기에 표시됩니다 -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  loadBoardPosts();
};

const loadBoardPosts = async () => {
  // 가상 데이터로 게시글 목록 표시
  const mockPosts = [
    { id: 1, category: '공지', title: '시스템 점검 안내', author: '관리자', date: '2024-01-15', views: 125 },
    { id: 2, category: '질문', title: '구매요청 승인 절차 문의', author: '김철수', date: '2024-01-14', views: 45 },
    { id: 3, category: '자유', title: '신년 인사', author: '이영희', date: '2024-01-13', views: 78 },
  ];

  const tbody = document.getElementById('boardTableBody');
  tbody.innerHTML = mockPosts.map(post => `
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 12px;">${post.id}</td>
      <td style="padding: 12px;">${post.category}</td>
      <td style="padding: 12px;">${post.title}</td>
      <td style="padding: 12px;">${post.author}</td>
      <td style="padding: 12px;">${post.date}</td>
      <td style="padding: 12px;">${post.views}</td>
      <td style="padding: 12px; text-align: center;">
        <button onclick="editBoardPost(${post.id})" style="padding: 4px 8px; margin-right: 4px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer;">수정</button>
        <button onclick="deleteBoardPost(${post.id})" style="padding: 4px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">삭제</button>
      </td>
    </tr>
  `).join('');
};

window.addBoardPost = () => {
  alert('새 글 작성 기능 준비중입니다.');
};

window.editBoardPost = (id) => {
  alert(`게시글 ${id} 수정 기능 준비중입니다.`);
};

window.deleteBoardPost = (id) => {
  if (confirm(`게시글 ${id}을(를) 삭제하시겠습니까?`)) {
    alert('삭제되었습니다.');
    loadBoardPosts();
  }
};

window.searchBoardPosts = () => {
  const category = document.getElementById('boardCategory').value;
  const search = document.getElementById('boardSearch').value;
  alert(`카테고리: ${category}, 검색어: ${search} - 검색 기능 준비중입니다.`);
};