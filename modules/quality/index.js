// 품질관리 모듈 초기화
export const initQualityModule = async (container, supabase) => {
    // 품질관리 모듈 초기화 로직
    if (window.qualityModule && typeof window.qualityModule.init === 'function') {
        await window.qualityModule.init(container, supabase);
    }
};

// 품질관리 모듈 정리
export const cleanupQualityModule = () => {
    // 정리 로직 (필요시)
};