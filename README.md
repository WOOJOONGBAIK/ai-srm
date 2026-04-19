# AI SRM - 공급망 관리 시스템

> **AI에게 먼저 이 파일을 읽혀주세요.** 새 대화를 시작할 때 이 README를 첨부하면 AI가 프로젝트 맥락을 빠르게 파악합니다.

## 프로젝트 목적

협력사(공급업체)와의 구매·납기·계약·품질 관리를 하나의 웹 시스템으로 통합하는 **SRM(Supplier Relationship Management)** 포털입니다.  
AI 프롬프트 입력으로 원하는 모듈로 바로 이동하는 기능이 포함되어 있습니다.

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | Vanilla HTML / CSS / JavaScript (ES Modules) |
| 백엔드 DB | Supabase (PostgreSQL) — 스키마: `sap_mm` |
| 서버리스 API | Netlify Functions (보안 로직 전용) |
| 배포 | Netlify (main 브랜치 자동 배포) |
| 패키지 관리 | npm |

---

## 폴더 구조

```
srm-ai/
├── features/           # 기능 모듈 (기능별로 HTML + JS 한 폴더에)
│   ├── analysis/       # 분석 모듈
│   ├── contract/       # 계약 관리
│   ├── delivery/       # 납기 관리
│   ├── po/             # 발주 관리
│   ├── pr/             # 구매요청
│   ├── quality/        # 품질 관리
│   ├── supplier/       # 협력사 관리
│   └── ...             # (총 17개 모듈)
├── components/         # 공용 UI 컴포넌트 (재사용)
│   ├── crud.js         # CRUD 공통 로직
│   ├── modal.js        # 모달 컴포넌트
│   ├── table.js        # 데이터 테이블
│   └── utils.js        # 공통 유틸리티 (Notification 등)
├── lib/
│   └── supabase.js     # Supabase 클라이언트 단일 출처 (여기서만 createClient)
├── netlify/
│   └── functions/      # 서버사이드 보안 로직 (API 키 노출 금지)
│       └── analysis-data.js
├── data.js             # 정적 가상 데이터 (개발/목업용)
├── index.html          # 메인 앱 진입점
├── portal.html         # 협력사 포털 진입점
├── netlify.toml        # Netlify 배포 설정
└── .env                # 환경변수 (Git에 올리지 말 것!)
```

---

## 데이터 흐름

```
브라우저
  │
  ├─ lib/supabase.js ──────────► Supabase DB (sap_mm 스키마)
  │   └─ ANON KEY 사용 (공개 가능, RLS로 보호)
  │
  └─ /api/* (fetch) ──────────► netlify/functions/
                                  └─ SERVICE_ROLE_KEY 사용 (서버에서만)
                                      └─ Supabase DB
```

---

## 모듈 추가 방법

1. `features/새기능/` 폴더 생성
2. `features/새기능/index.html` — UI (CSS + HTML)
3. `features/새기능/index.js` — 다음 형식 필수:

```js
export const render = async (container, supabase) => {
  // HTML 로드
  const res = await fetch('./features/새기능/index.html');
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  container.innerHTML = doc.body.innerHTML;

  // 초기화
  if (window.새기능Module?.init) {
    await window.새기능Module.init(container, supabase);
  }
};
```

4. `index.html`의 GNB 메뉴 배열에 `{ id: '새기능', label: '새 기능명' }` 추가

---

## 환경변수 설정

### 로컬 개발 (.env 파일 — Git 커밋 금지)
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Netlify Functions 전용
```

### Netlify 배포
Netlify Dashboard > Site Settings > Environment variables 에서 위 변수들을 등록하세요.  
`.env` 파일은 절대 GitHub에 올리지 마세요.

---

## 브랜치 전략

| 브랜치 | 용도 |
|---|---|
| `main` | Netlify 실시간 배포 (안정 버전) |
| `dev` | 통합 개발 브랜치 |
| `feature/기능명` | 새 기능 개발 (완료 후 PR → dev → main) |

---

## 현재 구현 상태

- [x] 기본 GNB/탭 라우팅 구조
- [x] Supabase 연결 (`sap_mm` 스키마)
- [x] 17개 기능 모듈 스캐폴딩 (UI 목업)
- [x] 공통 컴포넌트 (CRUD, Modal, Table, Notification)
- [x] AI 프롬프트 → 모듈 이동 기능
- [ ] 각 모듈 실제 DB 연동 (현재 목업 데이터)
- [ ] 인증 (Supabase Auth / SSO)
- [ ] Chart.js 차트 구현
