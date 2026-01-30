const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createJoelaAccount() {
  console.log('🔐 Creating account for joela.rasam@gmail.com...\n');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'joela.rasam@gmail.com',
    password: 'password123',
    options: {
      data: {
        role: 'MEDICAL',
        name: 'Joela Rasam'
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✓ Account joela.rasam@gmail.com already exists');
    } else {
      console.log('✗ Error:', error.message);
    }
  } else {
    console.log('✅ Account created successfully!');
    console.log('   Email: joela.rasam@gmail.com');
    console.log('   Password: password123');
    console.log('   Role: MEDICAL');
    console.log('\n📧 Check your email to confirm the account');
    console.log('   Or confirm manually in Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/axsstdyyoqnlocgadlgs/auth/users');
  }
}

createJoelaAccount();
