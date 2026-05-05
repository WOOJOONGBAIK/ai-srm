import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const DELAY_DATA = [
  { vendor:'(주)정밀금형',  total:12, ontime:10, delay:2, avgDelay:3.5, rate:83, causes:['자재 수급 지연','생산 일정 변경'], grade:'B' },
  { vendor:'ABC베어링',     total:28, ontime:27, delay:1, avgDelay:1.0, rate:96, causes:['운송사 지연'],                      grade:'A' },
  { vendor:'테크모터(주)',  total:8,  ontime:8,  delay:0, avgDelay:0,   rate:100,causes:[],                                   grade:'A' },
  { vendor:'한국원자재',    total:15, ontime:9,  delay:6, avgDelay:5.2, rate:60, causes:['원자재 수급 불안','생산능력 부족','품질 문제'], grade:'D' },
  { vendor:'대한물류',      total:22, ontime:20, delay:2, avgDelay:1.5, rate:91, causes:['교통 혼잡'],                        grade:'A' },
  { vendor:'코리아오피스',  total:6,  ontime:6,  delay:0, avgDelay:0,   rate:100,causes:[],                                  grade:'A' },
];

const MONTHLY = [
  { month:'2025-11', ontime:42, delay:8  },
  { month:'2025-12', ontime:38, delay:12 },
  { month:'2026-01', ontime:45, delay:7  },
  { month:'2026-02', ontime:40, delay:10 },
  { month:'2026-03', ontime:48, delay:5  },
  { month:'2026-04', ontime:44, delay:6  },
];

const GRADE_CLS = { A:'badge-approved', B:'badge-pending', C:'badge-warn', D:'badge-urgent' };

