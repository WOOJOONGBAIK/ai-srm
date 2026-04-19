/**
 * netlify/functions/analysis-data.js
 *
 * 보안이 필요한 데이터 조회를 서버사이드에서 처리합니다.
 * - SUPABASE_SERVICE_ROLE_KEY 같은 민감한 키는 여기서만 사용
 * - Netlify Dashboard > Environment variables 에서 환경변수 설정
 *
 * 호출 예시 (브라우저):
 *   fetch('/api/analysis-data?period=month')
 */

import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  // Netlify Environment variables (브라우저에 노출되지 않음)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Service Role Key - 절대 클라이언트에 노출 금지
    { db: { schema: 'sap_mm' } }
  );

  const period = event.queryStringParameters?.period ?? 'month';

  try {
    // 예시: 분석 데이터 조회 (실제 테이블명으로 변경하세요)
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('amount, created_at, supplier_id')
      .gte('created_at', getPeriodStart(period));

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function getPeriodStart(period) {
  const now = new Date();
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  if (period === 'quarter') return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString();
  if (period === 'year') return new Date(now.getFullYear(), 0, 1).toISOString();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}
