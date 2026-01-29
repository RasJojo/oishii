require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Erreur: Variables d'environnement manquantes.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Démarrage du remplissage des données...");

  // 1. Plats
  const dishes = [
    { name: 'Spaghetti Bolognaise', category: 'PLAT', allergens: ['Gluten'], nutritional_info: {calories: 450}, description: 'Classique italien' },
    { name: 'Salade César', category: 'ENTREE', allergens: ['Gluten', 'Lactose', 'Oeufs'], nutritional_info: {calories: 300}, description: 'Sauce maison' },
    { name: 'Pomme', category: 'DESSERT', allergens: [], nutritional_info: {calories: 80}, description: 'Fruit frais' },
    { name: 'Poisson Vapeur', category: 'PLAT', allergens: ['Poissons'], nutritional_info: {calories: 200}, description: 'Avec riz' }
  ];

  const { error: dishError } = await supabase.from('dishes').insert(dishes);
  if (dishError) {
    console.error("❌ Erreur Plats:", dishError.message);
    if (dishError.message.includes('relation "public.dishes" does not exist')) {
        console.log("💡 INDICE : La table 'dishes' n'existe pas. Vous DEVEZ lancer le script SQL dans Supabase Dashboard.");
    }
  } else {
    console.log("✅ Plats insérés.");
  }

  // 2. Patients
  const patients = [
    { first_name: 'Alex', last_name: 'Test', room: '101', service: 'Cardio', status: 'ADMITTED', allergies: ['Gluten'], dietary_restrictions: [] },
    { first_name: 'Sarah', last_name: 'Demo', room: '102', service: 'Onco', status: 'ADMITTED', allergies: [], dietary_restrictions: ['Sans sel'] }
  ];
  
  const { error: patientError } = await supabase.from('patients').insert(patients);
  if (patientError) {
    console.error("❌ Erreur Patients:", patientError.message);
  } else {
    console.log("✅ Patients insérés.");
  }
}

seed();
