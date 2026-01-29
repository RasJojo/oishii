
export interface IngredientRef {
    name: string;
    allergen?: string;
    defaultUnit: string;
}

export const INGREDIENTS_DB: IngredientRef[] = [
    // --- PRODUITS LAITIERS (Lactose) ---
    { name: "Beurre", allergen: "Lactose", defaultUnit: "g" },
    { name: "Beurre demi-sel", allergen: "Lactose", defaultUnit: "g" },
    { name: "Crème fraîche", allergen: "Lactose", defaultUnit: "ml" },
    { name: "Crème liquide", allergen: "Lactose", defaultUnit: "ml" },
    { name: "Lait entier", allergen: "Lactose", defaultUnit: "ml" },
    { name: "Lait demi-écrémé", allergen: "Lactose", defaultUnit: "ml" },
    { name: "Lait écrémé", allergen: "Lactose", defaultUnit: "ml" },
    { name: "Yaourt nature", allergen: "Lactose", defaultUnit: "pièce" },
    { name: "Fromage blanc", allergen: "Lactose", defaultUnit: "g" },
    { name: "Mozzarella", allergen: "Lactose", defaultUnit: "g" },
    { name: "Emmental", allergen: "Lactose", defaultUnit: "g" },
    { name: "Parmesan", allergen: "Lactose", defaultUnit: "g" },
    { name: "Comté", allergen: "Lactose", defaultUnit: "g" },
    { name: "Chèvre frais", allergen: "Lactose", defaultUnit: "g" },
    { name: "Roquefort", allergen: "Lactose", defaultUnit: "g" },
    { name: "Béchamel", allergen: "Lactose", defaultUnit: "ml" },

    // --- CÉRÉALES & FÉCULENTS (Souvent Gluten) ---
    { name: "Farine de blé", allergen: "Gluten", defaultUnit: "g" },
    { name: "Pain", allergen: "Gluten", defaultUnit: "g" },
    { name: "Pain de mie", allergen: "Gluten", defaultUnit: "tranche" },
    { name: "Pâtes (type standard)", allergen: "Gluten", defaultUnit: "g" },
    { name: "Spaghetti", allergen: "Gluten", defaultUnit: "g" },
    { name: "Coquillettes", allergen: "Gluten", defaultUnit: "g" },
    { name: "Pâtes à lasagnes", allergen: "Gluten", defaultUnit: "g" },
    { name: "Semoule de blé", allergen: "Gluten", defaultUnit: "g" },
    { name: "Boulgour", allergen: "Gluten", defaultUnit: "g" },
    { name: "Pâte feuilletée", allergen: "Gluten", defaultUnit: "g" },
    { name: "Pâte brisée", allergen: "Gluten", defaultUnit: "g" },
    { name: "Chapelure", allergen: "Gluten", defaultUnit: "g" },
    { name: "Croûtons", allergen: "Gluten", defaultUnit: "g" },
    { name: "Biscuits", allergen: "Gluten", defaultUnit: "pièce" },
    
    // --- SANS GLUTEN NATURELLEMENT ---
    { name: "Riz blanc", defaultUnit: "g" },
    { name: "Riz basmati", defaultUnit: "g" },
    { name: "Riz complet", defaultUnit: "g" },
    { name: "Pommes de terre", defaultUnit: "g" },
    { name: "Patate douce", defaultUnit: "g" },
    { name: "Quinoa", defaultUnit: "g" },
    { name: "Sarrasin", defaultUnit: "g" },
    { name: "Maïs", defaultUnit: "g" },
    { name: "Polenta", defaultUnit: "g" },
    { name: "Lentilles", defaultUnit: "g" },
    { name: "Pois chiches", defaultUnit: "g" },
    { name: "Haricots rouges", defaultUnit: "g" },

    // --- OEUFS ---
    { name: "Oeuf entier", allergen: "Œufs", defaultUnit: "pièce" },
    { name: "Jaune d'oeuf", allergen: "Œufs", defaultUnit: "pièce" },
    { name: "Blanc d'oeuf", allergen: "Œufs", defaultUnit: "pièce" },
    { name: "Mayonnaise", allergen: "Œufs", defaultUnit: "g" },

    // --- POISSONS & CRUSTACÉS ---
    { name: "Saumon", allergen: "Poissons", defaultUnit: "g" },
    { name: "Cabillaud", allergen: "Poissons", defaultUnit: "g" },
    { name: "Colin", allergen: "Poissons", defaultUnit: "g" },
    { name: "Thon (conserve)", allergen: "Poissons", defaultUnit: "g" },
    { name: "Merlu", allergen: "Poissons", defaultUnit: "g" },
    { name: "Sole", allergen: "Poissons", defaultUnit: "g" },
    { name: "Crevettes", allergen: "Crustacés", defaultUnit: "g" },
    { name: "Gambas", allergen: "Crustacés", defaultUnit: "g" },
    { name: "Crabe", allergen: "Crustacés", defaultUnit: "g" },
    { name: "Moules", allergen: "Mollusques", defaultUnit: "g" }, // Mollusques souvent groupés ou séparés

    // --- VIANDES (Sans allergènes majeurs bruts) ---
    { name: "Poulet", defaultUnit: "g" },
    { name: "Dinde", defaultUnit: "g" },
    { name: "Boeuf haché", defaultUnit: "g" },
    { name: "Steak haché", defaultUnit: "pièce" },
    { name: "Rôti de boeuf", defaultUnit: "g" },
    { name: "Veau", defaultUnit: "g" },
    { name: "Porc", defaultUnit: "g" },
    { name: "Jambon blanc", defaultUnit: "tranche" },
    { name: "Lardons", defaultUnit: "g" },

    // --- LÉGUMES ---
    { name: "Carottes", defaultUnit: "g" },
    { name: "Oignon", defaultUnit: "g" },
    { name: "Ail", defaultUnit: "gousse" },
    { name: "Courgettes", defaultUnit: "g" },
    { name: "Aubergines", defaultUnit: "g" },
    { name: "Tomates", defaultUnit: "g" },
    { name: "Poivrons", defaultUnit: "g" },
    { name: "Poireaux", defaultUnit: "g" },
    { name: "Épinards", defaultUnit: "g" },
    { name: "Chou-fleur", defaultUnit: "g" },
    { name: "Brocoli", defaultUnit: "g" },
    { name: "Haricots verts", defaultUnit: "g" },
    { name: "Petits pois", defaultUnit: "g" },
    { name: "Champignons", defaultUnit: "g" },
    { name: "Salade verte", defaultUnit: "g" },
    { name: "Concombre", defaultUnit: "g" },
    { name: "Radis", defaultUnit: "g" },
    { name: "Potiron", defaultUnit: "g" },
    { name: "Céleri branche", allergen: "Céleri", defaultUnit: "g" },
    { name: "Céleri rave", allergen: "Céleri", defaultUnit: "g" },

    // --- FRUITS ---
    { name: "Pomme", defaultUnit: "pièce" },
    { name: "Poire", defaultUnit: "pièce" },
    { name: "Banane", defaultUnit: "pièce" },
    { name: "Orange", defaultUnit: "pièce" },
    { name: "Citron", defaultUnit: "pièce" },
    { name: "Fraise", defaultUnit: "g" },
    { name: "Framboise", defaultUnit: "g" },
    { name: "Abricot", defaultUnit: "g" },
    { name: "Pêche", defaultUnit: "pièce" },
    { name: "Kiwi", defaultUnit: "pièce" },
    
    // --- FRUITS A COQUE ---
    { name: "Amandes", allergen: "Fruits à coque", defaultUnit: "g" },
    { name: "Noix", allergen: "Fruits à coque", defaultUnit: "g" },
    { name: "Noisettes", allergen: "Fruits à coque", defaultUnit: "g" },
    { name: "Pistaches", allergen: "Fruits à coque", defaultUnit: "g" },
    { name: "Poudre d'amande", allergen: "Fruits à coque", defaultUnit: "g" },

    // --- ARACHIDES ---
    { name: "Cacahuètes", allergen: "Arachides", defaultUnit: "g" },
    { name: "Beurre de cacahuète", allergen: "Arachides", defaultUnit: "g" },
    { name: "Huile d'arachide", allergen: "Arachides", defaultUnit: "ml" },

    // --- SOJA ---
    { name: "Soja", allergen: "Soja", defaultUnit: "g" },
    { name: "Tofu", allergen: "Soja", defaultUnit: "g" },
    { name: "Sauce soja", allergen: "Soja", defaultUnit: "ml" },
    { name: "Lait de soja", allergen: "Soja", defaultUnit: "ml" },
    { name: "Crème de soja", allergen: "Soja", defaultUnit: "ml" },

    // --- DIVERS ---
    { name: "Moutarde", allergen: "Moutarde", defaultUnit: "g" },
    { name: "Graines de sésame", allergen: "Sésame", defaultUnit: "g" },
    { name: "Huile de sésame", allergen: "Sésame", defaultUnit: "ml" },
    { name: "Huile d'olive", defaultUnit: "ml" },
    { name: "Huile de colza", defaultUnit: "ml" },
    // --- SULFITES (Nouveau) ---
    { name: "Vin rouge", allergen: "Sulfites", defaultUnit: "ml" },
    { name: "Vin blanc", allergen: "Sulfites", defaultUnit: "ml" },
    { name: "Vinaigre balsamique", allergen: "Sulfites", defaultUnit: "ml" },
    { name: "Raisins secs", allergen: "Sulfites", defaultUnit: "g" },
    { name: "Abricots secs", allergen: "Sulfites", defaultUnit: "g" },
    { name: "Pruneaux", allergen: "Sulfites", defaultUnit: "g" },

    // --- LUPIN (Nouveau) ---
    { name: "Farine de lupin", allergen: "Lupin", defaultUnit: "g" },
    { name: "Graines de lupin", allergen: "Lupin", defaultUnit: "g" },
];
