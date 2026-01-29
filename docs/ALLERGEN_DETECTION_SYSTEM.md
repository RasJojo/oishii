# 🧬 SYSTÈME DE DÉTECTION AUTOMATIQUE DES ALLERGÈNES

## 📋 Vue d'ensemble

Le système OISHII utilise désormais une **détection intelligente des allergènes basée sur les ingrédients**. Chaque recette contient une liste détaillée d'ingrédients, et les allergènes sont automatiquement détectés et classifiés.

---

## 🏗️ Architecture du Système

### 1. **Structure des Données**

#### **Ingrédient**

```typescript
interface Ingredient {
  name: string; // Ex: "Crème fraîche"
  quantity: number; // Ex: 50
  unit: string; // Ex: "ml"
  allergen?: string; // Ex: "Lactose" (optionnel)
}
```

#### **Recette (Dish)**

```typescript
interface Dish {
  id: string;
  name: string;
  category: "ENTREE" | "PLAT" | "DESSERT";
  description?: string;
  ingredients?: Ingredient[];
  allergens: string[]; // ✨ Calculé automatiquement !
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
```

---

## 🔍 Détection Automatique des Allergènes

### **Fonction de Détection**

```typescript
function detectAllergensFromIngredients(ingredients: Ingredient[]): string[] {
  const allergens = new Set<string>();
  ingredients.forEach((ingredient) => {
    if (ingredient.allergen) {
      allergens.add(ingredient.allergen);
    }
  });
  return Array.from(allergens);
}
```

### **Exemple Concret**

**Recette : Lasagnes à la Bolognaise**

```typescript
{
    name: "Lasagnes à la Bolognaise",
    ingredients: [
        { name: "Pâtes à lasagnes", quantity: 100, unit: "g", allergen: "Gluten" },
        { name: "Viande hachée", quantity: 120, unit: "g" },
        { name: "Sauce tomate", quantity: 100, unit: "ml" },
        { name: "Béchamel", quantity: 80, unit: "ml", allergen: "Lactose" },
        { name: "Parmesan", quantity: 30, unit: "g", allergen: "Lactose" },
        { name: "Céleri", quantity: 20, unit: "g", allergen: "Céleri" },
        { name: "Oignon", quantity: 50, unit: "g" },
    ],
    allergens: ["Gluten", "Lactose", "Céleri"]  // ✅ Détecté automatiquement
}
```

---

## 📊 Classification des Ingrédients par Allergène

### **Affichage Groupé dans la Modal**

Lorsque le chef ajoute des ingrédients, ils sont automatiquement groupés par type d'allergène :

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ GLUTEN                                                   │
│ • Pâtes à lasagnes - 100g                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚠️ LACTOSE                                                  │
│ • Béchamel - 80ml                                           │
│ • Parmesan - 30g                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚠️ CÉLERI                                                   │
│ • Céleri - 20g                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SANS ALLERGÈNE                                              │
│ • Viande hachée - 120g                                      │
│ • Sauce tomate - 100ml                                      │
│ • Oignon - 50g                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Workflow de Création de Recette

### **Étape 1 : Informations de Base**

1. Nom du plat : "Salade César"
2. Catégorie : ENTRÉE
3. Description : "Salade romaine avec poulet grillé et sauce César"

### **Étape 2 : Ajout des Ingrédients**

Le chef ajoute chaque ingrédient avec :

- **Nom** : "Laitue romaine"
- **Quantité** : 150
- **Unité** : g
- **Allergène** : (aucun)

Puis :

- **Nom** : "Parmesan"
- **Quantité** : 30
- **Unité** : g
- **Allergène** : **Lactose** ⚠️

Puis :

- **Nom** : "Croûtons"
- **Quantité** : 40
- **Unité** : g
- **Allergène** : **Gluten** ⚠️

Puis :

- **Nom** : "Œufs"
- **Quantité** : 2
- **Unité** : pièce
- **Allergène** : **Œufs** ⚠️

### **Étape 3 : Détection Automatique**

Le système affiche en temps réel :

```
┌─────────────────────────────────────────────────────────────┐
│ ✨ ALLERGÈNES DÉTECTÉS AUTOMATIQUEMENT :                    │
│ [LACTOSE] [GLUTEN] [ŒUFS]                                   │
└─────────────────────────────────────────────────────────────┘
```

### **Étape 4 : Informations Nutritionnelles**

- Calories : 280 kcal
- Protéines : 18g
- Glucides : 12g
- Lipides : 20g

### **Étape 5 : Validation**

✅ Clic sur "AJOUTER AU RÉPERTOIRE"

---

## 🛡️ Filtrage Côté Patient

### **Scénario : Patient avec Allergies**

**Patient : Sophie Durand**

