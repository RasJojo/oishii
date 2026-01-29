const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmEmails() {
  console.log('🔧 Attempting to auto-confirm staff emails...\n');
  
  const emails = ['med@hopital.fr', 'cuisine@hopital.fr'];
  
  console.log('⚠️  NOTE: Email confirmation requires Service Role Key or Supabase Dashboard access.');
  console.log('Since we only have the anon key, please manually confirm emails in Supabase Dashboard:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/axsstdyyoqnlocgadlgs/auth/users');
  console.log('2. Find users: med@hopital.fr and cuisine@hopital.fr');
  console.log('3. Click the "..." menu next to each user');
  console.log('4. Select "Confirm Email"\n');
  
  console.log('OR disable email confirmation globally:');
  console.log('1. Go to: https://supabase.com/dashboard/project/axsstdyyoqnlocgadlgs/auth/settings');
  console.log('2. Under "Email Auth" → Disable "Enable email confirmations"\n');
  
  // Try to sign in to check current status
  for (const email of emails) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123'
    });
    
    if (error) {
      console.log(`❌ ${email}: ${error.message}`);
    } else {
      console.log(`✅ ${email}: Login successful!`);
    }
  }
}

confirmEmails();
