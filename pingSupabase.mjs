import { checkSupabaseConnection } from './supabaseConnect.mjs';

async function main() {
  const success = await checkSupabaseConnection();
  if (!success) {
    console.error('Supabase ping failed');
    process.exitCode = 1;
  }
}

main();
