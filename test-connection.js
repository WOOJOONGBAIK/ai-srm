import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// .env 파일 수동 파싱
function loadEnv() {
  const envPath = path.resolve('./.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return envVars;
}

const env = loadEnv();
console.log('--- 환경 변수 로드 ---');
console.log('URL:', env.SUPABASE_URL);
console.log('KEY:', env.SUPABASE_ANON_KEY ? '데이터 있음' : '데이터 없음');
console.log('---');

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  db: { schema: 'sap_t' }
});

const { data, error } = await supabase
  .from('t001')
  .select('*')
  .limit(1);

if (error) {
  console.error('❌ 연결 실패:', error.message);
} else {
  console.log('✅ Supabase 연결 성공!');
}
