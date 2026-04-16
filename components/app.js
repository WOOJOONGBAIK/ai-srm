import { CRUDManager, FormValidator } from './crud.js';
import * as UI from './components.js';

// Supabase 인스턴스 (실제 설정 필요)
const supabase = /* supabase 초기화 객체 */;

const noticeManager = new CRUDManager('notices', supabase);
const faqManager = new CRUDManager('faqs', supabase);

async function initPortal() {
  const mainLayout = document.getElementById('mainLayout');
  
  // 1. 데이터 로드 (CRUDManager 활용)
  const { data: notices } = await noticeManager.read({}, { limit: 5, orderBy: 'created_at' });
  
  // 2. 가상 데이터 (퀵가이드, 연락처)
  const guides = [
    { icon: '📘', text: '이용 가이드', link: '#' },
    { icon: '🔐', text: '인증서 안내', link: '#' },
    { icon: '⚙️', text: '환경 설정', link: '#' }
  ];
  const contacts = { phone: '02-1234-5678', email: 'it-support@company.com' };

  // 3. 렌더링 (높낮이가 맞춰진 그리드 안에 삽입)
  mainLayout.innerHTML = `
    <div id="loginContainer">${UI.renderLoginCard()}</div>
    
    <div class="center-column">
      ${UI.renderQuickGuide(guides)}
      ${UI.renderListSection('시스템 공지사항', notices || [])}
    </div>
    
    <div id="supportContainer">${UI.renderSupportCard(contacts)}</div>
  `;

  // 4. 이벤트 바인딩 (로그인 검증)
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleLogin(e) {
  e.preventDefault();
  const formData = {
    username: e.target.username.value,
    password: e.target.password.value
  };

  const rules = {
    username: ['required', { type: 'minLength', param: 4 }],
    password: ['required', { type: 'minLength', param: 6 }]
  };

  const { isValid, errors } = FormValidator.validate(formData, rules);

  if (!isValid) {
    alert(Object.values(errors)[0][0]); // 첫 번째 에러 메시지 출력
    return;
  }

  // 실제 로그인 로직 처리...
  console.log('로그인 시도:', formData);
}

window.onload = initPortal;