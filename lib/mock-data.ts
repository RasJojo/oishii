export type StaffRole = "MEDICAL" | "KITCHEN" | "ADMIN";

export interface StaffAccount {
    email: string;
    name: string;
    role: StaffRole;
}

export const MOCK_STAFF_ACCOUNTS: StaffAccount[] = [
    {
        email: "med@hopital.fr",
        name: "Dr. Martin",
        role: "MEDICAL",
    },
    {
        email: "cuisine@hopital.fr",
        name: "Chef Bernard",
        role: "KITCHEN",
    },
];

export type PatientStatus = "ADMITTED" | "DISCHARGED" | "PENDING_SELECTION";

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    room: string;
    service: string;
    allergies: string[];
    dietaryRestrictions: string[];
    status: PatientStatus;
    lastMealSelected?: string;
}

export const MOCK_PATIENTS: Patient[] = [
    {
        id: "PAT-001",
        firstName: "Jean",
        lastName: "Dupont",
        room: "102",
        service: "Cardiologie",
        allergies: ["Gluten", "Arachides"],
        dietaryRestrictions: ["Sans sel"],
        status: "ADMITTED",
        lastMealSelected: "Déjeuner - 09/01/2026",
    },
    {
        id: "PAT-002",
        firstName: "Marie",
        lastName: "Lambert",
        room: "205",
        service: "Pédiatrie",
        allergies: ["Lactose"],
        dietaryRestrictions: ["Végétarien"],
        status: "PENDING_SELECTION",
    },
    {
        id: "PAT-003",
        firstName: "Robert",
        lastName: "Moreau",
        room: "310",
        service: "Gériatrie",
        allergies: [],
        dietaryRestrictions: ["Mixé", "Hypocalorique"],
        status: "ADMITTED",
        lastMealSelected: "Petit-déjeuner - 09/01/2026",
    },
    {
        id: "PAT-004",
        firstName: "Sophie",
        lastName: "Petit",
        room: "105",
        service: "Cardiologie",
        allergies: ["Fruits à coque", "Soja"],
        dietaryRestrictions: ["Sans porc"],
        status: "PENDING_SELECTION",
    },
    {
        id: "PAT-005",
        firstName: "Thomas",
        lastName: "Rousseau",
        room: "412",
        service: "Oncologie",
        allergies: ["Crustacés"],
        dietaryRestrictions: ["Sans gluten"],
        status: "ADMITTED",
        lastMealSelected: "Déjeuner - 09/01/2026",
    },
    {
        id: "PAT-TEST-001",
        firstName: "Alexandre",
        lastName: "Le Grand",
        room: "999",
        service: "Test Unit",
        allergies: ["Gluten", "Sulfites", "Crustacés"],
        dietaryRestrictions: [],
        status: "ADMITTED",
        lastMealSelected: undefined,
    },
];

export const ALLERGENS_LIST = [
    "Gluten",
    "Lactose",
    "Arachides",
    "Fruits à coque",
    "Soja",
    "Crustacés",
    "Poissons",
    "Œufs",
    "Moutarde",
    "Sésame",
    "Céleri",
    "Sulfites",
    "Lupin",
];

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    allergen?: string; // Allergène associé à cet ingrédient (ex: "Gluten", "Lactose")
}

