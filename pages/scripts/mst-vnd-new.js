import { renderPageHeader } from '../../components/page-header.js';

const DB_KEY   = 'srm_vnd_master';
const SEQ_KEY  = 'srm_vnd_seq';

/* ── 탭 정의 ── */
const TABS = [
  { id: 'general', label: '일반 데이터',     tcode: 'XK01-G' },
  { id: 'company', label: '회사코드 데이터', tcode: 'XK01-C' },
  { id: 'purch',   label: '구매조직 데이터', tcode: 'XK01-P' },
];

/* ── 유틸 ── */
const $ = id => document.getElementById(id);
let _activeTab = 'general';

function loadDB() {
  try { return JSON.parse(sessionStorage.getItem(DB_KEY)) ?? []; }
  catch { return []; }
}
function saveDB(data) { sessionStorage.setItem(DB_KEY, JSON.stringify(data)); }

function nextLifnr() {
  const db  = loadDB();
  const max = db.reduce((m, v) => Math.max(m, parseInt(v.lifnr, 10) || 0), 1000000);
  const next = max + 1;
  sessionStorage.setItem(SEQ_KEY, String(next));
  return String(next);
}

function today() { return new Date().toISOString().slice(0, 10); }

/* ── 탭 전환 ── */
function switchTab(tabId) {
  _activeTab = tabId;
  document.querySelectorAll('.vnd-form-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.vnd-form-panel').forEach(p =>
    p.classList.toggle('active', p.dataset.panel === tabId));
  updateStepIndicator(tabId);
}

function updateStepIndicator(activeId) {
  const idx = TABS.findIndex(t => t.id === activeId);
  document.querySelectorAll('.step-item').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i < idx)      el.classList.add('done');
    else if (i === idx) el.classList.add('active');
  });
}

/* ── 유효성 검사 ── */
function validate() {
  const errs = [];
  const name1 = $('n-name1').value.trim();
  const ktokk = $('n-ktokk').value;
  const land1 = $('n-land1').value;
  const bukrs = $('n-bukrs').value;
  const ekorg = $('n-ekorg').value;
  const waers = $('n-waers').value;

  if (!name1)  errs.push('회사명(NAME1)을 입력해주세요.');
  if (!ktokk)  errs.push('계정 그룹(KTOKK)을 선택해주세요.');
  if (!land1)  errs.push('국가(LAND1)를 선택해주세요.');
  if (!bukrs)  errs.push('회사코드(BUKRS)를 선택해주세요.');
  if (!ekorg)  errs.push('구매조직(EKORG)을 선택해주세요.');
  if (!waers)  errs.push('발주통화(WAERS)를 선택해주세요.');

  if (errs.length) { alert('입력 오류:\n\n' + errs.join('\n')); return false; }
  return true;
}

/* ── 저장 ── */
function saveVendor() {
  if (!validate()) return;

  const db     = loadDB();
  const lifnr  = nextLifnr();
  const newVnd = {
    lifnr,
    ktokk:   $('n-ktokk').value,
    name1:   $('n-name1').value.trim(),
    sortl:   $('n-sortl').value.trim().toUpperCase().slice(0, 10),
    stcd1:   $('n-stcd1').value.trim(),
    stcd2:   $('n-stcd2').value.trim(),
    spras:   $('n-spras').value,
    land1:   $('n-land1').value,
    ort01:   $('n-ort01').value.trim(),
    pstlz:   $('n-pstlz').value.trim(),
    stras:   $('n-stras').value.trim(),
    telf1:   $('n-telf1').value.trim(),
    telfx:   $('n-telfx').value.trim(),
    lifsd:   false,
    sperr:   false,
    bukrs:   $('n-bukrs').value,
    akont:   $('n-akont').value,
    zterm_b: $('n-zterm-b').value,
    zwels:   $('n-zwels').value,
    reprf:   $('n-reprf').checked,
    lnrza:   $('n-lnrza').value.trim(),
    ekorg:   $('n-ekorg').value,
    waers:   $('n-waers').value,
    zterm_m: $('n-zterm-m').value,
    minbw:   Number($('n-minbw').value) || 0,
    inco1:   $('n-inco1').value,
    inco2:   $('n-inco2').value.trim(),
    bstae:   $('n-bstae').value,
    webre:   $('n-webre').checked,
    createdAt: today(),
    updatedAt: today(),
  };

  db.push(newVnd);
  saveDB(db);

  $('n-lifnr-display').textContent = lifnr;
  $('vnd-success-banner').style.display = 'flex';
  $('vnd-success-banner').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('btn-save').disabled  = true;
  $('btn-reset-form').disabled = true;

  /* 모든 입력 필드 비활성화 */
  document.querySelectorAll('.sap-input, .sap-select')
    .forEach(el => { el.readOnly = true; el.disabled = true; });
}

