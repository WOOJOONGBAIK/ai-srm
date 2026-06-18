# AISRM Grid Standardization Design

> 작성일: 2026-06-17  
> 작성자: AI Agent  
> 상태: 1차 구현 진행  
> 적용 대상: AISRM 전체 목록/조회/입력성 테이블

## 1. 목적

AISRM의 모든 데이터 목록 화면에서 서로 다른 HTML table 구현을 제거하고, 하나의 표준 그리드 컴포넌트로 통일한다.

표준 그리드는 **TOAST UI Grid**를 사용한다. 사용자가 언급한 "네이버/라인 계열 오픈소스 그리드" 후보 중 현재 프로젝트 구조와 가장 잘 맞는 선택지다. TOAST UI Grid는 NHN Cloud가 제공하는 Plain JavaScript 지원 그리드이며, MIT 라이선스다.

## 2. 표준 라이브러리

### 2.1 선정 라이브러리

- 이름: TOAST UI Grid
- 패키지: `tui-grid`
- 공식 사이트: https://ui.toast.com/tui-grid
- GitHub: https://github.com/nhn/tui.grid
- 라이선스: MIT
- 적용 방식: Vanilla JavaScript 기반 공통 래퍼 컴포넌트

### 2.2 선정 사유

- 현재 프로젝트가 Vanilla HTML/CSS/JavaScript + ES Modules 구조라 React/Vue 래퍼 없이 적용 가능하다.
- 정렬, 필터, 편집, 체크박스, 페이징, summary, tree data, frozen column, custom renderer 등 SRM 업무 화면에 필요한 기능을 이미 제공한다.
- 테마 API가 있어 현재 랜딩/메인 톤앤매너에 맞춘 AISRM 전용 테마를 만들 수 있다.
- MIT 라이선스라 상업/개인 프로젝트 모두 사용 가능하다.

### 2.3 제외 후보

- AG Grid: 기능은 강력하지만 Enterprise 기능 구분이 있어 향후 라이선스 혼동 가능성이 있다.
- 직접 HTML table 유지: 화면별 중복이 크고 정렬/필터/페이징/편집 표준화가 어렵다.
- features 전용 `DataTable` 유지: 현재 구현이 단순 문자열 렌더링 기반이고, inline handler와 inline style이 많아 확장성이 낮다.

## 3. 현재 상태 요약

### 3.1 현재 테이블 구현 방식

1. `components/table.js`
   - `DataTable` 클래스가 HTML table 문자열을 생성한다.
   - `features/*/index.html` 다수가 이 클래스를 import해서 사용한다.

2. `pages/scripts/*.js`
   - 각 화면 JS가 직접 `<table class="data-table">` HTML을 생성한다.
   - `tbody.innerHTML = data.map(...)` 형태가 많다.
   - 구매요청, 발주, RFQ, 계약, 납기, 품질, 벤더 마스터 등 주요 업무 화면이 여기에 포함된다.

3. `components/page-header.js`
   - `.data-table` 공통 CSS를 일부 제공한다.
   - TOAST UI Grid 도입 후에는 레거시 table CSS로 분류한다.

### 3.2 우선 전환 대상

1. `pages/scripts/mst-vnd-list.js`
   - 벤더 마스터 조회
   - 체크박스, 검색, 상태 필터, 상세/수정 액션이 있어 표준 패턴 검증에 적합하다.

2. `pages/scripts/pr-list.js`
   - 구매요청 목록
   - 행 클릭 상세 이동, 체크박스 선택, 필터가 있다.

3. `pages/scripts/po-list.js`
   - 발주 목록
   - 금액/수량 정렬과 상태 표시가 중요하다.

4. `pages/scripts/rfq-list.js`
   - RFQ 목록
   - 상태/마감/비교 화면 이동 패턴이 있다.

5. `pages/scripts/qa-iqc-list.js`, `pages/scripts/qa-claim-list.js`
   - 품질 목록
   - 숫자 포맷, 상태 배지, 액션 버튼 검증에 적합하다.

## 4. 표준 아키텍처

### 4.1 신규 공통 파일

다음 파일을 추가한다.

```text
components/grid.js
components/grid-theme.css
docs/grid-standardization-design.md
```

### 4.2 `components/grid.js` 역할

