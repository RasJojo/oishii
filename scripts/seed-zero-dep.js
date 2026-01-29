const fs = require('fs');
const path = require('path');

// 1. Lire .env manuellement (Zero Dependency)
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error("❌ Erreur lecture .env", e);
        return {};
    }
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Variables manquantes dans .env");
    process.exit(1);
}

// 2. Fonction Insert via REST API (Native Fetch)
async function insertData(table, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal' // Pas besoin de retour
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`${response.status} ${response.statusText} - ${txt}`);
        }
        console.log(`✅ Table '${table}': Données insérées.`);
    } catch (err) {
        console.error(`❌ Erreur '${table}':`, err.message);
    }
}

async function seed() {
    console.log("🌱 Démarrage Seed (Mode REST Fetch)...");

    // DISHES
    const dishes = [
        { name: 'Spaghetti Bolognaise', category: 'PLAT', allergens: ['Gluten'], nutritional_info: {calories: 450}, description: 'Classique italien' },
        { name: 'Salade César', category: 'ENTREE', allergens: ['Gluten', 'Lactose', 'Oeufs'], nutritional_info: {calories: 300}, description: 'Sauce maison' },
        { name: 'Pomme', category: 'DESSERT', allergens: [], nutritional_info: {calories: 80}, description: 'Fruit frais' },
        { name: 'Crème Brûlée', category: 'DESSERT', allergens: ['Lactose', 'Oeufs'], nutritional_info: {calories: 350}, description: 'Caramélisée' },
        { name: 'Filet de Colin', category: 'PLAT', allergens: ['Poissons'], nutritional_info: {calories: 200}, description: 'Vapeur' }
    ];

    // PATIENTS (Avec Nom "LEGRAND" pour le test login)
    const patients = [
        { first_name: 'Alexandre', last_name: 'LEGRAND', room: '101', service: 'Cardiologie', status: 'ADMITTED', allergies: ['Gluten'], dietary_restrictions: [] },
        { first_name: 'Sarah', last_name: 'CONNOR', room: '204', service: 'Traumatologie', status: 'ADMITTED', allergies: [], dietary_restrictions: ['Sans sel'] }
    ];

    await insertData('dishes', dishes);
    await insertData('patients', patients);
    
    console.log("🏁 Terminé.");
}

seed();
