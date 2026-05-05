/**
 * process-tracker.js
 * 구매 프로세스 진행 단계 표시 바
 * 사용법: renderProcessTracker(container, 'pr')
 *
 * stepId: 'pr' | 'rfq' | 'contract' | 'po' | 'delivery' | 'iqc'
 */

const PROC_STEPS = [
  { id: 'pr',       label: '구매요청',  icon: '📝', pageId: 'pr-list'       },
  { id: 'rfq',      label: '견적·입찰', icon: '📋', pageId: 'rfq-list'      },
  { id: 'contract', label: '계약',      icon: '📜', pageId: 'ct-list'       },
  { id: 'po',       label: '발주(PO)',  icon: '🛒', pageId: 'po-list'       },
  { id: 'delivery', label: '납기',      icon: '🚚', pageId: 'dlv-asn-list'  },
  { id: 'iqc',      label: '수입검사',  icon: '✅', pageId: 'qa-iqc-list'   },
];

const CSS = `
<style data-component="process-tracker">
.proc-tracker {
  display: flex; align-items: center; gap: 0;
  padding: 12px 20px; margin-bottom: 20px;
  background: var(--panel-bg); border: 1px solid var(--border-color);
  border-radius: 10px; overflow-x: auto;
  -ms-overflow-style: none; scrollbar-width: none;
}
.proc-tracker::-webkit-scrollbar { display: none; }
.proc-step {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 18px; border-radius: 8px; cursor: default;
  min-width: 90px; flex-shrink: 0; transition: background 0.15s;
  position: relative;
}
.proc-step .proc-icon { font-size: 18px; line-height: 1; }
.proc-step .proc-label {
  font-size: 11px; font-weight: 600; white-space: nowrap;
  color: var(--text-sub);
}
.proc-step .proc-num {
  position: absolute; top: 4px; right: 6px;
  font-size: 9px; font-weight: 700; color: var(--text-sub);
  opacity: 0.5;
}
.proc-step.done {
  background: rgba(0,94,184,0.06);
}
.proc-step.done .proc-label { color: var(--primary-color); }
.proc-step.done .proc-icon::after {
  content: '✓'; font-size: 9px; vertical-align: super; margin-left: 2px;
  color: #22c55e;
}
.proc-step.active {
  background: var(--primary-color);
  box-shadow: 0 3px 10px rgba(0,94,184,0.25);
}
.proc-step.active .proc-label { color: #fff; font-weight: 700; }
.proc-step.active .proc-num { color: rgba(255,255,255,0.6); opacity: 1; }
.proc-arrow {
  font-size: 14px; color: var(--border-color); flex-shrink: 0;
  padding: 0 2px; font-weight: 300;
}
.proc-arrow.done { color: var(--primary-color); opacity: 0.4; }
[data-theme='dark'] .proc-step.done { background: rgba(59,130,246,0.1); }
[data-theme='dark'] .proc-step.active { background: #3b82f6; }
</style>`;

export function renderProcessTracker(container, currentStepId) {
  const existing = container.querySelector('.proc-tracker');
  if (existing) existing.remove();
  const existingStyle = document.head.querySelector('style[data-component="process-tracker"]');
  if (!existingStyle) {
    const tmp = document.createElement('div');
    tmp.innerHTML = CSS;
    document.head.appendChild(tmp.querySelector('style'));
  }

  const currentIdx = PROC_STEPS.findIndex(s => s.id === currentStepId);

  const html = PROC_STEPS.map((step, i) => {
    let cls = '';
    if (i < currentIdx)      cls = 'done';
    else if (i === currentIdx) cls = 'active';

    const arrow = i < PROC_STEPS.length - 1
      ? `<span class="proc-arrow${i < currentIdx ? ' done' : ''}">›</span>`
      : '';

    return `
      <div class="proc-step ${cls}" title="${step.label}">
        <span class="proc-icon">${step.icon}</span>
        <span class="proc-label">${step.label}</span>
        <span class="proc-num">${i + 1}</span>
      </div>${arrow}`;
  }).join('');

  const tracker = document.createElement('div');
  tracker.className = 'proc-tracker';
  tracker.innerHTML = html;
  container.insertBefore(tracker, container.firstChild);
}
