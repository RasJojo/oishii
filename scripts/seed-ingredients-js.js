const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
try {
    const envPath = path.resolve(__dirname, '../.env');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ALLERGENS = [
    'Gluten', 'Lactose', 'Arachides', 'Fruits à coque', 'Soja',
    'Crustacés', 'Poissons', 'Œufs', 'Moutarde', 'Sésame',
    'Céleri', 'Sulfites', 'Lupin', 'Mollusques'
];

const INGREDIENTS_DATA = {
    // Lactose
    'Lactose': [
        { name: 'Beurre', unit: 'g' }, { name: 'Crème fraîche', unit: 'ml' }, { name: 'Lait entier', unit: 'ml' },
        { name: 'Yaourt nature', unit: 'pièce' }, { name: 'Mozzarella', unit: 'g' }, { name: 'Emmental', unit: 'g' }
    ],
    // Gluten
    'Gluten': [
        { name: 'Farine de blé', unit: 'g' }, { name: 'Pâtes', unit: 'g' }, { name: 'Pâtes (type standard)', unit: 'g' },
        { name: 'Pain', unit: 'g' }, { name: 'Semoule', unit: 'g' }, { name: 'Pain de mie', unit: 'tranche' }
    ],
    // Oeufs
    'Œufs': [
        { name: 'Oeuf entier', unit: 'pièce' }, { name: 'Mayonnaise', unit: 'g' }
    ],
    // Poissons
    'Poissons': [
        { name: 'Saumon', unit: 'g' }, { name: 'Thon', unit: 'g' }, { name: 'Colin', unit: 'g' }
    ],
    // Crustacés
    'Crustacés': [
        { name: 'Crevettes', unit: 'g' }
    ],
    // Arachides
    'Arachides': [
        { name: 'Cacahuètes', unit: 'g' }, { name: 'Beurre de cacahuète', unit: 'g' }
    ],
    // Fruits à coque
    'Fruits à coque': [
        { name: 'Noix', unit: 'g' }, { name: 'Amandes', unit: 'g' }
    ],
    // Soja
    'Soja': [
        { name: 'Tofu', unit: 'g' }, { name: 'Sauce soja', unit: 'ml' }
    ],
    // SAFE (Pas d'allergène)
    'SAFE': [
        { name: 'Riz', unit: 'g' }, { name: 'Pommes de terre', unit: 'g' }, { name: 'Tomates', unit: 'g' },
        { name: 'Poulet', unit: 'g' }, { name: 'Boeuf', unit: 'g' }, { name: 'Carottes', unit: 'g' },
        { name: 'Pomme', unit: 'pièce' }
    ]
};

async function seed() {
    console.log("🌱 STARTING JS SEED...");

    // 1. Insert Allergens
    console.log("... Seeding Allergens");
    for (const name of ALLERGENS) {
        // Upsert by name
        const { error } = await supabase.from('allergens').upsert({ name }, { onConflict: 'name' });
        if (error) console.error(`Error upserting allergen ${name}:`, error.message);
    }

    // 2. Fetch Allergens Map (Name -> ID)
    const { data: allergensDb } = await supabase.from('allergens').select('id, name');
    const allergenMap = {}; // "Gluten" -> UUID
    if (allergensDb) {
        allergensDb.forEach(a => allergenMap[a.name] = a.id);
    }

    // 3. Insert Ingredients
    console.log("... Seeding Ingredients");
    const ingredientsPayload = [];

    for (const [category, items] of Object.entries(INGREDIENTS_DATA)) {
        const allergenId = category === 'SAFE' ? null : allergenMap[category];
        
        items.forEach(item => {
            ingredientsPayload.push({
                name: item.name,
                default_unit: item.unit,
                allergen_id: allergenId
            });
        });
    }
    
    // Upsert ingredients
    const { error: ingError } = await supabase.from('ingredients').upsert(ingredientsPayload, { onConflict: 'name' });
    
    if (ingError) {
        console.error("❌ Error seeding ingredients:", ingError.message);
    } else {
        console.log("✅ SEED COMPLETE ! Ingredients loaded.");
    }
}

// Auto run if called directly
if (require.main === module) {
    seed();
}

module.exports = seed;
