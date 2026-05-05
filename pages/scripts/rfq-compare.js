import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

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
      <div class="data-table-wrap" style="overflow-x:auto">
        <table class="data-table" style="min-width:700px">
          <thead>
            <tr>
              <th>항목</th>
              ${VENDORS.map((v,i) => `<th style="text-align:center;min-width:130px">${v.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:600;color:var(--text-sub)">종합 점수</td>
              ${VENDORS.map(v => {
                const best = v.score === Math.max(...VENDORS.map(x=>x.score));
                return `<td style="text-align:center">
                  <div style="font-size:18px;font-weight:800;color:${best?'var(--primary-color)':'var(--text-main)'}">${v.score}점</div>
                  ${best?'<div style="font-size:10px;color:var(--primary-color)">★ 최고점</div>':''}
                </td>`;
              }).join('')}
            </tr>
            <tr>
              <td style="font-weight:600;color:var(--text-sub)">총 견적 금액</td>
              ${VENDORS.map(v => {
                const best = v.total === Math.min(...VENDORS.map(x=>x.total));
                return `<td style="text-align:center;font-weight:700;color:${best?'#16a34a':'var(--text-main)'}">${fmt(v.total)}${best?'<br><span style="font-size:10px">★ 최저가</span>':''}</td>`;
              }).join('')}
            </tr>
            ${ITEMS.map((item, i) => `
              <tr>
                <td style="color:var(--text-sub);padding-left:20px">∟ ${item}</td>
                ${VENDORS.map(v => `<td style="text-align:center;font-size:13px">${fmt(v.items[i])}</td>`).join('')}
              </tr>`).join('')}
            <tr>
              <td style="font-weight:600;color:var(--text-sub)">납기 (일)</td>
              ${VENDORS.map(v => {
                const best = v.leadtime === Math.min(...VENDORS.map(x=>x.leadtime));
                return `<td style="text-align:center;font-weight:600;color:${best?'#16a34a':'var(--text-main)'}">${v.leadtime}일</td>`;
              }).join('')}
            </tr>
            <tr>
              <td style="font-weight:600;color:var(--text-sub)">품질 인증</td>
              ${VENDORS.map(v => `<td style="text-align:center">${v.qual}</td>`).join('')}
            </tr>
            <tr>
              <td style="font-weight:600;color:var(--text-sub)">특이사항</td>
              ${VENDORS.map(v => `<td style="text-align:center;font-size:12px;color:var(--text-sub)">${v.remark}</td>`).join('')}
            </tr>
            <tr style="background:var(--bg-gray)">
              <td style="font-weight:700">업체 선정</td>
              ${VENDORS.map((v,i) => `
                <td style="text-align:center">
                  <button class="tbl-btn${selectedVendor===i?' primary':''}" data-vendor="${i}" id="btn-select-${i}">
                    ${selectedVendor===i?'✓ 선정됨':'선정'}
                  </button>
                </td>`).join('')}
            </tr>
          </tbody>
        </table>
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
        <button class="pg-btn" onclick="root.querySelector('#select-section').style.display='none'; selectedVendor=null;">취소</button>
        <button class="pg-btn primary" onclick="submitSelect()">낙찰 결정 완료</button>
      </div>
    </div>`;

  root.querySelectorAll('[data-vendor]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedVendor = +btn.dataset.vendor;
      root.querySelector('#selected-vendor-name').value = VENDORS[selectedVendor].name;
      root.querySelector('#select-section').style.display = 'block';
      root.querySelectorAll('[data-vendor]').forEach((b, i) => {
        b.className = `tbl-btn${i === selectedVendor ? ' primary' : ''}`;
        b.textContent = i === selectedVendor ? '✓ 선정됨' : '선정';
      });
      root.querySelector('#select-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.submitSelect = () => {
    const reason = root.querySelector('#select-reason').value;
    if (!reason) { alert('선정 사유를 입력하세요.'); return; }
    alert(`${VENDORS[selectedVendor].name} 낙찰 결정 완료. 계약 단계로 이동합니다.`);
    history.pushState({ pageId: 'ct-new' }, '', '?page=ct-new');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { pageId: 'ct-new' } }));
  };
}
export function cleanup() { delete window.submitSelect; }
