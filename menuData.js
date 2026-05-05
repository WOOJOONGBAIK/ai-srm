export const menuData = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: '📊',
    subMenus: [
      {
        id: 'db-total',
        title: '종합 관제',
        items: [
          { id: 'db-realtime', title: '실시간 공급망 현황' },
          { id: 'db-kpi', title: '핵심 성과 지표(KPI)' },
          { id: 'db-risk', title: '글로벌 리스크 모니터링' }
        ]
      }
    ]
  },
  {
    id: 'master',
    title: '기준정보',
    icon: '⚙️',
    subMenus: [
      {
        id: 'mst-item',
        title: '품목 마스터',
        items: [
          { id: 'mst-item-reg', title: '품목 마스터 등록' },
          { id: 'mst-bom-mgmt', title: 'BOM 구조 관리' },
          { id: 'mst-spec', title: '사양 최신본 관리' }
        ]
      },
      {
        id: 'mst-code',
        title: '코드 관리',
        items: [
          { id: 'mst-common-code', title: '공통 코드 관리' },
          { id: 'mst-wh-code', title: '창고/위치 코드' }
        ]
      },
      {
        id: 'mst-vendor',
        title: '벤더 마스터',
        items: [
          { id: 'mst-vnd-list', title: '벤더 마스터 조회' },
          { id: 'mst-vnd-new',  title: '벤더 마스터 등록' }
        ]
      }
    ]
  },
  {
    id: 'vendor',
    title: '협력사관리',
    icon: '🤝',
    subMenus: [
      {
        id: 'vnd-reg',
        title: '업체 등록',
        items: [
          { id: 'vnd-master', title: '협력사 기본정보' },
          { id: 'vnd-bank', title: '계좌 및 결제 정보' }
        ]
      },
      {
        id: 'vnd-eval',
        title: '평가 및 심사',
        items: [
          { id: 'vnd-srm-score', title: '정기 평가(SRM)' },
          { id: 'vnd-audit', title: '현장 실사(Audit) 이력' }
        ]
      }
    ]
  },
  {
    id: 'procurement',
    title: '구매요청',
    icon: '📝',
    subMenus: [
      {
        id: 'pr-mgmt',
        title: '요청 관리',
        items: [
          { id: 'pr-create', title: '구매요청(PR) 등록' },
          { id: 'pr-status', title: 'PR 진행 현황' },
          { id: 'pr-approve', title: '구매요청 승인함' }
        ]
      }
    ]
  },
  {
    id: 'contract',
    title: '계약관리',
    icon: '📜',
    subMenus: [
      {
        id: 'ct-master',
        title: '전자 계약',
        items: [
          { id: 'ct-unit-price', title: '단가 계약 관리' },
          { id: 'ct-digital-sign', title: '전자 서명 대기함' },
          { id: 'ct-history', title: '계약 변경 이력' }
        ]
      }
    ]
  },
  {
    id: 'po',
    title: '발주관리',
    icon: '🛒',
    subMenus: [
      {
        id: 'po-process',
        title: '발주 실행',
        items: [
          { id: 'po-issue', title: '발주서(PO) 발행' },
          { id: 'po-status', title: '발주 진행 현황' },
          { id: 'po-change', title: '발주 수정 요청(VOD)' }
        ]
      }
    ]
  },
  {
    id: 'delivery',
    title: '납기관리',
    icon: '🚚',
    subMenus: [
      {
        id: 'dlv-schedule',
        title: '납기 모니터링',
        items: [
          { id: 'dlv-asn', title: '납품 예정통보(ASN)' },
          { id: 'dlv-track', title: '실시간 배송 추적' },
          { id: 'dlv-delay', title: '납기 지연 분석' }
        ]
      }
    ]
  },
  {
    id: 'outsourcing',
    title: '사급관리',
    icon: '📦',
    subMenus: [
      {
        id: 'out-material',
        title: '무상/유상 사급',
        items: [
          { id: 'out-issue', title: '사급 자재 출고' },
          { id: 'out-stock', title: '협력사 재고 현황' },
          { id: 'out-closing', title: '사급 정산 관리' }
        ]
      }
    ]
  },
  {
    id: 'production',
    title: '생산계획',
    icon: '🏭',
    subMenus: [
      {
        id: 'pln-demand',
        title: '수요 및 생산',
        items: [
          { id: 'pln-forecast', title: '수요 예측(Forecast)' },
          { id: 'pln-mps', title: '주생산계획(MPS)' },
          { id: 'pln-work-order', title: '작업 지시 관리' }
        ]
      }
    ]
  },
  {
    id: 'quality',
    title: '품질관리',
    icon: '✅',
    subMenus: [
      {
        id: 'qa-inspect',
        title: '검사 관리',
        items: [
          { id: 'qa-incoming', title: '수입 검사(IQC)' },
          { id: 'qa-process', title: '공정 검사' },
          { id: 'qa-claim', title: '품질 클레임/NCR' }
        ]
      }
    ]
  },
  {
    id: 'customs',
    title: '수출입통관',
    icon: '🌐',
    subMenus: [
      {
        id: 'cus-clearance',
        title: '통관 업무',
        items: [
          { id: 'cus-import', title: '수입 신고 현황' },
          { id: 'cus-export', title: '수출 신고 현황' },
          { id: 'cus-tariff', title: '관세 및 환급 관리' }
        ]
      }
    ]
  },
  {
    id: 'shipping',
    title: '선적관리',
    icon: '🚢',
    subMenus: [
      {
        id: 'shp-logistics',
        title: '물류 실행',
        items: [
          { id: 'shp-booking', title: '부킹(Booking) 관리' },
          { id: 'shp-bl', title: 'B/L 및 선적 서류' },
          { id: 'shp-cost', title: '물류비 정산' }
        ]
      }
    ]
  },
  {
    id: 'project',
    title: '프로젝트관리',
    icon: '📅',
    subMenus: [
      {
        id: 'prj-pms',
        title: 'PMS 연동',
        items: [
          { id: 'prj-wbs', title: 'WBS 일정 관리' },
          { id: 'prj-milestone', title: '마일스톤 달성률' },
          { id: 'prj-budget', title: '프로젝트 예산 대비 집행' }
        ]
      }
    ]
  },
  {
    id: 'tech-data',
    title: '기술자료',
    icon: '📂',
    subMenus: [
      {
        id: 'tech-doc',
        title: '도면 및 문서',
        items: [
          { id: 'tech-drawing', title: '도면 관리(CAD/PDF)' },
          { id: 'tech-eco', title: '설계 변경(ECO) 통보' },
          { id: 'tech-library', title: '표준 기술 자료실' }
        ]
      }
    ]
  }
];