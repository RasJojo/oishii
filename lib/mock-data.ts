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
    "Céleri",
];

export interface Dish {
    id: string;
    name: string;
    category: "ENTREE" | "PLAT" | "DESSERT";
    allergens: string[];
    nutritionalInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const MOCK_DISHES: Dish[] = [
    {
        id: "DISH-001",
        name: "Velouté de Potiron",
        category: "ENTREE",
        allergens: ["Lactose"],
        nutritionalInfo: { calories: 120, protein: 3, carbs: 15, fat: 5 },
    },
    {
        id: "DISH-002",
        name: "Filet de Colin à la vapeur",
        category: "PLAT",
        allergens: ["Poissons"],
        nutritionalInfo: { calories: 250, protein: 35, carbs: 2, fat: 12 },
    },
    {
        id: "DISH-003",
        name: "Riz Pilaf aux petits légumes",
        category: "PLAT",
        allergens: [],
        nutritionalInfo: { calories: 180, protein: 4, carbs: 40, fat: 3 },
    },
    {
        id: "DISH-004",
        name: "Compote de Pommes artisanale",
        category: "DESSERT",
        allergens: [],
        nutritionalInfo: { calories: 85, protein: 0.5, carbs: 21, fat: 0.1 },
    },
    {
        id: "DISH-005",
        name: "Lasagnes à la Bolognaise",
        category: "PLAT",
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
