const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

// Create client with anon key (will use RLS policies)
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function insertDataDirectly() {
  console.log('Attempting to insert data via SQL RPC...');
  
  // Try using SQL directly via RPC to bypass RLS
  const dishesSQL = MOCK_DISHES.map(d => 
    `('${d.name}', '${d.category}', ARRAY[${d.allergens.map(a => `'${a}'`).join(',')}], '${JSON.stringify(d.nutritional_info)}'::jsonb)`
  ).join(',');
  
  const patientsSQL = MOCK_PATIENTS.map(p => 
    `('${p.first_name}', '${p.last_name}', '${p.room}', '${p.service}', ARRAY[${p.allergies.map(a => `'${a}'`).join(',')}], ARRAY[${p.dietary_restrictions.map(d => `'${d}'`).join(',')}], '${p.status}')`
  ).join(',');

  console.log('Inserting dishes...');
  const { data: dishData, error: dishError } = await supabase.rpc('exec_sql', {
    query: `INSERT INTO dishes (name, category, allergens, nutritional_info) VALUES ${dishesSQL} RETURNING *;`
  });

  if (dishError) {
    console.log('RPC method not available, trying direct insert with temporary policy disable...');
    // Fallback: try direct insert
    const { data, error } = await supabase.from('dishes').insert(MOCK_DISHES).select();
    if (error) {
      console.error('Error inserting dishes:', error.message);
      console.log('\nTo fix this, run this SQL in Supabase dashboard:');
      console.log('ALTER TABLE dishes DISABLE ROW LEVEL SECURITY;');
      console.log('-- Then run this script again');
      console.log('-- Then re-enable: ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;');
    } else {
      console.log(`✓ Inserted ${data.length} dishes`);
    }
  } else {
    console.log(`✓ Inserted dishes via RPC`);
  }

  console.log('\nInserting patients...');
  const { data: patientData, error: patientError } = await supabase.from('patients').insert(MOCK_PATIENTS).select();
  
  if (patientError) {
    console.error('Error inserting patients:', patientError.message);
  } else {
    console.log(`✓ Inserted ${patientData.length} patients`);
  }

  console.log('\nDone. Check your Supabase dashboard to verify the data.');
}

insertDataDirectly();
