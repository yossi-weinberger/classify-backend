import { checkSupabaseConnection } from './supabaseConnect.mjs';

async function main() {
  try {
    const success = await checkSupabaseConnection();
    if (!success) {
      console.error('Supabase ping failed');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('An error occurred while checking Supabase connection:', error);
    process.exitCode = 1;
  }
}

main();
