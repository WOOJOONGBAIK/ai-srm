import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

export default function init(container) {
  renderProcessTracker(container, 'contract');
  renderPageHeader(container, {
    title: '계약서 작성',
    subtitle: '신규 계약서를 작성하고 전자 서명을 요청합니다.',
    actions: [
      { label: '계약 목록', pageId: 'ct-list' },
      { label: '임시저장', onClick: () => alert('임시저장 완료') },
      { label: '서명 요청', primary: true, onClick: () => submitContract() },
    ],
  });

  const root = container.querySelector('#page-ct-new');
  root.innerHTML = `
    <div class="form-section">
      <div class="form-section-title">계약 기본 정보</div>
      <div class="form-grid">
        <div class="form-field"><label class="form-label">계약번호</label><input class="form-input" value="CT-2026-0125" readonly></div>
        <div class="form-field"><label class="form-label">계약 유형 <span class="req">*</span></label>
          <select class="form-select" id="f-type">
            <option>일반계약</option><option>단가계약</option><option>서비스계약</option><option>리스계약</option>
          </select>
        </div>
        <div class="form-field span2"><label class="form-label">계약명 <span class="req">*</span></label><input class="form-input" id="f-title" placeholder="계약 제목을 입력하세요"></div>
        <div class="form-field"><label class="form-label">협력사 <span class="req">*</span></label><input class="form-input" id="f-vendor" value="(주)정밀금형" readonly></div>
        <div class="form-field"><label class="form-label">계약 담당자</label><input class="form-input" value="홍길동 (구매팀)"></div>
        <div class="form-field"><label class="form-label">계약 시작일 <span class="req">*</span></label><input class="form-input" type="date" id="f-start" value="2026-04-27"></div>
        <div class="form-field"><label class="form-label">계약 종료일 <span class="req">*</span></label><input class="form-input" type="date" id="f-end"></div>
        <div class="form-field"><label class="form-label">계약 금액 <span class="req">*</span></label><input class="form-input" type="number" id="f-amt" placeholder="원 단위 입력"></div>
        <div class="form-field"><label class="form-label">부가세 포함 여부</label>
          <select class="form-select"><option value="Y">포함</option><option value="N">별도</option></select>
        </div>
        <div class="form-field span2"><label class="form-label">계약 요약 / 특약사항</label>
          <textarea class="form-textarea" id="f-note" rows="4" placeholder="계약의 주요 내용 및 특약 사항을 기재하세요"></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">계약 조건</div>
      <div class="form-grid col3">
        ${[['납기 조건','계약 후 30일 이내'],['결제 조건','월말 마감 익월 10일'],['지연 배상금','1일 0.1% (계약금액 기준)'],['하자 보증','준공 후 1년'],['이행 보증','계약금액의 10%'],['분쟁 해결','서울중앙지방법원']].map(([l,v]) => `
          <div class="form-field">
            <label class="form-label">${l}</label>
            <input class="form-input" value="${v}">
          </div>`).join('')}
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">계약서 파일</div>
      <div style="padding:32px;border:2px dashed var(--border-color);border-radius:8px;text-align:center;cursor:pointer;transition:0.2s"
           id="drop-zone" onmouseover="this.style.borderColor='var(--primary-color)'" onmouseout="this.style.borderColor='var(--border-color)'">
        <div style="font-size:32px;margin-bottom:8px">📄</div>
        <div style="font-weight:600;color:var(--text-main)">계약서 파일을 드래그하거나 클릭하여 업로드</div>
        <div style="font-size:12px;color:var(--text-sub);margin-top:4px">PDF, DOCX · 최대 20MB</div>
        <button class="pg-btn" style="margin-top:12px">파일 선택</button>
      </div>
      <div style="margin-top:10px;padding:10px 14px;background:var(--bg-gray);border-radius:6px;font-size:13px;color:var(--text-sub)">
        📄 금형설계용역계약서_v2.docx <span style="margin-left:8px;color:#16a34a;font-weight:600">업로드 완료</span>
      </div>
    </div>

    <div class="form-section">
      <div class="form-section-title">전자 서명 순서</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${[['1','갑 (당사)','홍길동','구매팀장'],['2','을 (협력사)','김대표','(주)정밀금형']].map(([n,role,name,org]) => `
          <div style="flex:1;min-width:180px;padding:16px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-gray)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-color);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">${n}</div>
              <span style="font-size:12px;color:var(--text-sub)">${role}</span>
            </div>
            <div style="font-weight:700">${name}</div>
            <div style="font-size:12px;color:var(--text-sub)">${org}</div>
          </div>`).join('<div style="display:flex;align-items:center;font-size:24px;color:var(--text-sub)">›</div>')}
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button class="pg-btn" onclick="history.back()">취소</button>
      <button class="pg-btn" onclick="alert('임시저장 완료')">임시저장</button>
      <button class="pg-btn primary" onclick="submitContract()">서명 요청 발송</button>
    </div>`;

  window.submitContract = () => {
    const title = root.querySelector('#f-title').value;
    if (!title) { alert('계약명을 입력하세요.'); return; }
    alert('계약서 서명 요청이 발송되었습니다.\n담당자에게 이메일 및 알림이 전송됩니다.');
    history.pushState({ pageId: 'ct-sign-queue' }, '', '?page=ct-sign-queue');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'ct-sign-queue' } }));
  };
}
export function cleanup() { delete window.submitContract; }
