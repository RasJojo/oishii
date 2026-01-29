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
    {
        id: "DISH-001",
        name: "Velouté de Potiron",
        category: "ENTREE",
        description: "Soupe onctueuse de potiron avec une touche de crème fraîche",
        ingredients: [
            { name: "Potiron", quantity: 300, unit: "g" },
            { name: "Crème fraîche", quantity: 50, unit: "ml", allergen: "Lactose" },
            { name: "Oignon", quantity: 50, unit: "g" },
            { name: "Bouillon de légumes", quantity: 200, unit: "ml" },
        ],
        allergens: ["Lactose"],
        nutritionalInfo: { calories: 120, protein: 3, carbs: 15, fat: 5 },
    },
    {
        id: "DISH-002",
        name: "Filet de Colin à la vapeur",
        category: "PLAT",
        description: "Filet de colin cuit à la vapeur, accompagné de légumes de saison",
        ingredients: [
            { name: "Filet de colin", quantity: 150, unit: "g", allergen: "Poissons" },
            { name: "Courgettes", quantity: 100, unit: "g" },
            { name: "Carottes", quantity: 80, unit: "g" },
            { name: "Citron", quantity: 20, unit: "g" },
        ],
        allergens: ["Poissons"],
        nutritionalInfo: { calories: 250, protein: 35, carbs: 2, fat: 12 },
    },
    {
        id: "DISH-003",
        name: "Riz Pilaf aux petits légumes",
        category: "PLAT",
        description: "Riz basmati accompagné de petits légumes colorés",
        ingredients: [
            { name: "Riz basmati", quantity: 80, unit: "g" },
            { name: "Petits pois", quantity: 50, unit: "g" },
            { name: "Carottes", quantity: 50, unit: "g" },
            { name: "Maïs", quantity: 30, unit: "g" },
            { name: "Huile d'olive", quantity: 10, unit: "ml" },
        ],
        allergens: [],
        nutritionalInfo: { calories: 180, protein: 4, carbs: 40, fat: 3 },
    },
    {
        id: "DISH-004",
        name: "Compote de Pommes artisanale",
        category: "DESSERT",
        description: "Compote de pommes maison sans sucre ajouté",
        ingredients: [
            { name: "Pommes", quantity: 200, unit: "g" },
            { name: "Cannelle", quantity: 1, unit: "g" },
        ],
        allergens: [],
        nutritionalInfo: { calories: 85, protein: 0.5, carbs: 21, fat: 0.1 },
    },
    {
        id: "DISH-005",
        name: "Lasagnes à la Bolognaise",
        category: "PLAT",
        description: "Lasagnes traditionnelles avec sauce bolognaise et béchamel",
        ingredients: [
            { name: "Pâtes à lasagnes", quantity: 100, unit: "g", allergen: "Gluten" },
            { name: "Viande hachée", quantity: 120, unit: "g" },
            { name: "Sauce tomate", quantity: 100, unit: "ml" },
            { name: "Béchamel", quantity: 80, unit: "ml", allergen: "Lactose" },
            { name: "Parmesan", quantity: 30, unit: "g", allergen: "Lactose" },
            { name: "Céleri", quantity: 20, unit: "g", allergen: "Céleri" },
            { name: "Oignon", quantity: 50, unit: "g" },
        ],
        allergens: ["Gluten", "Lactose", "Céleri"],
        nutritionalInfo: { calories: 450, protein: 25, carbs: 45, fat: 20 },
    },
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