/* ── 폼 초기화 ── */
function resetForm() {
  if (!confirm('입력한 내용을 모두 초기화하겠습니까?')) return;
  document.querySelectorAll('.sap-input').forEach(el => { el.value = ''; el.readOnly = false; });
  document.querySelectorAll('.sap-select').forEach(el => { el.selectedIndex = 0; el.disabled = false; });
  document.querySelectorAll('.sap-checkbox-row input[type="checkbox"]')
    .forEach(el => { el.checked = false; el.disabled = false; });
  $('vnd-success-banner').style.display = 'none';
  $('btn-save').disabled = false;
  $('btn-reset-form').disabled = false;
  switchTab('general');
}

/* ── 목록으로 ── */
function goToList() {
  const url = new URL(window.location.href);
  url.searchParams.set('page', 'mst-vnd-list');
  history.pushState({ pageId: 'mst-vnd-list' }, '', url.toString());
  window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'mst-vnd-list' } }));
}

/* ── 메인 init ── */
export default function init(container) {
  renderPageHeader(container, {
    title: '벤더 마스터 등록',
    subtitle: 'SAP XK01 — 신규 벤더 마스터를 등록합니다. ※ 는 필수 항목',
    actions: [
      { label: '← 목록으로', onClick: goToList },
    ],
  });

  const root = container.querySelector('#page-mst-vnd-new');
  root.innerHTML = buildForm();

  /* 탭 이벤트 */
  document.querySelectorAll('.vnd-form-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  /* 저장/초기화/취소 */
  $('btn-save').addEventListener('click', saveVendor);
  $('btn-reset-form').addEventListener('click', resetForm);
  $('btn-cancel').addEventListener('click', goToList);
  $('btn-goto-list').addEventListener('click', goToList);
  $('btn-add-another').addEventListener('click', resetForm);

  /* 탭 이전/다음 */
  document.querySelectorAll('.btn-tab-prev').forEach(btn =>
    btn.addEventListener('click', () => {
      const idx = TABS.findIndex(t => t.id === _activeTab);
      if (idx > 0) switchTab(TABS[idx - 1].id);
    })
  );
  document.querySelectorAll('.btn-tab-next').forEach(btn =>
    btn.addEventListener('click', () => {
      const idx = TABS.findIndex(t => t.id === _activeTab);
      if (idx < TABS.length - 1) switchTab(TABS[idx + 1].id);
    })
  );

  /* 검색어 자동 채우기 */
  $('n-name1').addEventListener('blur', () => {
    if (!$('n-sortl').value) {
      const val = $('n-name1').value.replace(/[^a-zA-Z가-힣0-9]/g, '').toUpperCase().slice(0, 10);
      $('n-sortl').value = val;
    }
  });

  switchTab('general');
}

/* ── 폼 HTML ── */
function buildForm() {
  const tabHtml = TABS.map(t => `
    <div class="vnd-form-tab" data-tab="${t.id}">
      <span>${t.label}</span>
      <span class="tab-badge">${t.tcode}</span>
    </div>`).join('');

  const stepHtml = TABS.map((t, i) => `
    ${i > 0 ? '<span class="step-sep">›</span>' : ''}
    <div class="step-item" data-step="${t.id}">
      <span class="step-num">${i + 1}</span>
      ${t.label}
    </div>`).join('');

  return `
  <div class="vnd-form-wrap">

    <!-- 성공 배너 (저장 후 표시) -->
    <div id="vnd-success-banner" style="display:none; align-items:center; gap:16px;
         background:#f0fdf4; border:1px solid #86efac; border-radius:10px;
         padding:16px 20px; margin-bottom:20px;">
      <span style="font-size:28px;">✅</span>
      <div>
        <div style="font-weight:800;color:#15803d;font-size:15px;">벤더 마스터 등록 완료</div>
        <div style="color:#166534;font-size:13px;margin-top:4px;">
          벤더 번호 <strong id="n-lifnr-display" style="font-family:monospace"></strong>
          이(가) 성공적으로 생성되었습니다.
        </div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;">
        <button class="pg-btn primary" id="btn-goto-list">목록으로</button>
        <button class="pg-btn" id="btn-add-another">추가 등록</button>
      </div>
    </div>

    <!-- 진행 스텝 -->
    <div class="step-indicator">${stepHtml}</div>

    <!-- 탭 헤더 -->
    <div class="vnd-form-tabs">${tabHtml}</div>

    <!-- ════ Tab 1: 일반 데이터 ════ -->
    <div class="vnd-form-panel active" data-panel="general">

      <div class="sap-section">
        <div class="sap-section-hdr">
          식별 정보
          <span class="sap-tcode">LFA1</span>
        </div>
        <div class="sap-form-grid">
          <div class="sap-field">
            <label class="sap-label">벤더 번호 <span class="sap-fname">LIFNR</span></label>
            <input class="sap-input readonly" id="n-lifnr" readonly value="(자동 채번)" tabindex="-1">
            <span class="sap-hint">저장 시 시스템이 자동 부여합니다.</span>
          </div>
          <div class="sap-field">
            <label class="sap-label">계정 그룹 <span class="sap-fname">KTOKK</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-ktokk">
              <option value="">— 선택 —</option>
              <option value="KRED">KRED – 국내 일반 협력사</option>
              <option value="KFOR">KFOR – 해외 협력사</option>
              <option value="KSER">KSER – 서비스 공급사</option>
              <option value="KOTH">KOTH – 기타</option>
            </select>
          </div>
        </div>
      </div>

      <div class="sap-section">
        <div class="sap-section-hdr">기본 정보 <span class="sap-tcode">LFA1</span></div>
        <div class="sap-form-grid">
          <div class="sap-field span2">
            <label class="sap-label">회사명 <span class="sap-fname">NAME1</span><span class="req"> *</span></label>
            <input class="sap-input" id="n-name1" maxlength="35" placeholder="예: (주)한국정밀기계">
          </div>
          <div class="sap-field">
            <label class="sap-label">검색어 <span class="sap-fname">SORTL</span></label>
            <input class="sap-input" id="n-sortl" maxlength="10" placeholder="영문 10자 이내 (자동생성)">
            <span class="sap-hint">회사명 입력 후 자동 생성됩니다.</span>
          </div>
          <div class="sap-field">
            <label class="sap-label">언어 <span class="sap-fname">SPRAS</span></label>
            <select class="sap-select" id="n-spras">
              <option value="KO">KO – 한국어</option>
              <option value="EN">EN – English</option>
              <option value="JA">JA – 日本語</option>
              <option value="ZH">ZH – 中文</option>
              <option value="DE">DE – Deutsch</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">사업자등록번호 <span class="sap-fname">STCD1</span></label>
            <input class="sap-input" id="n-stcd1" placeholder="000-00-00000">
          </div>
          <div class="sap-field">
            <label class="sap-label">법인번호 <span class="sap-fname">STCD2</span></label>
            <input class="sap-input" id="n-stcd2" placeholder="000000-0000000">
          </div>
        </div>
      </div>

      <div class="sap-section">
        <div class="sap-section-hdr">주소 정보 <span class="sap-tcode">LFA1</span></div>
        <div class="sap-form-grid col3">
          <div class="sap-field">
            <label class="sap-label">국가 <span class="sap-fname">LAND1</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-land1">
              <option value="">— 선택 —</option>
              <option value="KR">KR – 대한민국</option>
              <option value="US">US – 미국</option>
              <option value="JP">JP – 일본</option>
              <option value="CN">CN – 중국</option>
              <option value="DE">DE – 독일</option>
              <option value="VN">VN – 베트남</option>
              <option value="TW">TW – 대만</option>
              <option value="SG">SG – 싱가포르</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">도시 <span class="sap-fname">ORT01</span></label>
            <input class="sap-input" id="n-ort01" placeholder="서울, Tokyo, …">
          </div>
          <div class="sap-field">
            <label class="sap-label">우편번호 <span class="sap-fname">PSTLZ</span></label>
            <input class="sap-input" id="n-pstlz">
          </div>
          <div class="sap-field span3">
            <label class="sap-label">주소 (상세) <span class="sap-fname">STRAS</span></label>
            <input class="sap-input" id="n-stras" placeholder="도로명주소 또는 Street Address">
          </div>
          <div class="sap-field">
            <label class="sap-label">전화번호 <span class="sap-fname">TELF1</span></label>
            <input class="sap-input" id="n-telf1" placeholder="02-0000-0000">
          </div>
          <div class="sap-field">
            <label class="sap-label">팩스 <span class="sap-fname">TELFX</span></label>
            <input class="sap-input" id="n-telfx">
          </div>
        </div>
      </div>

      <div class="vnd-form-footer">
        <span class="foot-left">* 필수 항목을 모두 입력 후 다음 탭으로 이동하세요.</span>
        <div class="foot-right">
          <button class="pg-btn" id="btn-cancel">취소</button>
          <button class="pg-btn primary btn-tab-next">다음: 회사코드 데이터 →</button>
        </div>
      </div>
    </div>

    <!-- ════ Tab 2: 회사코드 데이터 ════ -->
    <div class="vnd-form-panel" data-panel="company">

      <div class="sap-section">
        <div class="sap-section-hdr">회사코드 설정 <span class="sap-tcode">LFB1</span></div>
        <div class="sap-form-grid">
          <div class="sap-field">
            <label class="sap-label">회사코드 <span class="sap-fname">BUKRS</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-bukrs">
              <option value="">— 선택 —</option>
              <option value="1000">1000 – HD현대 주식회사</option>
              <option value="1100">1100 – HD현대일렉트릭</option>
              <option value="1200">1200 – HD현대중공업</option>
              <option value="1300">1300 – HD현대건설기계</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">조정계정 <span class="sap-fname">AKONT</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-akont">
              <option value="211000">211000 – 매입채무</option>
              <option value="211100">211100 – 미지급금</option>
              <option value="211200">211200 – 선급금</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">지급조건 <span class="sap-fname">ZTERM</span></label>
            <select class="sap-select" id="n-zterm-b">
              <option value="Z000">Z000 – 즉시지급</option>
              <option value="Z030" selected>Z030 – 30일 후 지급</option>
              <option value="Z060">Z060 – 60일 후 지급</option>
              <option value="Z090">Z090 – 90일 후 지급</option>
              <option value="ZN45">ZN45 – 익월 45일</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">지급방법 <span class="sap-fname">ZWELS</span></label>
            <select class="sap-select" id="n-zwels">
              <option value="T" selected>T – 계좌이체</option>
              <option value="C">C – 수표</option>
              <option value="B">B – 외환송금</option>
              <option value="E">E – 전자결제</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">대체 지급인 <span class="sap-fname">LNRZA</span></label>
            <input class="sap-input" id="n-lnrza" placeholder="벤더 번호 (없으면 공백)">
          </div>
        </div>
      </div>

      <div class="sap-section">
        <div class="sap-section-hdr">검증 옵션 <span class="sap-tcode">LFB1</span></div>
        <div class="sap-checkbox-row">
          <input type="checkbox" id="n-reprf" checked>
          <label for="n-reprf">중복 인보이스 체크 (REPRF) — 동일 인보이스 번호 이중 전표 방지</label>
        </div>
      </div>

      <div class="vnd-form-footer">
        <span class="foot-left"></span>
        <div class="foot-right">
          <button class="pg-btn btn-tab-prev">← 일반 데이터</button>
          <button class="pg-btn primary btn-tab-next">다음: 구매조직 데이터 →</button>
        </div>
      </div>
    </div>

    <!-- ════ Tab 3: 구매조직 데이터 ════ -->
    <div class="vnd-form-panel" data-panel="purch">

      <div class="sap-section">
        <div class="sap-section-hdr">구매조직 기본 <span class="sap-tcode">LFM1</span></div>
        <div class="sap-form-grid">
          <div class="sap-field">
            <label class="sap-label">구매조직 <span class="sap-fname">EKORG</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-ekorg">
              <option value="">— 선택 —</option>
              <option value="1000">1000 – 중앙구매조직</option>
              <option value="1100">1100 – 중공업 구매조직</option>
              <option value="1200">1200 – 건설기계 구매조직</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">발주통화 <span class="sap-fname">WAERS</span><span class="req"> *</span></label>
            <select class="sap-select" id="n-waers">
              <option value="">— 선택 —</option>
              <option value="KRW" selected>KRW – 대한민국 원</option>
              <option value="USD">USD – 미국 달러</option>
              <option value="EUR">EUR – 유로</option>
              <option value="JPY">JPY – 일본 엔</option>
              <option value="CNY">CNY – 중국 위안</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">지급조건 <span class="sap-fname">ZTERM</span></label>
            <select class="sap-select" id="n-zterm-m">
              <option value="Z000">Z000 – 즉시지급</option>
              <option value="Z030" selected>Z030 – 30일 후 지급</option>
              <option value="Z060">Z060 – 60일 후 지급</option>
              <option value="Z090">Z090 – 90일 후 지급</option>
              <option value="ZN45">ZN45 – 익월 45일</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">최소발주금액 <span class="sap-fname">MINBW</span></label>
            <input class="sap-input" id="n-minbw" type="number" min="0" step="10000" placeholder="0">
            <span class="sap-hint">발주통화 기준 최소금액 (0 = 제한없음)</span>
          </div>
        </div>
      </div>

      <div class="sap-section">
        <div class="sap-section-hdr">인코텀즈 (Incoterms 2020) <span class="sap-tcode">LFM1</span></div>
        <div class="sap-form-grid">
          <div class="sap-field">
            <label class="sap-label">인코텀즈 1 <span class="sap-fname">INCO1</span></label>
            <select class="sap-select" id="n-inco1">
              <option value="">— 미설정 —</option>
              <option value="EXW">EXW – 공장 인도</option>
              <option value="FCA">FCA – 운송인 인도</option>
              <option value="FAS">FAS – 선측 인도</option>
              <option value="FOB">FOB – 본선 인도</option>
              <option value="CFR">CFR – 운임 포함</option>
              <option value="CIF">CIF – 운임·보험 포함</option>
              <option value="CPT">CPT – 운임 지급 인도</option>
              <option value="CIP">CIP – 운임·보험 지급 인도</option>
              <option value="DPU">DPU – 양하 인도</option>
              <option value="DAP">DAP – 목적지 인도</option>
              <option value="DDP">DDP – 관세 지급 인도</option>
            </select>
          </div>
          <div class="sap-field">
            <label class="sap-label">인코텀즈 장소 <span class="sap-fname">INCO2</span></label>
            <input class="sap-input" id="n-inco2" placeholder="예: 부산항, 인도공장, Busan Port">
          </div>
          <div class="sap-field">
            <label class="sap-label">확인 관리 키 <span class="sap-fname">BSTAE</span></label>
            <select class="sap-select" id="n-bstae">
              <option value="">— 미설정 —</option>
              <option value="BEST">BEST – 주문 확인</option>
              <option value="0001">0001 – 발송 통보</option>
              <option value="0002">0002 – 입고 확인</option>
            </select>
          </div>
        </div>
      </div>

      <div class="sap-section">
        <div class="sap-section-hdr">입고/검증 <span class="sap-tcode">LFM1</span></div>
        <div class="sap-checkbox-row">
          <input type="checkbox" id="n-webre" checked>
          <label for="n-webre">입고기반 인보이스 검증 (WEBRE) — GR-Based Invoice Verification</label>
        </div>
      </div>

      <div class="vnd-form-footer">
        <span class="foot-left">모든 항목 확인 후 저장하세요.</span>
        <div class="foot-right">
          <button class="pg-btn btn-tab-prev">← 회사코드 데이터</button>
          <button class="pg-btn" id="btn-reset-form">초기화</button>
          <button class="pg-btn primary" id="btn-save">💾 저장 (XK01)</button>
        </div>
      </div>
    </div>

  </div>`;
}

export function cleanup() {}
