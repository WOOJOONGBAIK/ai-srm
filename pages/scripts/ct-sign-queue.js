import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const MOCK = [
  { ctNo:'CT-2026-0123', title:'금형 설계 외주 용역 계약',  vendor:'(주)정밀금형', amt:32000000, signOrder:'갑 서명 대기', dday:3, myTurn:true  },
  { ctNo:'CT-2026-0121', title:'물류 컨설팅 서비스 계약',   vendor:'한국물류연구원',amt:18000000, signOrder:'을 서명 대기', dday:5, myTurn:false },
  { ctNo:'CT-2026-0119', title:'IT 인프라 유지보수 계약',   vendor:'테크솔루션',   amt:48000000, signOrder:'갑 서명 대기', dday:1, myTurn:true  },
];

function fmt(n) { return (n/10000).toFixed(0) + '만원'; }

export default function init(container) {
  renderProcessTracker(container, 'contract');
  renderPageHeader(container, {
    title: '전자 서명 대기함',
    subtitle: '서명을 기다리는 계약서 목록입니다.',
    actions: [{ label: '계약 목록', pageId: 'ct-list' }],
  });

  const root = container.querySelector('#page-ct-sign-queue');
  root.innerHTML = `
    <div class="stat-cards" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card warn"><div class="stat-card-label">전체 대기</div><div class="stat-card-value">${MOCK.length}건</div></div>
      <div class="stat-card danger"><div class="stat-card-label">내 서명 필요</div><div class="stat-card-value">${MOCK.filter(r=>r.myTurn).length}건</div></div>
      <div class="stat-card"><div class="stat-card-label">상대방 서명 대기</div><div class="stat-card-value">${MOCK.filter(r=>!r.myTurn).length}건</div></div>
    </div>

    ${MOCK.map(r => `
      <div style="border:${r.myTurn?'2px solid var(--primary-color)':'1px solid var(--border-color)'};
           border-radius:12px;padding:20px 24px;margin-bottom:12px;background:var(--panel-bg)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-weight:800;color:var(--primary-color);font-size:14px">${r.ctNo}</span>
              ${r.myTurn?'<span class="badge badge-urgent">내 서명 필요</span>':'<span class="badge badge-draft">상대방 대기</span>'}
              <span style="font-size:12px;color:${r.dday<=2?'#dc2626':'var(--text-sub)'}">D-${r.dday}</span>
            </div>
            <div style="font-size:15px;font-weight:700;margin-bottom:4px">${r.title}</div>
            <div style="font-size:13px;color:var(--text-sub)">${r.vendor} · 계약금액: ${fmt(r.amt)}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="pg-btn">계약서 보기</button>
            ${r.myTurn?`
              <button class="pg-btn primary sign-btn" data-ctno="${r.ctNo}">✍ 전자 서명</button>
              <button class="pg-btn danger reject-btn" data-ctno="${r.ctNo}">거부</button>`
            :'<button class="pg-btn">독촉 메일 발송</button>'}
          </div>
        </div>
        <!-- 서명 진행 시각화 -->
        <div style="margin-top:16px;display:flex;align-items:center;gap:0">
          ${[{role:'갑 (당사)', signed:!r.myTurn}, {role:'을 (협력사)', signed:r.myTurn&&r.signOrder.includes('을')}].map((s, i) => `
            <div style="flex:1;padding:10px;border:1px solid var(--border-color);
                 border-radius:${i===0?'8px 0 0 8px':'0 8px 8px 0'};
                 background:${s.signed?'rgba(22,163,74,0.06)':'var(--bg-gray)'};text-align:center">
              <div style="font-size:11px;color:var(--text-sub);margin-bottom:4px">${s.role}</div>
              <div style="font-weight:700;color:${s.signed?'#16a34a':'var(--text-sub)'}">${s.signed?'✓ 서명완료':'서명 대기'}</div>
            </div>
            ${i===0?'<div style="width:1px;height:40px;background:var(--border-color)"></div>':''}`).join('')}
        </div>
      </div>`).join('')}`;

  root.querySelectorAll('.sign-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(`${btn.dataset.ctno} 계약서에 전자 서명하시겠습니까?`)) {
        btn.textContent = '✓ 서명완료';
        btn.className = 'pg-btn';
        btn.disabled = true;
        const card = btn.closest('div[style*="border"]');
        card.style.border = '1px solid var(--border-color)';
        card.querySelector('.badge-urgent').textContent = '서명완료';
        card.querySelector('.badge-urgent').className = 'badge badge-approved';
      }
    });
  });

  root.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const reason = prompt('서명 거부 사유를 입력하세요:');
      if (reason) alert(`${btn.dataset.ctno} 서명 거부 처리 완료`);
    });
  });
}
export function cleanup() {}
