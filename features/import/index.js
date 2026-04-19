// 수출입관리 모듈 초기화
export const initImportModule = async (container, supabase) => {
    // 수출입관리 모듈 초기화 로직
    if (window.importModule && typeof window.importModule.init === 'function') {
        await window.importModule.init(container, supabase);
    }
};

// 수출입관리 모듈 정리
export const cleanupImportModule = () => {
    // 정리 로직 (필요시)
};