// 기준정보 모듈 초기화
export const initMasterModule = async (container, supabase) => {
    // 기준정보 모듈 초기화 로직
    if (window.masterModule && typeof window.masterModule.init === 'function') {
        await window.masterModule.init(container, supabase);
    }
};

// 기준정보 모듈 정리
export const cleanupMasterModule = () => {
    // 정리 로직 (필요시)
};