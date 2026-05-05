import { renderPageHeader } from '../../components/page-header.js';

/* ── 코드 맵 ── */
const KTOKK_MAP = {
  KRED: '국내 일반 협력사', KFOR: '해외 협력사',
  KSER: '서비스 공급사',   KOTH: '기타',
};
const LAND_MAP = {
  KR:'대한민국', US:'미국', JP:'일본', CN:'중국',
  DE:'독일',    VN:'베트남', TW:'대만', SG:'싱가포르',
};

/* ── Mock DB (sessionStorage로 영속) ── */
const DB_KEY = 'srm_vnd_master';

const SEED = [
  { lifnr:'1000001', ktokk:'KRED', name1:'(주)한국정밀기계',        sortl:'HANKOOKJM', land1:'KR', ort01:'서울',    stras:'강남구 테헤란로 123',  pstlz:'06123', spras:'KO', telf1:'02-1234-5678', telfx:'02-1234-5679', stcd1:'123-45-67890', stcd2:'110111-1234567', lifsd:false, sperr:false, bukrs:'1000', akont:'211000', zterm_b:'Z030', zwels:'T', reprf:true,  lnrza:'', ekorg:'1000', waers:'KRW', zterm_m:'Z030', inco1:'DDP', inco2:'인도공장',  minbw:1000000,  webre:true,  bstae:'BEST', createdAt:'2024-03-15', updatedAt:'2026-04-01' },
  { lifnr:'1000002', ktokk:'KFOR', name1:'Acme Electronics Co.',    sortl:'ACME',     land1:'US', ort01:'San Jose', stras:'1 Market St',         pstlz:'95101', spras:'EN', telf1:'+1-408-555-0100', telfx:'', stcd1:'84-1234567', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211000', zterm_b:'Z060', zwels:'B', reprf:true,  lnrza:'', ekorg:'1000', waers:'USD', zterm_m:'Z060', inco1:'CIF', inco2:'부산항',   minbw:5000000,  webre:true,  bstae:'BEST', createdAt:'2023-11-20', updatedAt:'2026-02-14' },
  { lifnr:'1000003', ktokk:'KRED', name1:'삼성부품산업(주)',          sortl:'SAMSUNGBP', land1:'KR', ort01:'수원',    stras:'영통구 삼성로 55',    pstlz:'16677', spras:'KO', telf1:'031-320-1234', telfx:'031-320-1235', stcd1:'456-78-90123', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211000', zterm_b:'Z030', zwels:'T', reprf:false, lnrza:'', ekorg:'1000', waers:'KRW', zterm_m:'Z030', inco1:'DAP', inco2:'당사 물류창고', minbw:500000,   webre:true,  bstae:'BEST', createdAt:'2023-08-10', updatedAt:'2026-01-20' },
  { lifnr:'1000004', ktokk:'KFOR', name1:'Yamaha Precision Parts',  sortl:'YAMAHAPP', land1:'JP', ort01:'浜松市',   stras:'中区板屋町111-2',       pstlz:'4308711', spras:'JA', telf1:'+81-53-460-2211', telfx:'', stcd1:'T1-1234-5678', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211000', zterm_b:'Z060', zwels:'B', reprf:true,  lnrza:'', ekorg:'1000', waers:'JPY', zterm_m:'Z060', inco1:'FOB', inco2:'横浜港',   minbw:100000,   webre:false, bstae:'',     createdAt:'2022-06-01', updatedAt:'2025-12-10' },
  { lifnr:'1000005', ktokk:'KSER', name1:'(주)클라우드허브',          sortl:'CLOUDHUB', land1:'KR', ort01:'판교',    stras:'분당구 판교역로 166',  pstlz:'13529', spras:'KO', telf1:'031-700-5000', telfx:'', stcd1:'789-01-23456', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211100', zterm_b:'Z030', zwels:'E', reprf:false, lnrza:'', ekorg:'1000', waers:'KRW', zterm_m:'Z030', inco1:'',    inco2:'',        minbw:0,        webre:false, bstae:'',     createdAt:'2024-07-22', updatedAt:'2026-03-30' },
  { lifnr:'1000006', ktokk:'KFOR', name1:'Bosch Automotive GmbH',   sortl:'BOSCHAUTO', land1:'DE', ort01:'Stuttgart', stras:'Robert-Bosch-Platz 1', pstlz:'70839', spras:'DE', telf1:'+49-711-400-40990', telfx:'', stcd1:'DE123456789', stcd2:'', lifsd:false, sperr:true,  bukrs:'1000', akont:'211000', zterm_b:'Z060', zwels:'B', reprf:true,  lnrza:'', ekorg:'1100', waers:'EUR', zterm_m:'Z060', inco1:'CIP', inco2:'인천공항',  minbw:10000000, webre:true,  bstae:'BEST', createdAt:'2021-03-15', updatedAt:'2026-04-10' },
  { lifnr:'1000007', ktokk:'KRED', name1:'대한철강(주)',              sortl:'DAEHANCST', land1:'KR', ort01:'포항',    stras:'남구 동해안로 6261',   pstlz:'37582', spras:'KO', telf1:'054-220-0114', telfx:'054-220-3000', stcd1:'321-65-43210', stcd2:'', lifsd:false, sperr:false, bukrs:'1200', akont:'211000', zterm_b:'Z030', zwels:'T', reprf:true,  lnrza:'', ekorg:'1200', waers:'KRW', zterm_m:'Z000', inco1:'DDP', inco2:'울산공장',   minbw:2000000,  webre:true,  bstae:'BEST', createdAt:'2020-01-10', updatedAt:'2026-04-15' },
  { lifnr:'1000008', ktokk:'KFOR', name1:'Vietnam Auto Parts JSC',  sortl:'VNAUTO',  land1:'VN', ort01:'Hà Nội',  stras:'KCN Thăng Long, Đông Anh', pstlz:'100000', spras:'EN', telf1:'+84-24-3891-5252', telfx:'', stcd1:'0100233488', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211000', zterm_b:'Z090', zwels:'B', reprf:false, lnrza:'', ekorg:'1000', waers:'USD', zterm_m:'Z090', inco1:'FOB', inco2:'하이퐁항', minbw:3000000,  webre:true,  bstae:'',     createdAt:'2024-02-28', updatedAt:'2026-01-05' },
  { lifnr:'1000009', ktokk:'KRED', name1:'(주)현대유압',              sortl:'HDHYDRO',  land1:'KR', ort01:'울산',    stras:'북구 산업로 915',      pstlz:'44310', spras:'KO', telf1:'052-230-4000', telfx:'052-230-4001', stcd1:'654-32-10987', stcd2:'', lifsd:true,  sperr:false, bukrs:'1200', akont:'211000', zterm_b:'Z030', zwels:'T', reprf:true,  lnrza:'', ekorg:'1200', waers:'KRW', zterm_m:'Z030', inco1:'DDP', inco2:'사내반입',  minbw:500000,   webre:true,  bstae:'BEST', createdAt:'2019-06-01', updatedAt:'2025-11-30' },
  { lifnr:'1000010', ktokk:'KSER', name1:'AWS Korea LLC',           sortl:'AWSKOREA', land1:'KR', ort01:'서울',    stras:'강남구 역삼로 180',    pstlz:'06236', spras:'EN', telf1:'1544-0918', telfx:'', stcd1:'120-88-00333', stcd2:'', lifsd:false, sperr:false, bukrs:'1000', akont:'211100', zterm_b:'Z030', zwels:'E', reprf:false, lnrza:'', ekorg:'1000', waers:'USD', zterm_m:'Z030', inco1:'',    inco2:'',        minbw:0,        webre:false, bstae:'',     createdAt:'2023-01-01', updatedAt:'2026-04-20' },
];

function loadDB() {
  try { return JSON.parse(sessionStorage.getItem(DB_KEY)) ?? SEED.map(v => ({...v})); }
  catch { return SEED.map(v => ({...v})); }
}
function saveDB(data) { sessionStorage.setItem(DB_KEY, JSON.stringify(data)); }

/* ── 상태 계산 ── */
function getStatus(v) {
  if (v.lifsd) return 'deleted';
  if (v.sperr) return 'blocked';
  return 'active';
}
const STATUS_MAP = {
  active:  { label:'정상',     cls:'badge-active'  },
  blocked: { label:'블록',     cls:'badge-blocked' },
  deleted: { label:'삭제대상', cls:'badge-deleted' },
};

/* ── 전역 상태 ── */
let _db        = loadDB();
let _filtered  = [..._db];
let _editMode  = false;   // false = 조회(XK03), true = 변경(XK02)
let _editLifnr = null;
let _deletePending = null;

/* ── 유틸 ── */
const $ = id => document.getElementById(id);

export default function init(container) {
  renderPageHeader(container, {
    title: '벤더 마스터 조회',
    subtitle: 'SAP XK03/XK02/MK06 — 벤더 마스터 데이터를 조회·변경·삭제 관리합니다.',
    actions: [
      { label: '+ 벤더 등록', primary: true, pageId: 'mst-vnd-new' },
      { label: '⬇ 엑셀',   onClick: () => alert('엑셀 다운로드') },
    ],
  });

  const root = container.querySelector('#page-mst-vnd-list');
  root.innerHTML = buildShell();

  attachEvents(container);
  renderStats();
  renderTable();
}

/* ── HTML 골격 ── */
function buildShell() {
  return `
    <div class="stat-cards" id="vnd-stat-cards"></div>

    <div class="filter-bar">
      <input class="sap-input filter-keyword" id="flt-lifnr"  placeholder="벤더 번호">
      <input class="sap-input filter-keyword" id="flt-name1"  placeholder="회사명 검색">
      <select class="sap-select" id="flt-land1">
        <option value="">전체 국가</option>
        ${Object.entries(LAND_MAP).map(([k,v])=>`<option value="${k}">${k} – ${v}</option>`).join('')}
      </select>
      <select class="sap-select" id="flt-ktokk">
        <option value="">전체 계정그룹</option>
        ${Object.entries(KTOKK_MAP).map(([k,v])=>`<option value="${k}">${k}</option>`).join('')}
      </select>
      <select class="sap-select" id="flt-status">
        <option value="">전체 상태</option>
        <option value="active">정상</option>
        <option value="blocked">블록</option>
        <option value="deleted">삭제대상</option>
      </select>
      <button class="pg-btn primary" id="btn-search">조회</button>
      <button class="pg-btn" id="btn-reset">초기화</button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div style="font-size:13px;color:var(--text-sub);">
        총 <strong id="vnd-count" style="color:var(--text-main)">0</strong>건
      </div>
      <button class="pg-btn danger" id="btn-bulk-delete" style="display:none">
        선택 삭제 플래그
      </button>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:36px;"><input type="checkbox" id="chk-all"></th>
            <th>벤더번호<br><span style="font-family:monospace;font-size:10px;opacity:.5">LIFNR</span></th>
            <th>회사명<br><span style="font-family:monospace;font-size:10px;opacity:.5">NAME1</span></th>
            <th>검색어<br><span style="font-family:monospace;font-size:10px;opacity:.5">SORTL</span></th>
            <th>국가<br><span style="font-family:monospace;font-size:10px;opacity:.5">LAND1</span></th>
            <th>계정그룹<br><span style="font-family:monospace;font-size:10px;opacity:.5">KTOKK</span></th>
            <th>발주통화<br><span style="font-family:monospace;font-size:10px;opacity:.5">WAERS</span></th>
            <th>상태</th>
            <th>등록일</th>
            <th style="width:160px;">액션</th>
          </tr>
        </thead>
        <tbody id="vnd-tbody"></tbody>
      </table>
    </div>`;
}

/* ── 통계 카드 ── */
function renderStats() {
  const total   = _db.length;
  const active  = _db.filter(v => !v.lifsd && !v.sperr).length;
  const blocked = _db.filter(v => v.sperr && !v.lifsd).length;
  const deleted = _db.filter(v => v.lifsd).length;
  $('vnd-stat-cards').innerHTML = `
    <div class="stat-card primary"><div class="stat-card-label">전체 벤더</div><div class="stat-card-value">${total}</div><div class="stat-card-sub">총 등록 건수</div></div>
    <div class="stat-card success"><div class="stat-card-label">정상</div><div class="stat-card-value">${active}</div><div class="stat-card-sub">활성 벤더</div></div>
    <div class="stat-card warn"><div class="stat-card-label">블록 (SPERR)</div><div class="stat-card-value">${blocked}</div><div class="stat-card-sub">전기 차단 중</div></div>
    <div class="stat-card danger"><div class="stat-card-label">삭제 대상 (LIFSD)</div><div class="stat-card-value">${deleted}</div><div class="stat-card-sub">삭제 플래그 설정</div></div>`;
}

/* ── 테이블 렌더 ── */
function renderTable() {
  const tbody = $('vnd-tbody');
  $('vnd-count').textContent = _filtered.length;
  if (_filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-sub);">조회된 벤더가 없습니다.</td></tr>`;
    return;
  }
  tbody.innerHTML = _filtered.map(v => {
    const st = getStatus(v);
    const { label, cls } = STATUS_MAP[st];
    return `
      <tr data-lifnr="${v.lifnr}">
        <td><input type="checkbox" class="row-chk" data-lifnr="${v.lifnr}"></td>
        <td style="font-family:monospace;font-weight:700;color:var(--primary-color)">${v.lifnr}</td>
        <td style="font-weight:600">${v.name1}</td>
        <td style="font-family:monospace;font-size:12px">${v.sortl}</td>
        <td>${LAND_MAP[v.land1] ?? v.land1}</td>
        <td><span style="font-family:monospace;font-size:11px">${v.ktokk}</span></td>
        <td style="font-family:monospace">${v.waers}</td>
        <td><span class="badge ${cls}">${label}</span></td>
        <td style="font-size:12px;color:var(--text-sub)">${v.createdAt}</td>
        <td class="td-actions">
          <button class="tbl-btn primary btn-view" data-lifnr="${v.lifnr}">XK03 조회</button>
          <button class="tbl-btn btn-edit" data-lifnr="${v.lifnr}">XK02 변경</button>
          <button class="tbl-btn danger btn-del" data-lifnr="${v.lifnr}" ${v.lifsd ? 'disabled title="이미 삭제 대상입니다"' : ''}>삭제</button>
        </td>
      </tr>`;
  }).join('');

  /* 행 선택 체크박스 */
  tbody.querySelectorAll('.row-chk').forEach(chk => {
    chk.addEventListener('change', updateBulkBtn);
  });
  $('chk-all').addEventListener('change', e => {
    tbody.querySelectorAll('.row-chk').forEach(c => { c.checked = e.target.checked; });
    updateBulkBtn();
  });
}

function updateBulkBtn() {
  const checked = document.querySelectorAll('.row-chk:checked').length;
  $('btn-bulk-delete').style.display = checked > 0 ? '' : 'none';
  $('btn-bulk-delete').textContent = `선택 ${checked}건 삭제 플래그`;
}

/* ── 필터/검색 ── */
function applyFilter() {
  const lifnr  = $('flt-lifnr').value.trim().toLowerCase();
  const name1  = $('flt-name1').value.trim().toLowerCase();
  const land1  = $('flt-land1').value;
  const ktokk  = $('flt-ktokk').value;
  const status = $('flt-status').value;

  _filtered = _db.filter(v => {
    if (lifnr  && !v.lifnr.toLowerCase().includes(lifnr))   return false;
    if (name1  && !v.name1.toLowerCase().includes(name1))   return false;
    if (land1  && v.land1 !== land1)                        return false;
    if (ktokk  && v.ktokk !== ktokk)                        return false;
    if (status && getStatus(v) !== status)                   return false;
    return true;
  });
  renderTable();
}

/* ── 모달 열기 ── */
function openModal(lifnr, editMode) {
  const v = _db.find(r => r.lifnr === lifnr);
  if (!v) return;
  _editMode  = editMode;
  _editLifnr = lifnr;

  const overlay = $('vnd-modal-overlay');
  overlay.classList.add('open');
  $('vnd-modal-title').textContent = editMode ? '벤더 마스터 변경' : '벤더 마스터 조회';
  $('vnd-modal-tx').textContent    = editMode ? 'XK02' : 'XK03';
  $('vnd-modal-save').style.display = editMode ? '' : 'none';
  $('vnd-modal-cancel').textContent  = editMode ? '취소' : '닫기';
  $('vnd-modal-info').textContent    = `최종수정: ${v.updatedAt}`;

  /* 탭 초기화 */
  document.querySelectorAll('.vnd-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.vnd-tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.vnd-tab[data-tab="general"]').classList.add('active');
  $('tab-general').classList.add('active');

  /* 필드 채우기 */
  const ro = !editMode;
  fillField('f-lifnr',  v.lifnr,    true);
  fillField('f-ktokk',  v.ktokk,    ro,  true);
  fillField('f-name1',  v.name1,    ro);
  fillField('f-sortl',  v.sortl,    ro);
  fillField('f-stcd1',  v.stcd1,    ro);
  fillField('f-stcd2',  v.stcd2,    ro);
  fillField('f-spras',  v.spras,    ro,  true);
  fillField('f-land1',  v.land1,    ro,  true);
  fillField('f-ort01',  v.ort01,    ro);
  fillField('f-pstlz',  v.pstlz,    ro);
  fillField('f-stras',  v.stras,    ro);
  fillField('f-telf1',  v.telf1,    ro);
  fillField('f-telfx',  v.telfx,    ro);
  fillCheck('f-lifsd',  v.lifsd,    ro);
  fillCheck('f-sperr',  v.sperr,    ro);
  fillField('f-bukrs',  v.bukrs,    ro,  true);
  fillField('f-akont',  v.akont,    ro,  true);
  fillField('f-zterm-b',v.zterm_b,  ro,  true);
  fillField('f-zwels',  v.zwels,    ro,  true);
  fillField('f-lnrza',  v.lnrza,    ro);
  fillCheck('f-reprf',  v.reprf,    ro);
  fillField('f-ekorg',  v.ekorg,    ro,  true);
  fillField('f-waers',  v.waers,    ro,  true);
  fillField('f-zterm-m',v.zterm_m,  ro,  true);
  fillField('f-minbw',  v.minbw,    ro);
  fillField('f-inco1',  v.inco1,    ro,  true);
  fillField('f-inco2',  v.inco2,    ro);
  fillField('f-bstae',  v.bstae,    ro,  true);
  fillCheck('f-webre',  v.webre,    ro);
}

function fillField(id, val, readonly, isSelect = false) {
  const el = $(id);
  if (!el) return;
  el.value = val ?? '';
  if (isSelect) { el.disabled = readonly; }
  else { el.readOnly = readonly; el.classList.toggle('readonly', readonly); }
}
function fillCheck(id, val, readonly) {
  const el = $(id);
  if (!el) return;
  el.checked  = !!val;
  el.disabled = readonly;
}

function closeModal() {
  $('vnd-modal-overlay').classList.remove('open');
  _editLifnr = null;
}

/* ── 저장 (XK02) ── */
function saveVendor() {
  const v = _db.find(r => r.lifnr === _editLifnr);
  if (!v) return;

  v.ktokk   = $('f-ktokk').value;
  v.name1   = $('f-name1').value.trim();
  v.sortl   = $('f-sortl').value.trim();
  v.stcd1   = $('f-stcd1').value.trim();
  v.stcd2   = $('f-stcd2').value.trim();
  v.spras   = $('f-spras').value;
  v.land1   = $('f-land1').value;
  v.ort01   = $('f-ort01').value.trim();
  v.pstlz   = $('f-pstlz').value.trim();
  v.stras   = $('f-stras').value.trim();
  v.telf1   = $('f-telf1').value.trim();
  v.telfx   = $('f-telfx').value.trim();
  v.lifsd   = $('f-lifsd').checked;
  v.sperr   = $('f-sperr').checked;
  v.bukrs   = $('f-bukrs').value;
  v.akont   = $('f-akont').value;
  v.zterm_b = $('f-zterm-b').value;
  v.zwels   = $('f-zwels').value;
  v.lnrza   = $('f-lnrza').value.trim();
  v.reprf   = $('f-reprf').checked;
  v.ekorg   = $('f-ekorg').value;
  v.waers   = $('f-waers').value;
  v.zterm_m = $('f-zterm-m').value;
  v.minbw   = Number($('f-minbw').value) || 0;
  v.inco1   = $('f-inco1').value;
  v.inco2   = $('f-inco2').value.trim();
  v.bstae   = $('f-bstae').value;
  v.webre   = $('f-webre').checked;
  v.updatedAt = new Date().toISOString().slice(0, 10);

  if (!v.name1) { alert('회사명(NAME1)은 필수입니다.'); return; }

  saveDB(_db);
  _filtered = [..._db];
  closeModal();
  renderStats();
  renderTable();
}

/* ── 삭제 플래그 (MK06 상당) ── */
function openDeleteConfirm(lifnr) {
  const v = _db.find(r => r.lifnr === lifnr);
  if (!v) return;
  _deletePending = lifnr;
  $('conf-msg').innerHTML = `<strong>${v.name1}</strong> (${v.lifnr})<br>삭제 플래그(LIFSD)를 설정합니다.<br>이후 정기 아카이브 배치에서 실제 삭제됩니다.`;
  $('vnd-confirm-overlay').classList.add('open');
}
function confirmDelete() {
  const v = _db.find(r => r.lifnr === _deletePending);
  if (v) { v.lifsd = true; v.updatedAt = new Date().toISOString().slice(0,10); }
  saveDB(_db);
  _filtered = _db.filter(r => _filtered.some(f => f.lifnr === r.lifnr));
  $('vnd-confirm-overlay').classList.remove('open');
  _deletePending = null;
  renderStats();
  renderTable();
}
function bulkDelete() {
  const checked = [...document.querySelectorAll('.row-chk:checked')].map(c => c.dataset.lifnr);
  if (!checked.length) return;
  const names = checked.map(l => _db.find(r => r.lifnr === l)?.name1 ?? l).join(', ');
  if (!confirm(`${checked.length}건에 삭제 플래그를 설정하겠습니까?\n\n${names}`)) return;
  checked.forEach(lifnr => {
    const v = _db.find(r => r.lifnr === lifnr);
    if (v) { v.lifsd = true; v.updatedAt = new Date().toISOString().slice(0,10); }
  });
  saveDB(_db);
  _filtered = [..._db];
  $('btn-bulk-delete').style.display = 'none';
  renderStats();
  renderTable();
}

/* ── 이벤트 바인딩 ── */
function attachEvents(container) {
  /* 필터 */
  $('btn-search').addEventListener('click', applyFilter);
  $('btn-reset').addEventListener('click', () => {
    ['flt-lifnr','flt-name1'].forEach(id => $(id).value = '');
    ['flt-land1','flt-ktokk','flt-status'].forEach(id => $(id).value = '');
    _filtered = [..._db]; renderTable();
  });
  ['flt-lifnr','flt-name1'].forEach(id => {
    $(id).addEventListener('keydown', e => { if (e.key === 'Enter') applyFilter(); });
  });

  /* 테이블 버튼 (이벤트 위임) */
  $('vnd-tbody').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const lifnr = btn.dataset.lifnr;
    if (btn.classList.contains('btn-view'))  openModal(lifnr, false);
    if (btn.classList.contains('btn-edit'))  openModal(lifnr, true);
    if (btn.classList.contains('btn-del'))   openDeleteConfirm(lifnr);
  });

  /* 모달 탭 전환 */
  document.querySelectorAll('.vnd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.vnd-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.vnd-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  /* 모달 버튼 */
  $('vnd-modal-close').addEventListener('click', closeModal);
  $('vnd-modal-cancel').addEventListener('click', closeModal);
  $('vnd-modal-save').addEventListener('click', saveVendor);
  $('vnd-modal-overlay').addEventListener('click', e => {
    if (e.target === $('vnd-modal-overlay')) closeModal();
  });

  /* 삭제 확인 */
  $('conf-cancel').addEventListener('click', () => {
    $('vnd-confirm-overlay').classList.remove('open');
    _deletePending = null;
  });
  $('conf-ok').addEventListener('click', confirmDelete);

  /* 일괄 삭제 */
  $('btn-bulk-delete').addEventListener('click', bulkDelete);

  /* ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      $('vnd-confirm-overlay').classList.remove('open');
    }
  });
}

export function cleanup() {
  document.removeEventListener('keydown', () => {});
}