`components/grid.js`는 TOAST UI Grid를 직접 사용하는 유일한 진입점이다. 각 업무 화면은 TOAST UI Grid를 직접 import하지 않고, `createAISRMGrid()` 또는 `AISRMGrid` 래퍼만 사용한다.

예상 API:

```js
import { createAISRMGrid } from '../../components/grid.js';

const grid = createAISRMGrid(root.querySelector('#grid'), {
  rowHeaders: ['checkbox'],
  columns: [
    { name: 'vendorCode', header: '벤더코드', width: 120 },
    { name: 'vendorName', header: '협력사명', minWidth: 180 },
    { name: 'status', header: '상태', renderer: 'statusBadge' }
  ],
  data,
  onDblClick: ({ row }) => openDetail(row.vendorCode)
});
```

### 4.3 표준 옵션

모든 그리드는 기본적으로 다음 정책을 따른다.

- 높이: 컨테이너 기반 자동 높이 또는 업무 화면별 명시 높이
- 행 높이: 38px
- 헤더 높이: 38px
- 폰트: 메인 페이지와 동일한 `Malgun Gothic`, `Apple SD Gothic Neo`
- 테마: AISRM 딥블루/화이트/라이트그레이 기반
- 정렬: 목록 화면 기본 활성화
- 컬럼 리사이즈: 기본 활성화
- 행 선택: 조회 화면은 single 또는 checkbox, 업무 대량처리 화면은 checkbox
- 빈 데이터 문구: `조회된 데이터가 없습니다.`
- 숫자: 우측 정렬, 천 단위 콤마
- 날짜: `YYYY-MM-DD`
- 금액: 우측 정렬, 천 단위 콤마
- 상태: 공통 status badge renderer 사용

### 4.4 CDN vs npm

1차 적용은 **CDN 방식**을 권장한다.

현재 프로젝트는 번들러가 없고 Netlify 정적 배포 구조다. 따라서 `components/grid.js`에서 CDN ES module 또는 전역 UMD 로딩을 표준화한다.

운영 안정화 후 npm/bundler 구조로 전환할 때 `tui-grid` 패키지를 dependencies에 추가한다.

## 5. 개발 방법론

### 5.1 원칙

- 화면별 table 직접 작성 금지.
- 신규 목록 화면은 반드시 `components/grid.js`를 통해 그리드를 생성한다.
- TOAST UI Grid 원본 API는 화면 JS에서 직접 호출하지 않는다. 필요한 기능은 공통 래퍼에 추가한다.
- 레거시 table 코드는 사용자 원칙에 따라 삭제하지 않고 주석 보존 후 신규 grid 코드로 전환한다.
- 각 전환 파일의 History Log가 있으면 변경 이력을 추가한다.

### 5.2 전환 절차

1. 표준 래퍼 작성
   - `components/grid.js`
   - `components/grid-theme.css`

2. 파일럿 화면 1개 전환
   - `pages/scripts/mst-vnd-list.js`
   - 벤더 마스터 조회를 기준 화면으로 삼는다.

3. 파일럿 검증
   - 데이터 표시
   - 정렬
   - 체크박스 선택
   - 검색/필터
   - 상세/수정 액션
   - 모바일/좁은 화면 스크롤

4. 표준 패턴 확정
   - 컬럼 정의 형식
   - renderer 등록 방식
   - action button 패턴
   - 행 클릭/더블클릭 정책

5. 주요 업무 화면 순차 전환
   - PR 목록
   - RFQ 목록
   - PO 목록
   - 계약 목록
   - 납기 목록
   - 품질 목록

6. 레거시 정리 기준 수립
   - `components/table.js`는 당분간 deprecated 처리
   - 신규 사용 금지
   - 모든 참조 제거 후 별도 정리

## 6. 공통 컬럼/렌더러 설계

### 6.1 공통 formatter

- `formatDate(value)`
- `formatDateTime(value)`
- `formatNumber(value)`
- `formatAmount(value)`
- `formatPercent(value)`
- `formatText(value)`

### 6.2 공통 renderer

- `statusBadge`
- `priorityBadge`
- `amountCell`
- `dateCell`
- `linkCell`
- `actionButtons`
- `checkboxHeader`

### 6.3 상태 색상 정책

- 정상/완료: green
- 진행/대기: blue
- 경고/지연: amber
- 오류/반려/불합격: red
- 비활성/종료: gray