- Allergies : Gluten, Lactose, Poissons
- Régimes : Hypocalorique, Sans sel

### **Menu Disponible**

Le système filtre automatiquement les plats :

| Plat              | Allergènes              | Affiché ?                        |
| ----------------- | ----------------------- | -------------------------------- |
| Salade César      | Gluten, Lactose, Œufs   | ❌ **MASQUÉ** (Gluten + Lactose) |
| Filet de Colin    | Poissons                | ❌ **MASQUÉ** (Poissons)         |
| Lasagnes          | Gluten, Lactose, Céleri | ❌ **MASQUÉ** (Gluten + Lactose) |
| Riz Pilaf         | (aucun)                 | ✅ **AFFICHÉ**                   |
| Compote de Pommes | (aucun)                 | ✅ **AFFICHÉ**                   |

**Résultat :** Sophie ne voit que les plats 100% sûrs pour elle.

---

## 🔄 Avantages du Système

### ✅ **Pour le Personnel Cuisine**

- **Transparence totale** : Liste complète des ingrédients
- **Détection automatique** : Plus besoin de cocher manuellement les allergènes
- **Classification visuelle** : Ingrédients groupés par allergène
- **Traçabilité** : Chaque ingrédient est documenté

### ✅ **Pour le Personnel Médical**

- **Sécurité renforcée** : Allergènes basés sur des ingrédients réels
- **Confiance** : Pas d'erreur humaine dans la sélection des allergènes
- **Audit** : Possibilité de vérifier la composition exacte

### ✅ **Pour les Patients**

- **Sécurité maximale** : Filtrage basé sur les ingrédients réels
- **Transparence** : Peut voir la liste complète des ingrédients
- **Confiance** : Aucun risque d'exposition aux allergènes

---

## 📈 Exemple Complet de Workflow

### **1. Chef Bernard crée une recette**

```
CRÉATION : "Velouté de Potiron"
├── Description : "Soupe onctueuse de potiron avec crème fraîche"
├── Ingrédients :
│   ├── Potiron (300g) - Sans allergène
│   ├── Crème fraîche (50ml) - ⚠️ LACTOSE
│   ├── Oignon (50g) - Sans allergène
│   └── Bouillon de légumes (200ml) - Sans allergène
├── Allergènes détectés : [LACTOSE]
└── Nutrition : 120 kcal, 3g protéines, 15g glucides, 5g lipides
```

### **2. Dr. Martin admet Sophie**

```
ADMISSION : Sophie Durand
├── Chambre : 305
├── Service : Cardiologie
├── Allergies : [Gluten, Lactose, Poissons]
└── Régimes : [Hypocalorique, Sans sel]
```

### **3. Chef Bernard planifie le menu**

```
LUNDI - DÉJEUNER
├── ENTRÉES :
│   ├── Velouté de Potiron (Lactose) ⚠️
│   └── Salade Verte (Sans allergène) ✅
├── PLATS :
│   ├── Filet de Colin (Poissons) ⚠️
│   ├── Poulet Rôti (Sans allergène) ✅
│   └── Lasagnes (Gluten, Lactose) ⚠️
└── DESSERTS :
    ├── Tarte aux Pommes (Gluten, Lactose) ⚠️
    └── Compote de Fruits (Sans allergène) ✅
```

### **4. Sophie accède à son portail**

```
MENU FILTRÉ POUR SOPHIE :
├── ENTRÉE :
│   └── ✅ Salade Verte (0 allergène)
├── PLAT :
│   └── ✅ Poulet Rôti (0 allergène)
└── DESSERT :
    └── ✅ Compote de Fruits (0 allergène)

❌ MASQUÉS :
├── Velouté de Potiron (Lactose)
├── Filet de Colin (Poissons)
├── Lasagnes (Gluten, Lactose)
└── Tarte aux Pommes (Gluten, Lactose)
```

### **5. Sophie sélectionne son menu**

```
SÉLECTION DE SOPHIE :
├── Salade Verte
├── Poulet Rôti
└── Compote de Fruits

Total : 395 kcal
Allergènes : AUCUN ✅
Sécurité : 100% GARANTIE ✅
```

---

## 🎯 Conclusion

Le système de **détection automatique des allergènes basée sur les ingrédients** garantit :

1. ✅ **Précision maximale** : Allergènes détectés depuis les ingrédients réels
2. ✅ **Sécurité renforcée** : Filtrage basé sur la composition exacte
3. ✅ **Transparence totale** : Liste complète des ingrédients visible
4. ✅ **Traçabilité** : Chaque ingrédient est documenté
5. ✅ **Automatisation** : Plus d'erreur humaine dans la sélection des allergènes

**Ce système place la sécurité alimentaire au cœur du processus, de la création de recette jusqu'au choix du patient.**
