// 사급관리 모듈 초기화
export const initVendorModule = async (container, supabase) => {
    // 사급관리 모듈 초기화 로직
    if (window.vendorModule && typeof window.vendorModule.init === 'function') {
        await window.vendorModule.init(container, supabase);
    }
};

// 사급관리 모듈 정리
export const cleanupVendorModule = () => {
    // 정리 로직 (필요시)
};