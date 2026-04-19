// 프로젝트관리 모듈 초기화
export const initProjectModule = async (container, supabase) => {
    // 프로젝트관리 모듈 초기화 로직
    if (window.projectModule && typeof window.projectModule.init === 'function') {
        await window.projectModule.init(container, supabase);
    }
};

// 프로젝트관리 모듈 정리
export const cleanupProjectModule = () => {
    // 정리 로직 (필요시)
};