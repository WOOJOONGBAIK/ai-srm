import { renderProcessTracker } from '../../components/process-tracker.js';
import { renderPageHeader }     from '../../components/page-header.js';

const PR = {
  prNo: 'PR-2026-0420', title: '생산라인 부품 긴급 수급', status: 'approved',
  category: '자재', requester: '이서연', dept: '생산관리팀', urgent: true,
  date: '2026-04-20', dueDate: '2026-04-25', reason: '생산라인 3호기 베어링 파손으로 인한 긴급 수급 요청. 미수급 시 생산 중단 예상.',
  items: [
    { no:1, code:'BRG-6205', name:'베어링 6205-2RS',  spec:'25×52×15mm', unit:'EA', qty:50,  price:8500,   amt:425000  },
    { no:2, code:'BRG-6306', name:'베어링 6306-ZZ',   spec:'30×72×19mm', unit:'EA', qty:30,  price:12000,  amt:360000  },
    { no:3, code:'SLT-M12',  name:'오일씰 M12',       spec:'12×24×7mm',  unit:'EA', qty:100, price:2800,   amt:280000  },
    { no:4, code:'BLT-A48',  name:'V벨트 A-48',       spec:'Section A',  unit:'EA', qty:20,  price:15000,  amt:300000  },
    { no:5, code:'GRS-W3',   name:'구리스 WD-40 3L',  spec:'다목적',     unit:'CAN',qty:10,  price:35000,  amt:350000  },
  ],
  flowline: [
    { step:1, role:'기안자',   name:'이서연', dept:'생산관리팀', status:'signed',  date:'2026-04-20', opinion:'' },
    { step:2, role:'1차결재',  name:'박팀장', dept:'생산관리팀', status:'signed',  date:'2026-04-20', opinion:'긴급 승인' },
    { step:3, role:'최종결재', name:'김본부장',dept:'구매본부',   status:'signed',  date:'2026-04-20', opinion:'긴급 건. 즉시 발주 진행' },
  ],
};

function fmt(n) { return n.toLocaleString('ko-KR') + '원'; }
const STATUS_MAP = {
  draft:'badge-draft', pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected',
};
const FLOW_STATUS = {
  signed: { label:'승인', color:'#16a34a' },
  pending: { label:'대기', color:'#c2410c' },
  rejected:{ label:'반려', color:'#dc2626' },
};

