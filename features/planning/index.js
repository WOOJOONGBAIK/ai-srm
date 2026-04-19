// 생산계획 모듈 초기화
export const initPlanningModule = async (container, supabase) => {
    // 생산계획 모듈 초기화 로직
    if (window.planningModule && typeof window.planningModule.init === 'function') {
        await window.planningModule.init(container, supabase);
    }
};

// 생산계획 모듈 정리
export const cleanupPlanningModule = () => {
    // 정리 로직 (필요시)
};