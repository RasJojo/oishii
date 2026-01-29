const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key bypasses RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MOCK_PATIENTS = [
    {
        first_name: "Jean",
        last_name: "Dupont",
        room: "102",
        service: "Cardiologie",
        allergies: ["Gluten", "Arachides"],
        dietary_restrictions: ["Sans sel"],
        status: "ADMITTED"
    },
    {
        first_name: "Marie",
        last_name: "Lambert",
        room: "205",
        service: "Pédiatrie",
        allergies: ["Lactose"],
        dietary_restrictions: ["Végétarien"],
        status: "PENDING_SELECTION"
    },
    {
        first_name: "Robert",
        last_name: "Moreau",
        room: "310",
        service: "Gériatrie",
        allergies: [],
        dietary_restrictions: ["Mixé", "Hypocalorique"],
        status: "ADMITTED"
    }
];

const MOCK_DISHES = [
    {
        name: "Velouté de Potiron",
        category: "ENTREE",
        allergens: ["Lactose"],
        nutritional_info: { calories: 120, protein: 3, carbs: 15, fat: 5 }
    },
    {
        name: "Filet de Colin à la vapeur",
        category: "PLAT",
        allergens: ["Poissons"],
        nutritional_info: { calories: 250, protein: 35, carbs: 2, fat: 12 }
    },
    {
        name: "Riz Pilaf aux petits légumes",
        category: "PLAT",
        allergens: [],
        nutritional_info: { calories: 180, protein: 4, carbs: 40, fat: 3 }
    },
    {
        name: "Compote de Pommes artisanale",
        category: "DESSERT",
        allergens: [],
        nutritional_info: { calories: 85, protein: 0.5, carbs: 21, fat: 0.1 }
    },
    {
        name: "Lasagnes à la Bolognaise",
        category: "PLAT",
        allergens: ["Gluten", "Lactose", "Céleri"],
        nutritional_info: { calories: 450, protein: 25, carbs: 45, fat: 20 }
    }
];

async function seedData() {
  console.log('Seeding data to Supabase with Service Role Key...');

  // 1. Insert Patients
  console.log('Inserting Patients...');
  const { data: patients, error: patientError } = await supabase
    .from('patients')
    .insert(MOCK_PATIENTS)
    .select();

  if (patientError) {
    console.error('Error inserting patients:', patientError);
  } else {
    console.log(`✓ Inserted ${patients.length} patients.`);
  }

  // 2. Insert Dishes
  console.log('Inserting Dishes...');
  const { data: dishes, error: dishError } = await supabase
    .from('dishes')
    .insert(MOCK_DISHES)
    .select();

  if (dishError) {
    console.error('Error inserting dishes:', dishError);
  } else {
    console.log(`✓ Inserted ${dishes.length} dishes.`);
  }

  console.log('Done.');
}

seedData();