## 7. 화면 전환 설계 예시

### 7.1 AS-IS

```js
root.innerHTML = `
  <div class="data-table-wrap">
    <table class="data-table">
      <thead>...</thead>
      <tbody id="vnd-tbody"></tbody>
    </table>
  </div>
`;

tbody.innerHTML = data.map(row => `...`).join('');
```

### 7.2 TO-BE

```js
root.innerHTML = `
  <div class="aisrm-grid-toolbar">...</div>
  <div id="vendor-grid" class="aisrm-grid"></div>
`;

const grid = createAISRMGrid(root.querySelector('#vendor-grid'), {
  rowHeaders: ['checkbox'],
  columns: VENDOR_COLUMNS,
  data: _filtered,
  onClick: ({ rowKey, columnName }) => {
    if (columnName === 'vendorName') openVendorDetail(rowKey);
  }
});
```

## 8. 리스크 및 대응

| 리스크 | 대응 |
|---|---|
| CDN 장애 | 운영 전 npm/bundler 전환 또는 local vendor copy 검토 |
| 기존 화면별 액션 로직 누락 | 파일럿 기준으로 action renderer 표준화 |
| 동적 import 라우터와 CSS 충돌 | `components/grid-theme.css`는 전역 1회 로드, 페이지별 style과 충돌 점검 |
| 대량 데이터 성능 | TOAST UI Grid virtual scroll 사용, 서버 페이징은 별도 단계에서 도입 |
| 편집형 그리드 복잡도 | 조회형 전환 후 PR/RFQ 품목 입력 같은 편집형 화면은 2차 전환 |

## 9. 작업 순서 제안

### Phase 0. 표준 확정

- 이 문서 검토
- TOAST UI Grid 사용 확정
- CDN 우선 적용 여부 확정

### Phase 1. 기반 작업

- `components/grid.js` 추가
- `components/grid-theme.css` 추가
- `components/table.js` deprecated 주석 추가

### Phase 2. 파일럿

- `pages/scripts/mst-vnd-list.js` 전환
- 벤더 조회 화면에서 선택/필터/액션 검증

### Phase 3. 주요 목록 전환

- `pr-list`
- `rfq-list`
- `po-list`
- `ct-list`
- `dlv-asn-list`
- `qa-iqc-list`
- `qa-claim-list`

### Phase 4. 입력형/비교형 전환

- `pr-new`
- `rfq-new`
- `po-new`
- `rfq-compare`

### Phase 5. features 폴더 전환

- `features/*/index.html`의 `DataTable` 사용 화면 전환
- 이후 `components/table.js` 제거 여부는 별도 승인 후 결정

## 10. 완료 기준

- 신규 테이블 화면은 `createAISRMGrid()`만 사용한다.
- 기존 주요 업무 목록 화면은 TOAST UI Grid로 전환된다.
- `.data-table` 직접 작성은 신규 코드에서 금지된다.
- 공통 renderer/formatter가 문서화된다.
- Netlify 배포 후 목록 화면에서 레이아웃 깨짐이 없다.

## 11. 1차 구현 이력

### 2026-06-17

- `components/grid.js` 추가
  - TOAST UI Grid CDN 로더
  - AISRM 표준 그리드 생성 함수 `createAISRMGrid`
  - 공통 formatter, badge, action button helper

- `components/grid-theme.css` 추가
  - AISRM 딥블루/화이트 톤앤매너 기반 그리드 테마

- `components/table.js` 전환
  - 기존 `DataTable` 사용 화면은 내부적으로 `createAISRMGrid`를 사용하도록 변경
  - `features/*`의 기존 `DataTable` 사용 화면은 표준 그리드로 자동 수렴

- 주요 `pages/scripts` 전환
  - `mst-vnd-list`
  - `pr-list`
  - `pr-approve-list`
  - `pr-detail`
  - `pr-new`
  - `rfq-list`
  - `rfq-new`
  - `rfq-compare`
  - `po-list`
  - `po-new`
  - `ct-list`
  - `dlv-asn-list`
  - `dlv-delay-analysis`
  - `qa-iqc-list`
  - `qa-claim-list`

- 검증
  - `components/grid.js`
  - `components/table.js`
  - `pages/scripts/*.js`
  - 위 파일 전체에 대해 `node --check` 통과