export default function init(container) {
  renderProcessTracker(container, 'pr');
  renderPageHeader(container, {
    title: `PR 상세 — ${PR.prNo}`,
    subtitle: PR.title,
    actions: [
      { label: '목록으로', pageId: 'pr-list' },
      { label: 'RFQ 전환', primary: true, pageId: 'rfq-new' },
      { label: '출력', onClick: () => window.print() },
    ],
  });

  const root = container.querySelector('#page-pr-detail');
  const totalAmt = PR.items.reduce((s, r) => s + r.amt, 0);

  root.innerHTML = `
    <!-- 상태 배너 -->
    <div style="display:flex;align-items:center;gap:12px;padding:14px 20px;
         background:var(--bg-gray);border-radius:10px;margin-bottom:20px;border:1px solid var(--border-color)">
      <span class="badge ${STATUS_MAP[PR.status]}" style="font-size:13px;padding:5px 12px">승인완료</span>
      ${PR.urgent ? '<span class="badge badge-urgent" style="font-size:13px;padding:5px 12px">긴급</span>' : ''}
      <span style="font-size:13px;color:var(--text-sub);margin-left:auto">최종 승인: 2026-04-20 14:32 · 김본부장</span>
    </div>

    <!-- 기본 정보 -->
    <div class="form-section">
      <div class="form-section-title">기본 정보</div>
      <div class="form-grid">
        ${[['PR번호', PR.prNo], ['요청일', PR.date], ['납기요청일', PR.dueDate],
           ['요청자', PR.requester], ['소속부서', PR.dept], ['구매분류', PR.category]
          ].map(([l,v]) => `
          <div class="form-field">
            <label class="form-label">${l}</label>
            <input class="form-input" value="${v}" readonly>
          </div>`).join('')}
        <div class="form-field span2">
          <label class="form-label">구매요청명</label>
          <input class="form-input" value="${PR.title}" readonly>
        </div>
        <div class="form-field span2">
          <label class="form-label">요청 사유</label>
          <textarea class="form-textarea" readonly rows="3">${PR.reason}</textarea>
        </div>
      </div>
    </div>

    <!-- 품목 목록 -->
    <div class="form-section">
      <div class="form-section-title">품목 목록</div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th><th>품목코드</th><th>품목명</th><th>규격/사양</th>
              <th>단위</th><th>수량</th>
              <th style="text-align:right">단가</th>
              <th style="text-align:right">금액</th>
            </tr>
          </thead>
          <tbody>
            ${PR.items.map(r => `
              <tr>
                <td>${r.no}</td>
                <td style="color:var(--primary-color);font-weight:600">${r.code}</td>
                <td>${r.name}</td>
                <td style="color:var(--text-sub)">${r.spec}</td>
                <td>${r.unit}</td>
                <td style="font-weight:600">${r.qty.toLocaleString()}</td>
                <td style="text-align:right">${fmt(r.price)}</td>
                <td style="text-align:right;font-weight:700">${fmt(r.amt)}</td>
              </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr style="background:var(--bg-gray)">
              <td colspan="7" style="text-align:right;font-weight:700;padding:12px 14px">합 계</td>
              <td style="text-align:right;font-weight:800;font-size:15px;color:var(--primary-color);padding:12px 14px">${fmt(totalAmt)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- 결재 이력 -->
    <div class="form-section">
      <div class="form-section-title">결재 이력</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${PR.flowline.map((f, i) => {
          const fs = FLOW_STATUS[f.status];
          return `
            <div style="flex:1;min-width:160px;padding:16px;border:1px solid var(--border-color);
                 border-radius:10px;background:var(--bg-gray)">
              <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                <span style="font-size:11px;font-weight:700;color:var(--text-sub)">${f.role}</span>
                <span style="font-size:11px;font-weight:700;color:${fs.color}">${fs.label}</span>
              </div>
              <div style="font-size:14px;font-weight:700;margin-bottom:2px">${f.name}</div>
              <div style="font-size:12px;color:var(--text-sub)">${f.dept}</div>
              ${f.date ? `<div style="font-size:11px;color:var(--text-sub);margin-top:8px">${f.date}</div>` : ''}
              ${f.opinion ? `<div style="font-size:12px;color:var(--text-main);margin-top:8px;padding:6px 8px;
                   background:var(--panel-bg);border-radius:6px;border:1px solid var(--border-color)">"${f.opinion}"</div>` : ''}
            </div>
            ${i < PR.flowline.length - 1 ? '<div style="display:flex;align-items:center;font-size:20px;color:var(--text-sub)">›</div>' : ''}`;
        }).join('')}
      </div>
    </div>

    <!-- 진행 현황 -->
    <div class="form-section">
      <div class="form-section-title">후속 프로세스 현황</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${[
          { step:'RFQ 발행', status:'완료', color:'#16a34a', detail:'RFQ-2026-0312 발행 완료' },
          { step:'견적 접수', status:'완료', color:'#16a34a', detail:'3개사 견적 접수' },
          { step:'발주(PO)', status:'진행중', color:'#c2410c', detail:'PO 작성 중' },
          { step:'납기 확인', status:'대기', color:'#94a3b8', detail:'-' },
          { step:'수입검사', status:'대기', color:'#94a3b8', detail:'-' },
        ].map(s => `
          <div style="padding:12px 16px;border:1px solid var(--border-color);border-radius:8px;
               background:var(--panel-bg);min-width:130px;flex:1">
            <div style="font-size:11px;font-weight:600;color:${s.color};margin-bottom:4px">${s.status}</div>
            <div style="font-size:13px;font-weight:700">${s.step}</div>
            <div style="font-size:11px;color:var(--text-sub);margin-top:4px">${s.detail}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

export function cleanup() {}
