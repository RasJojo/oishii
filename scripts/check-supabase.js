
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  console.log('Checking Supabase connection...');
  console.log('URL:', supabaseUrl);

  const tables = ['patients', 'dishes', 'meals', 'menu_planning', 'services'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}': ERROR - ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`Table '${table}': OK - Found ${data.length} rows`);
    }
  }
}

checkSupabase();
