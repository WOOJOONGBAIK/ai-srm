// 발주관리 모듈 초기화
export const initPOModule = async (container, supabase) => {
    // 발주관리 모듈 초기화 로직
    if (window.poModule && typeof window.poModule.init === 'function') {
        await window.poModule.init(container, supabase);
    }
};

// 발주관리 모듈 정리
export const cleanupPOModule = () => {
    // 정리 로직 (필요시)
};