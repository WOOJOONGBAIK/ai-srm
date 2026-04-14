import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { db: { schema: 'sap_t' } }
);

const { data, error } = await supabase
  .from('t001')
  .select('*')
  .limit(1);

if (error) {
  console.error('❌ 연결 실패:', error.message);
} else {
  console.log('✅ Supabase 연결 성공:', data);
}
