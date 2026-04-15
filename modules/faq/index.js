export const render = async (container, supabase) => {
  container.innerHTML = `
    <div style="padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>❓ FAQ 관리</h2>
        <button class="nav-btn active" onclick="addFAQ()">새 FAQ 추가</button>
      </div>

      <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="padding: 1rem; border-bottom: 1px solid #e0e0e0; display: flex; gap: 1rem;">
          <select id="faqCategory" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <option value="">전체 카테고리</option>
            <option value="시스템 이용">시스템 이용</option>
            <option value="인증 관련">인증 관련</option>
            <option value="서류 제출">서류 제출</option>
            <option value="기타">기타</option>
          </select>
          <input type="text" id="faqSearch" placeholder="질문 검색..." style="flex: 1; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px;">
          <button onclick="searchFAQs()" style="padding: 8px 16px; background: #005EB8; color: #fff; border: none; border-radius: 4px; cursor: pointer;">검색</button>
        </div>

        <div style="padding: 1rem;">
          <div id="faqList" style="max-height: 600px; overflow-y: auto;">
            <!-- FAQ 목록이 여기에 표시됩니다 -->
          </div>
        </div>
      </div>
    </div>
  `;

  loadFAQs();
};

const loadFAQs = async () => {
  // 가상 데이터로 FAQ 목록 표시
  const mockFAQs = [
    {
      id: 1,
      category: '시스템 이용',
      question: '로그인 비밀번호를 잊어버렸어요. 어떻게 해야 하나요?',
      answer: '로그인 화면에서 "비밀번호 찾기" 버튼을 클릭하시면 등록된 이메일로 임시 비밀번호가 발송됩니다. 임시 비밀번호로 로그인하신 후, 마이페이지에서 비밀번호를 변경해주세요.',
      created: '2024-01-15',
      updated: '2024-01-15'
    },
    {
      id: 2,
      category: '인증 관련',
      question: 'SSO 로그인은 어떻게 사용하나요?',
      answer: '로그인 화면에서 "SSO 로그인" 버튼을 클릭하시면 회사 포털 인증을 통해 자동으로 로그인됩니다. 별도의 아이디/비밀번호 입력이 필요하지 않습니다.',
      created: '2024-01-14',
      updated: '2024-01-14'
    },
    {
      id: 3,
      category: '서류 제출',
      question: '구매요청 시 필요한 첨부서류는 무엇인가요?',
      answer: '기본적으로 구매요청서, 견적서, 품의서가 필요합니다. 고가품목(100만원 이상)의 경우 추가로 사업부장 결재를 받아주세요.',
      created: '2024-01-13',
      updated: '2024-01-16'
    },
  ];

  const list = document.getElementById('faqList');
  list.innerHTML = mockFAQs.map(faq => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 8px; overflow: hidden;">
      <div style="padding: 1rem; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="toggleFAQ(${faq.id})">
        <div>
          <span style="background: #005EB8; color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 8px;">${faq.category}</span>
          <span style="font-weight: 600;">${faq.question}</span>
        </div>
        <span style="color: #666; font-size: 12px;">▼</span>
      </div>
      <div id="faq-answer-${faq.id}" style="padding: 1rem; display: none; background: #fff; border-top: 1px solid #e0e0e0;">
        <div style="margin-bottom: 1rem; color: #666; font-size: 14px; line-height: 1.6;">${faq.answer}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #999;">
          <span>생성: ${faq.created} | 수정: ${faq.updated}</span>
          <div>
            <button onclick="editFAQ(${faq.id})" style="padding: 4px 8px; margin-right: 4px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer;">수정</button>
            <button onclick="deleteFAQ(${faq.id})" style="padding: 4px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">삭제</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
};

window.toggleFAQ = (id) => {
  const answer = document.getElementById(`faq-answer-${id}`);
  answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
};

window.addFAQ = () => {
  alert('새 FAQ 추가 기능 준비중입니다.');
};

window.editFAQ = (id) => {
  alert(`FAQ ${id} 수정 기능 준비중입니다.`);
};

window.deleteFAQ = (id) => {
  if (confirm(`FAQ ${id}을(를) 삭제하시겠습니까?`)) {
    alert('삭제되었습니다.');
    loadFAQs();
  }
};

window.searchFAQs = () => {
  const category = document.getElementById('faqCategory').value;
  const search = document.getElementById('faqSearch').value;
  alert(`카테고리: ${category}, 검색어: ${search} - 검색 기능 준비중입니다.`);
};