export default function init(container) {
  renderProcessTracker(container, 'delivery');
  renderPageHeader(container, {
    title: '납기 지연 분석',
    subtitle: '협력사별 납기 준수율 및 지연 원인을 분석합니다.',
    actions: [
      { label: 'ASN 목록', pageId: 'dlv-asn-list' },
      { label: '⬇ 리포트 출력', onClick: () => window.print() },
    ],
  });

  const root = container.querySelector('#page-dlv-delay-analysis');
  const totalOrders = DELAY_DATA.reduce((s,r)=>s+r.total, 0);
  const totalDelay  = DELAY_DATA.reduce((s,r)=>s+r.delay, 0);
  const avgRate     = Math.round(DELAY_DATA.reduce((s,r)=>s+r.rate,0)/DELAY_DATA.length);
  const maxDelay    = DELAY_DATA.reduce((a,b)=>a.avgDelay>b.avgDelay?a:b);

  root.innerHTML = `
    <div class="stat-cards" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card primary"><div class="stat-card-label">분석 기간 발주</div><div class="stat-card-value">${totalOrders}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">지연 건수</div><div class="stat-card-value">${totalDelay}건</div></div>
      <div class="stat-card success"><div class="stat-card-label">평균 납기 준수율</div><div class="stat-card-value">${avgRate}%</div></div>
      <div class="stat-card warn"><div class="stat-card-label">최장 평균 지연</div><div class="stat-card-value">${maxDelay.avgDelay}일</div><div class="stat-card-sub">${maxDelay.vendor}</div></div>
    </div>

    <!-- 월별 트렌드 -->
    <div class="form-section">
      <div class="form-section-title">월별 납기 준수 현황</div>
      <div style="display:flex;gap:0;align-items:flex-end;height:140px;padding:0 8px;border-bottom:2px solid var(--border-color)">
        ${MONTHLY.map(m => {
          const total = m.ontime + m.delay;
          const ontimePct = Math.round(m.ontime/total*100);
          const delayPct  = 100 - ontimePct;
          return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:0 4px">
            <div style="font-size:10px;color:var(--text-sub);margin-bottom:4px">${ontimePct}%</div>
            <div style="width:100%;display:flex;flex-direction:column;height:100px;justify-content:flex-end">
              <div style="background:#dc2626;height:${delayPct}px;border-radius:3px 3px 0 0;opacity:0.8;min-height:${m.delay?'4px':'0'}" title="지연 ${m.delay}건"></div>
              <div style="background:var(--primary-color);height:${ontimePct}px;border-radius:${m.delay?'0':'3px 3px'} 0 0;opacity:0.7" title="납기 준수 ${m.ontime}건"></div>
            </div>
            <div style="font-size:10px;color:var(--text-sub);margin-top:4px">${m.month.slice(5)}월</div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:16px;justify-content:center;margin-top:10px;font-size:12px">
        <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:var(--primary-color);opacity:0.7;border-radius:2px;display:inline-block"></span>납기 준수</span>
        <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#dc2626;opacity:0.8;border-radius:2px;display:inline-block"></span>납기 지연</span>
      </div>
    </div>

    <!-- 협력사별 분석 -->
    <div class="form-section">
      <div class="form-section-title">협력사별 납기 준수율</div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>협력사</th><th style="text-align:right">전체</th><th style="text-align:right">준수</th><th style="text-align:right">지연</th><th style="text-align:right">평균 지연일</th><th>준수율</th><th>주요 지연 원인</th><th>등급</th></tr></thead>
          <tbody>
            ${DELAY_DATA.sort((a,b)=>a.rate-b.rate).map(r => {
              const barColor = r.rate>=95?'#16a34a':r.rate>=80?'var(--primary-color)':r.rate>=60?'#c2410c':'#dc2626';
              return `<tr>
                <td style="font-weight:600">${r.vendor}</td>
                <td style="text-align:right">${r.total}건</td>
                <td style="text-align:right;color:#16a34a;font-weight:600">${r.ontime}건</td>
                <td style="text-align:right;color:${r.delay?'#dc2626':'var(--text-sub)'}${r.delay?';font-weight:700':''}">${r.delay}건</td>
                <td style="text-align:right;color:${r.avgDelay>3?'#dc2626':'var(--text-sub)'}">${r.avgDelay?r.avgDelay+'일':'-'}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="flex:1;height:8px;background:var(--bg-gray);border-radius:4px;overflow:hidden">
                      <div style="height:100%;width:${r.rate}%;background:${barColor};border-radius:4px"></div>
                    </div>
                    <span style="font-weight:700;color:${barColor};min-width:40px;text-align:right">${r.rate}%</span>
                  </div>
                </td>
                <td style="font-size:12px;color:var(--text-sub)">${r.causes.length?r.causes.join(', '):'-'}</td>
                <td><span class="badge ${GRADE_CLS[r.grade]}">${r.grade}등급</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 개선 권고 -->
    <div class="form-section">
      <div class="form-section-title">개선 권고 사항</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${DELAY_DATA.filter(r=>r.rate<80).map(r=>`
          <div style="padding:14px 18px;border-left:4px solid #dc2626;background:rgba(220,38,38,0.04);border-radius:0 8px 8px 0">
            <div style="font-weight:700;color:#dc2626;margin-bottom:4px">⚠ ${r.vendor} — 납기 준수율 ${r.rate}%</div>
            <div style="font-size:13px;color:var(--text-main)">주요 원인: ${r.causes.join(', ')}</div>
            <div style="font-size:12px;color:var(--text-sub);margin-top:4px">권고: 월 1회 납기 점검 미팅 실시 / 대체 협력사 등록 검토</div>
          </div>`).join('')}
        <div style="padding:14px 18px;border-left:4px solid #16a34a;background:rgba(22,163,74,0.04);border-radius:0 8px 8px 0">
          <div style="font-weight:700;color:#16a34a;margin-bottom:4px">✓ 납기 우수 협력사 (준수율 95% 이상)</div>
          <div style="font-size:13px;color:var(--text-main)">${DELAY_DATA.filter(r=>r.rate>=95).map(r=>r.vendor).join(', ')}</div>
          <div style="font-size:12px;color:var(--text-sub);margin-top:4px">우선 발주 협력사로 관리 권고</div>
        </div>
      </div>
    </div>`;
}
export function cleanup() {}
