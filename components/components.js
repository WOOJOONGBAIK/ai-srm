/**
 * UI 컴포넌트 모음
 */

// 1. 로그인 카드 컴포넌트
export const renderLoginCard = () => `
  <div class="section-card login-card">
    <div class="card-header">
      <h3 class="section-title">로그인</h3>
    </div>
    <div class="card-body">
      <form id="loginForm">
        <div class="form-group">
          <label>아이디</label>
          <input type="text" id="username" placeholder="아이디를 입력하세요" required>
        </div>
        <div class="form-group">
          <label>비밀번호</label>
          <input type="password" id="password" placeholder="비밀번호를 입력하세요" required>
        </div>
        <button type="submit" class="login-btn">로그인</button>
      </form>
      <div class="login-footer">
        <a href="#" onclick="alert('관리자에게 문의하세요.')">아이디/비번 찾기</a>
        <a href="#" style="font-weight: 700; color: #ffeb3b;">신규 협력사 등록 →</a>
      </div>
    </div>
  </div>
`;

// 2. 퀵 가이드 컴포넌트 (아이콘 데이터 기반)
export const renderQuickGuide = (guides) => `
  <div class="quick-guide">
    ${guides.map(guide => `
      <div class="guide-item" onclick="location.href='${guide.link}'">
        <span class="guide-icon">${guide.icon}</span>
        <span class="guide-text">${guide.text}</span>
      </div>
    `).join('')}
  </div>
`;

// 3. 리스트 아이템 컴포넌트 (공지사항, 자료실 공용)
export const renderListSection = (title, items) => `
  <div class="section-card">
    <div class="card-header">
      <h3 class="section-title">${title}</h3>
    </div>
    <div class="card-body">
      ${items.length > 0 ? items.map(item => `
        <div class="list-item" onclick="handleItemClick('${title}', ${item.id})">
          <div class="list-content">
            <div class="list-title">${item.title}</div>
            <div class="list-date">${item.created_at?.split('T')[0] || item.date}</div>
          </div>
          <span class="chevron">›</span>
        </div>
      `).join('') : '<p class="empty-msg">데이터가 없습니다.</p>'}
    </div>
  </div>
`;

// 4. 지원/FAQ 컴포넌트
export const renderSupportCard = (contacts) => `
  <div class="section-card">
    <div class="card-header">
      <h3 class="section-title">고객지원</h3>
    </div>
    <div class="card-body support-body">
      <div class="contact-box">
        <div class="contact-title">시스템 이용 문의 (평일 09:00~18:00)</div>
        <div class="contact-info">📞 ${contacts.phone}</div>
        <div class="contact-info" style="font-size: 13px; margin-top: 5px;">📧 ${contacts.email}</div>
      </div>
      <div class="button-group">
        <button class="sub-btn" onclick="window.open('https://remotedesktop.google.com/')">원격 지원 연결</button>
        <button class="sub-btn">자주 묻는 질문(FAQ)</button>
      </div>
    </div>
  </div>
`;