export interface Dish {
    id: string;
    name: string;
    category: "ENTREE" | "PLAT" | "DESSERT";
    description?: string;
    ingredients?: Ingredient[];
    allergens: string[]; // Calculé automatiquement depuis les ingrédients
    nutritionalInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

// Fonction utilitaire pour détecter automatiquement les allergènes depuis les ingrédients
export function detectAllergensFromIngredients(ingredients: Ingredient[]): string[] {
    const allergens = new Set<string>();
    ingredients.forEach(ingredient => {
        if (ingredient.allergen) {
            allergens.add(ingredient.allergen);
        }
    });
    return Array.from(allergens);
}

export const MOCK_DISHES: Dish[] = [
    // --- 1. GLUTEN ---
    {
        id: "DISH-TEST-001",
        name: "Spaghetti Bolognaise",
        category: "PLAT",
        description: "Pâtes fraîches à la sauce tomate et viande",
        ingredients: [
            { name: "Spaghetti", quantity: 150, unit: "g", allergen: "Gluten" },
            { name: "Viande hachée", quantity: 100, unit: "g" },
            { name: "Sauce tomate", quantity: 50, unit: "ml" }
        ],
        allergens: ["Gluten"],
        nutritionalInfo: { calories: 450, protein: 20, carbs: 60, fat: 15 }
    },
    // --- 2. LACTOSE ---
    {
        id: "DISH-TEST-002",
        name: "Gratin Dauphinois",
        category: "PLAT",
        description: "Pommes de terre fondantes à la crème",
        ingredients: [
            { name: "Pommes de terre", quantity: 200, unit: "g" },
            { name: "Crème fraîche", quantity: 100, unit: "ml", allergen: "Lactose" },
            { name: "Lait entier", quantity: 50, unit: "ml", allergen: "Lactose" }
        ],
        allergens: ["Lactose"],
        nutritionalInfo: { calories: 350, protein: 5, carbs: 40, fat: 20 }
    },
    // --- 3. ARACHIDES ---
    {
        id: "DISH-TEST-003",
        name: "Poulet Satay",
        category: "PLAT",
        description: "Brochettes de poulet sauce cacahuète",
        ingredients: [
            { name: "Poulet", quantity: 150, unit: "g" },
            { name: "Beurre de cacahuète", quantity: 30, unit: "g", allergen: "Arachides" },
            { name: "Lait de coco", quantity: 50, unit: "ml" }
        ],
        allergens: ["Arachides"],
        nutritionalInfo: { calories: 400, protein: 30, carbs: 10, fat: 25 }
    },
    // --- 4. FRUITS À COQUE ---
    {
        id: "DISH-TEST-004",
        name: "Brownie aux Noix",
        category: "DESSERT",
        description: "Gâteau au chocolat fondant avec éclats de noix",
        ingredients: [
            { name: "Chocolat noir", quantity: 50, unit: "g" },
            { name: "Noix", quantity: 20, unit: "g", allergen: "Fruits à coque" },
            { name: "Sucre", quantity: 30, unit: "g" }
        ],
        allergens: ["Fruits à coque"],
        nutritionalInfo: { calories: 300, protein: 5, carbs: 35, fat: 15 }
    },
    // --- 5. SOJA ---
    {
        id: "DISH-TEST-005",
        name: "Wok Tofu & Légumes",
        category: "PLAT",
        description: "Sauté de légumes et tofu mariné",
        ingredients: [
            { name: "Tofu", quantity: 100, unit: "g", allergen: "Soja" },
            { name: "Sauce soja", quantity: 20, unit: "ml", allergen: "Soja" },
            { name: "Poivrons", quantity: 50, unit: "g" }
        ],
        allergens: ["Soja"],
        nutritionalInfo: { calories: 250, protein: 15, carbs: 10, fat: 10 }
    },
    // --- 6. POISSONS ---
    {
        id: "DISH-TEST-006",
        name: "Pavé de Saumon",
        category: "PLAT",
        description: "Saumon grillé à l'unilatérale",
        ingredients: [
            { name: "Saumon", quantity: 150, unit: "g", allergen: "Poissons" },
            { name: "Citron", quantity: 10, unit: "g" }
        ],
        allergens: ["Poissons"],
        nutritionalInfo: { calories: 300, protein: 25, carbs: 0, fat: 20 }
    },
    // --- 7. CRUSTACÉS ---
    {
        id: "DISH-TEST-007",
        name: "Bisque de Crevettes",
        category: "ENTREE",
        description: "Soupe onctueuse aux crevettes roses",
        ingredients: [
            { name: "Crevettes", quantity: 80, unit: "g", allergen: "Crustacés" },
            { name: "Crème liquide", quantity: 20, unit: "ml", allergen: "Lactose" },
            { name: "Tomates", quantity: 50, unit: "g" }
        ],
        allergens: ["Crustacés", "Lactose"],
        nutritionalInfo: { calories: 150, protein: 10, carbs: 5, fat: 8 }
    },
    // --- 8. MOLLUSQUES ---
    {
        id: "DISH-TEST-008",
        name: "Moules Marinières",
        category: "PLAT",
        description: "Moules fraîches au vin blanc et échalotes",
        ingredients: [
            { name: "Moules", quantity: 300, unit: "g", allergen: "Mollusques" },
            { name: "Vin blanc", quantity: 50, unit: "ml", allergen: "Sulfites" },
            { name: "Echalotes", quantity: 20, unit: "g" }
        ],
        allergens: ["Mollusques", "Sulfites"],
        nutritionalInfo: { calories: 200, protein: 20, carbs: 5, fat: 5 }
    },
    // --- 9. OEUFS ---
    {
        id: "DISH-TEST-009",
        name: "Omelette Nature",
        category: "PLAT",
        description: "Omelette baveuse aux 3 oeufs",
        ingredients: [
            { name: "Oeuf entier", quantity: 3, unit: "pièce", allergen: "Œufs" },
            { name: "Beurre", quantity: 10, unit: "g", allergen: "Lactose" }
        ],
        allergens: ["Œufs", "Lactose"],
        nutritionalInfo: { calories: 250, protein: 18, carbs: 1, fat: 18 }
    },
    // --- 10. CÉLERI ---
    {
        id: "DISH-TEST-010",
        name: "Pot-au-feu",
        category: "PLAT",
        description: "Boeuf mijoté aux légumes d'hiver",
        ingredients: [
            { name: "Boeuf", quantity: 150, unit: "g" },
            { name: "Céleri branche", quantity: 50, unit: "g", allergen: "Céleri" },
            { name: "Carottes", quantity: 50, unit: "g" }
        ],
        allergens: ["Céleri"],
        nutritionalInfo: { calories: 350, protein: 30, carbs: 10, fat: 15 }
    },
    // --- 11. MOUTARDE ---
    {
        id: "DISH-TEST-011",
        name: "Lapin à la Moutarde",
        category: "PLAT",
        description: "Cuisse de lapin sauce moutarde à l'ancienne",
        ingredients: [
            { name: "Lapin", quantity: 150, unit: "g" },
            { name: "Moutarde", quantity: 30, unit: "g", allergen: "Moutarde" },
            { name: "Crème fraîche", quantity: 30, unit: "ml", allergen: "Lactose" }
        ],
        allergens: ["Moutarde", "Lactose"],
        nutritionalInfo: { calories: 300, protein: 25, carbs: 5, fat: 15 }
    },
    // --- 12. SÉSAME ---
    {
        id: "DISH-TEST-012",
        name: "Tataki de Thon Sésame",
        category: "ENTREE",
        description: "Thon mi-cuit en croûte de sésame",
        ingredients: [
            { name: "Thon", quantity: 100, unit: "g", allergen: "Poissons" },
            { name: "Graines de sésame", quantity: 20, unit: "g", allergen: "Sésame" }
        ],
        allergens: ["Sésame", "Poissons"],
        nutritionalInfo: { calories: 200, protein: 25, carbs: 2, fat: 10 }
    },
    // --- 13. SULFITES ---
    {
        id: "DISH-TEST-013",
        name: "Boeuf Bourguignon",
        category: "PLAT",
        description: "Boeuf mijoté au vin rouge",
        ingredients: [
            { name: "Boeuf", quantity: 150, unit: "g" },
            { name: "Vin rouge", quantity: 100, unit: "ml", allergen: "Sulfites" },
            { name: "Lardons", quantity: 30, unit: "g" }
        ],
        allergens: ["Sulfites"],
        nutritionalInfo: { calories: 450, protein: 35, carbs: 5, fat: 25 }
    },
    // --- 14. LUPIN ---
    {
        id: "DISH-TEST-014",
        name: "Biscuit Financier Lupin",
        category: "DESSERT",
        description: "Biscuit riche en protéines à la farine de lupin",
        ingredients: [
            { name: "Farine de lupin", quantity: 50, unit: "g", allergen: "Lupin" },
            { name: "Sucre", quantity: 30, unit: "g" },
            { name: "Beurre", quantity: 30, unit: "g", allergen: "Lactose" }
        ],
        allergens: ["Lupin", "Lactose"],
        nutritionalInfo: { calories: 250, protein: 10, carbs: 30, fat: 12 }
    },
    // --- PLAT SAFE (TÉMOIN) ---
    {
        id: "DISH-SAFE-001",
        name: "Riz Nature aux Herbes",
        category: "PLAT",
        description: "Riz basmati cuit vapeur aux herbes de provence",
        ingredients: [
            { name: "Riz basmati", quantity: 150, unit: "g" },
            { name: "Huile d'olive", quantity: 10, unit: "ml" }
        ],
        allergens: [],
        nutritionalInfo: { calories: 200, protein: 4, carbs: 40, fat: 2 }
    }
];

export const DIETS_LIST = [
    "Sans sel",
    "Diabétique",
    "Hypocalorique",
    "Végétarien",
    "Végétalien",
    "Sans porc",
    "Mixé",
    "Texture lisse",
    "Haché",
];
