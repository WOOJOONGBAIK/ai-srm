import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';
import { actionButtons, createAISRMGrid } from '../../components/grid.js';

const RFQ  = { rfqNo: 'RFQ-2026-0086', title: '금형 설계 외주 용역', deadline: '2026-04-25', prNo: 'PR-2026-0418' };
const ITEMS = ['금형 설계 (메인)', '금형 제작 감리', '시험성형 1회', '납기 보증'];
const VENDORS = [
  { name:'(주)정밀금형',  score:92, total:32000000, items:[12000000,5000000,8000000,7000000], leadtime:30, qual:'ISO9001', remark:'최저가 / 실적 우수' },
  { name:'한국몰드테크',  score:88, total:35500000, items:[13500000,6000000,9000000,7000000], leadtime:25, qual:'ISO9001', remark:'납기 최단' },
  { name:'대성금형공업',  score:79, total:28000000, items:[10000000,4000000,7000000,7000000], leadtime:35, qual:'-',       remark:'최저가이나 실적 부족' },
  { name:'퍼펙트다이',    score:85, total:31000000, items:[11500000,5500000,7500000,6500000], leadtime:28, qual:'ISO9001', remark:'균형 잡힌 조건' },
];

function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

export default function init(container) {
  renderProcessTracker(container, 'rfq');
  renderPageHeader(container, {
    title: '견적 비교 분석',
    subtitle: `${RFQ.rfqNo} · ${RFQ.title}`,
    actions: [
      { label: 'RFQ 목록', pageId: 'rfq-list' },
      { label: '⬇ 비교표 출력', onClick: () => window.print() },
    ],
  });

  const root = container.querySelector('#page-rfq-compare');
  let selectedVendor = null;

  root.innerHTML = `
    <!-- 요약 카드 -->
    <div class="stat-cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="stat-card"><div class="stat-card-label">접수 업체</div><div class="stat-card-value">${VENDORS.length}개사</div></div>
      <div class="stat-card primary"><div class="stat-card-label">최저가</div><div class="stat-card-value">${fmt(Math.min(...VENDORS.map(v=>v.total)))}</div><div class="stat-card-sub">대성금형공업</div></div>
      <div class="stat-card success"><div class="stat-card-label">최고 점수</div><div class="stat-card-value">${Math.max(...VENDORS.map(v=>v.score))}점</div><div class="stat-card-sub">(주)정밀금형</div></div>
      <div class="stat-card"><div class="stat-card-label">최단 납기</div><div class="stat-card-value">${Math.min(...VENDORS.map(v=>v.leadtime))}일</div><div class="stat-card-sub">한국몰드테크</div></div>
    </div>

    <!-- 종합 비교표 -->
    <div class="form-section">
      <div class="form-section-title">업체별 견적 비교</div>
      <div class="aisrm-grid-wrap">
        <div id="rfq-compare-grid" class="aisrm-grid"></div>
      </div>
    </div>

    <!-- 선정 의견 -->
    <div class="form-section" id="select-section" style="display:none">
      <div class="form-section-title">견적 선정 의견</div>
      <div class="form-grid col1">
        <div class="form-field">
          <label class="form-label">선정 업체</label>
          <input class="form-input" id="selected-vendor-name" readonly>
        </div>
        <div class="form-field">
          <label class="form-label">선정 사유 <span class="req">*</span></label>
          <textarea class="form-textarea" id="select-reason" rows="3" placeholder="선정 사유를 입력하세요 (가격, 납기, 품질 등 평가 근거)"></textarea>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button class="pg-btn" id="select-cancel">취소</button>
        <button class="pg-btn primary" id="select-submit">낙찰 결정 완료</button>
      </div>
    </div>`;

  createAISRMGrid(root.querySelector('#rfq-compare-grid'), {
    columns: [
      { name: 'name', header: '업체명', minWidth: 150, formatter: 'link' },
      { name: 'score', header: '종합 점수', width: 100, align: 'right', formatter: ({ value }) => `${value}점` },
      { name: 'totalText', header: '총 견적 금액', width: 120, align: 'right' },
      ...ITEMS.map((item, i) => ({ name: `item${i}`, header: item, width: 130, align: 'right' })),
      { name: 'leadtimeText', header: '납기', width: 80, align: 'right' },
      { name: 'qual', header: '품질 인증', width: 100 },
      { name: 'remark', header: '특이사항', minWidth: 180 },
      { name: '__actions', header: '업체 선정', width: 110, formatter: ({ row }) => actionButtons([{ label: selectedVendor === row.vendorIndex ? '선정됨' : '선정', primary: selectedVendor === row.vendorIndex, dataset: { vendor: row.vendorIndex } }]) }
    ],
    data: VENDORS.map((v, vendorIndex) => ({
      ...v,
      vendorIndex,
      totalText: fmt(v.total),
      leadtimeText: `${v.leadtime}일`,
      ...Object.fromEntries(v.items.map((amount, i) => [`item${i}`, fmt(amount)]))
    })),
    bodyHeight: 360
  });

  root.querySelector('#rfq-compare-grid').addEventListener('click', e => {
    const btn = e.target.closest('[data-vendor]');
    if (!btn) return;
    selectedVendor = +btn.dataset.vendor;
    root.querySelector('#selected-vendor-name').value = VENDORS[selectedVendor].name;
    root.querySelector('#select-section').style.display = 'block';
    root.querySelector('#select-section').scrollIntoView({ behavior: 'smooth' });
  });

  root.querySelector('#select-cancel').addEventListener('click', () => {
    selectedVendor = null;
    root.querySelector('#select-section').style.display = 'none';
  });

  root.querySelector('#select-submit').addEventListener('click', () => {
    const reason = root.querySelector('#select-reason').value;
    if (selectedVendor === null) { alert('업체를 먼저 선택하세요.'); return; }
    if (!reason) { alert('선정 사유를 입력하세요.'); return; }
    alert(`${VENDORS[selectedVendor].name} 낙찰 결정 완료. 계약 단계로 이동합니다.`);
    history.pushState({ pageId: 'ct-new' }, '', '?page=ct-new');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'ct-new' } }));
  });
}
export function cleanup() {}
