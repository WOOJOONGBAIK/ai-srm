// SRM Portal 가상 데이터
// 실제 운영 시 Supabase로 교체 가능

export const portalData = {
  notices: [
    {
      id: 1,
      title: "2026년 SRM 시스템 정기 점검 안내",
      date: "2026-04-20",
      summary: "4월 20일 오전 2시-4시 시스템 점검 예정입니다.",
      content: "상세 내용: 점검 시간 동안 시스템 이용이 제한됩니다. 협력사분들은 양해 부탁드립니다."
    },
    {
      id: 2,
      title: "원자재 가격 변동에 따른 계약 갱신 가이드",
      date: "2026-04-15",
      summary: "최근 원자재 가격 상승으로 계약 갱신 절차가 변경되었습니다.",
      content: "변경 사항: 가격 조정 요청 시 3영업일 이내 승인 절차 적용."
    },
    {
      id: 3,
      title: "신규 협력사 등록 프로세스 개선",
      date: "2026-04-10",
      summary: "협력사 등록 절차가 간소화되었습니다.",
      content: "개선 사항: 온라인 등록 후 1영업일 이내 승인 완료."
    }
  ],

  faq: [
    {
      id: 1,
      category: "시스템 이용",
      question: "SRM 시스템에 처음 접속하려면 어떻게 해야 하나요?",
      answer: "포털 페이지에서 LDAP 로그인 또는 SSO 인증을 진행하세요. 인증 후 자동으로 대시보드로 이동합니다."
    },
    {
      id: 2,
      category: "인증 관련",
      question: "비밀번호를 잊어버렸습니다. 어떻게 재설정하나요?",
      answer: "LDAP 계정의 경우 IT팀에 문의하세요. 외부 협력사의 경우 포털 하단 연락처로 문의 바랍니다."
    },
    {
      id: 3,
      category: "서류 제출",
      question: "OCR 검증은 어떤 서류에 적용되나요?",
      answer: "선적 서류(Invoice, Packing List 등)에 적용됩니다. AI가 자동 인식하므로 정확도를 확인 후 승인하세요."
    },
    {
      id: 4,
      category: "시스템 이용",
      question: "모바일에서도 이용 가능한가요?",
      answer: "네, 반응형 디자인으로 모바일/태블릿에서도 정상 이용 가능합니다."
    },
    {
      id: 5,
      category: "인증 관련",
      question: "SSO 로그인은 어떤 방식인가요?",
      answer: "기업 SSO 시스템과 연동되어 별도 비밀번호 입력 없이 로그인할 수 있습니다."
    }
  ],

  archives: {
    public: [
      {
        id: 1,
        title: "SRM 시스템 이용 매뉴얼",
        type: "PDF",
        size: "2.3MB",
        url: "#"
      },
      {
        id: 2,
        title: "협력사 등록 가이드",
        type: "PDF",
        size: "1.8MB",
        url: "#"
      }
    ],
    authenticated: [
      {
        id: 3,
        title: "품질 검사 양식 (업체별)",
        type: "Excel",
        size: "0.5MB",
        url: "#",
        role: "external" // 외부 협력사 전용
      },
      {
        id: 4,
        title: "계약 갱신 템플릿",
        type: "Word",
        size: "0.3MB",
        url: "#",
        role: "all" // 모두
      }
    ]
  }
};