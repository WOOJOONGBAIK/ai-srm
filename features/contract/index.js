export const render = async (container, supabase) => {
  try {
    // HTML 템플릿 로드
    const response = await fetch('./features/contract/index.html');
    const html = await response.text();

    // HTML 파싱 및 body 내용 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.body.innerHTML;

    container.innerHTML = bodyContent;

    // 모듈 초기화 함수 호출
    if (window.contractModule && window.contractModule.init) {
      await window.contractModule.init(container, supabase);
    }
  } catch (error) {
    console.error('Failed to load contract module:', error);
    container.innerHTML = '<p style="color:#c92a2a;">모듈 로드에 실패했습니다.</p>';
  }
};