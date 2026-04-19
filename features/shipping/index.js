// 선적관리 모듈 초기화
export const initShippingModule = async (container, supabase) => {
    // 선적관리 모듈 초기화 로직
    if (window.shippingModule && typeof window.shippingModule.init === 'function') {
        await window.shippingModule.init(container, supabase);
    }
};

// 선적관리 모듈 정리
export const cleanupShippingModule = () => {
    // 정리 로직 (필요시)
};