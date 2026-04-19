// 납기관리 모듈 초기화
export const initDeliveryModule = async (container, supabase) => {
    // 납기관리 모듈 초기화 로직
    if (window.deliveryModule && typeof window.deliveryModule.init === 'function') {
        await window.deliveryModule.init(container, supabase);
    }
};

// 납기관리 모듈 정리
export const cleanupDeliveryModule = () => {
    // 정리 로직 (필요시)
};