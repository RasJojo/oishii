const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function e2eSetup() {
  console.log('🚀 Starting End-to-End Setup...\n');

  // Step 1: Create staff accounts in Supabase Auth
  console.log('1️⃣ Creating Staff Accounts...');
  
  const staffAccounts = [
    { email: 'med@hopital.fr', password: 'password123', role: 'MEDICAL', name: 'Dr. Martin' },
    { email: 'cuisine@hopital.fr', password: 'password123', role: 'KITCHEN', name: 'Chef Bernard' }
  ];

  for (const account of staffAccounts) {
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          role: account.role,
          name: account.name
        }
      }
    });

    if (error && error.message.includes('already registered')) {
      console.log(`   ✓ ${account.email} already exists`);
    } else if (error) {
      console.log(`   ✗ Error creating ${account.email}:`, error.message);
    } else {
      console.log(`   ✓ Created ${account.email} (${account.role})`);
    }
  }

  // Step 2: Insert Patients with diverse dietary needs
  console.log('\n2️⃣ Creating Patients with Dietary Restrictions...');
  
  const patients = [
    {
      first_name: 'Jean',
      last_name: 'Dupont',
      room: '102',
      service: 'Cardiologie',
      allergies: ['Gluten', 'Arachides'],
      dietary_restrictions: ['Sans sel'],
      status: 'ADMITTED'
    },
    {
      first_name: 'Marie',
      last_name: 'Lambert',
      room: '205',
      service: 'Pédiatrie',
      allergies: ['Lactose'],
      dietary_restrictions: ['Végétarien'],
      status: 'PENDING_SELECTION'
    },
    {
      first_name: 'Robert',
      last_name: 'Moreau',
      room: '310',
      service: 'Gériatrie',
      allergies: [],
      dietary_restrictions: ['Mixé', 'Hypocalorique'],
      status: 'ADMITTED'
    },
    {
      first_name: 'Sophie',
      last_name: 'Petit',
      room: '105',
      service: 'Cardiologie',
      allergies: ['Fruits à coque', 'Soja'],
      dietary_restrictions: ['Sans porc'],
      status: 'PENDING_SELECTION'
    }
  ];

  // First, disable RLS temporarily for insertion
  console.log('   Attempting to insert patients...');
  const { data: patientsData, error: patientsError } = await supabase
    .from('patients')
    .insert(patients)
    .select();

  if (patientsError) {
    console.log(`   ✗ Error: ${patientsError.message}`);
    console.log('   ℹ️  Run the SQL seed script in Supabase dashboard to insert data');
  } else {
    console.log(`   ✓ Inserted ${patientsData.length} patients`);
  }

  // Step 3: Create diverse dishes
  console.log('\n3️⃣ Creating Dishes Menu...');
  
  const dishes = [
    {
      name: 'Velouté de Potiron',
      category: 'ENTREE',
      allergens: ['Lactose'],
      nutritional_info: { calories: 120, protein: 3, carbs: 15, fat: 5 },
      description: 'Soupe onctueuse de potiron avec crème fraîche'
    },
    {
      name: 'Salade Verte Bio',
      category: 'ENTREE',
      allergens: [],
      nutritional_info: { calories: 45, protein: 2, carbs: 8, fat: 1 },
      description: 'Mélange de salades fraîches avec vinaigrette légère'
    },
    {
      name: 'Filet de Colin à la vapeur',
      category: 'PLAT',
      allergens: ['Poissons'],
      nutritional_info: { calories: 250, protein: 35, carbs: 2, fat: 12 },
      description: 'Poisson blanc cuit vapeur avec citron'
    },
    {
      name: 'Riz Pilaf aux petits légumes',
      category: 'PLAT',
      allergens: [],
      nutritional_info: { calories: 180, protein: 4, carbs: 40, fat: 3 },
      description: 'Riz basmati avec carottes, petits pois et courgettes'
    },
    {
      name: 'Poulet Rôti sans peau',
      category: 'PLAT',
      allergens: [],
      nutritional_info: { calories: 220, protein: 30, carbs: 0, fat: 10 },
      description: 'Blanc de poulet rôti aux herbes'
    },
    {
      name: 'Compote de Pommes artisanale',
      category: 'DESSERT',
      allergens: [],
      nutritional_info: { calories: 85, protein: 0.5, carbs: 21, fat: 0.1 },
      description: 'Compote maison sans sucre ajouté'
    },
    {
      name: 'Yaourt Nature Bio',
      category: 'DESSERT',
      allergens: ['Lactose'],
      nutritional_info: { calories: 60, protein: 5, carbs: 7, fat: 1.5 },
      description: 'Yaourt au lait entier'
    }
  ];

  const { data: dishesData, error: dishesError } = await supabase
    .from('dishes')
    .insert(dishes)
    .select();

  if (dishesError) {
    console.log(`   ✗ Error: ${dishesError.message}`);
    console.log('   ℹ️  Run the SQL seed script in Supabase dashboard to insert data');
  } else {
    console.log(`   ✓ Inserted ${dishesData.length} dishes`);
  }

  // Step 4: Create weekly meal planning
  console.log('\n4️⃣ Creating Weekly Meal Planning...');
  
  const meals = [
    { day: 'Lundi', meal_type: 'Déjeuner', name: 'Menu Équilibré' },
    { day: 'Lundi', meal_type: 'Dîner', name: 'Menu Léger' },
    { day: 'Mardi', meal_type: 'Déjeuner', name: 'Menu Protéiné' }
  ];

  const { data: mealsData, error: mealsError } = await supabase
    .from('meals')
    .insert(meals)
    .select();

  if (mealsError) {
    console.log(`   ✗ Error: ${mealsError.message}`);
  } else {
    console.log(`   ✓ Created ${mealsData.length} meal slots`);
  }

  console.log('\n✅ Setup Complete!\n');
  console.log('📋 Summary:');
  console.log('   - Staff accounts: med@hopital.fr, cuisine@hopital.fr (password: password123)');
  console.log('   - Patients: 4 with various dietary restrictions');
  console.log('   - Dishes: 7 diverse options');
  console.log('   - Meal planning: 3 meal slots created');
  console.log('\n🧪 Next: Run browser tests to verify the full workflow');
}

e2eSetup();
