"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Search,
  CheckCircle2,
  Download,
  CookingPot,
  Plus,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  X,
  CalendarIcon,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Utensils,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dish, ALLERGENS_LIST } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Types pour le planning
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  room: string;
  service: string;
  allergies: string[];
  dietary_restrictions: string[];
  status: string;
}

interface MenuPlanningItem {
  id: string;
  week_date: string;
  day_of_week: number;
  meal_type: string;
  dish_id: string;
  dishes: Dish;
}

// Helper pour obtenir le lundi de la semaine courante
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Mapper meal_type DB -> nom FR
const mealTypeMap: Record<string, string> = {
  breakfast: "Petit Déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

const mealTypeReverseMap: Record<string, string> = {
  "Petit Déjeuner": "breakfast",
  "Déjeuner": "lunch",
  "Dîner": "dinner",
};

const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function KitchenDashboard() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  
  // Current week state
  // Current week state
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(new Date(0)); // Start with epoch to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentWeekMonday(getMonday(new Date()));
  }, []);

  // if (!isClient) return null; // MOVED TO END TO FIX HOOKS RULES

  // State for the weekly planning (loaded from DB)
  const [planning, setPlanning] = useState<Record<string, Dish[]>>({});
  const [chefName, setChefName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        
        if (profile && profile.role != "KITCHEN") {
          router.push("/staff/login");
        }

        if (profile && profile.full_name) {
          setChefName(profile.full_name);
        } else {
          setChefName("CHEF DE CUISINE");
        }
      } else {
        router.push("/staff/login");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("dishes").select(`
                    id, name, category, description, nutritional_info, available, is_breakfast, allergens
                  `).order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching dishes:", error);
        } else if (data) {
          const mappedDishes: (Dish & { description?: string; available?: boolean })[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.category,
            description: d.description || "",
            allergens: d.allergens || [],
            nutritionalInfo: d.nutritional_info || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
            },
            isBreakfast: d.is_breakfast || false,
            available: d.available ?? true,
          }));
          if (mappedDishes.length > 0) {
            setDishes(mappedDishes as Dish[]);
          }
        }
      } catch (e) {
        console.error("Supabase client error", e);
        // setDishes([]); // Keep empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Fetch patients from DB
  useEffect(() => {
    const fetchPatients = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, room, service, allergies, dietary_restrictions, status");
      
      if (error) {
        console.error("Error fetching patients:", error);
      } else if (data) {
        setPatients(data);
      }
    };
    fetchPatients();
  }, []);

  // Fetch planning from DB
  useEffect(() => {
    const fetchPlanning = async () => {
      const supabase = createClient();
      // Attention au timezone ! toISOString() convertit en UTC.
      // Si currentWeekMonday est à 00:00 locale, toISOString peut donner le jour d'avant.
      // On veut juste la date locale YYYY-MM-DD.
      const offset = currentWeekMonday.getTimezoneOffset();
      const localDate = new Date(currentWeekMonday.getTime() - (offset*60*1000));
      const weekDateStr = localDate.toISOString().split('T')[0];
      
      console.log("Fetching planning for:", weekDateStr, " (Base date:", currentWeekMonday, ")");

      const { data, error } = await supabase
        .from("menu_planning")
        .select(`
          id, week_date, day_of_week, meal_type, dish_id,
          dishes ( 
            id, name, category, nutritional_info, allergens
          )
        `)
        .eq("week_date", weekDateStr);

      console.log("Planning Fetch Result:", { dataLength: data?.length, error });

      if (error) {
        console.error("Error fetching planning:", error);
        return;
      }

      // Transform DB data to planning structure
      const newPlanning: Record<string, Dish[]> = {};
      
      if (data) {
        data.forEach((item: any) => {
          // Conversion index jour DB (0=Dim, 1=Lun...) vers index tableau (0=Lun...)
          // Si day_of_week est standard JS (0=Dim), alors :
          // Dim(0) -> 6 ("Dimanche")
          // Lun(1) -> 0 ("Lundi")
          // Ven(5) -> 4 ("Vendredi")
          const dayIndex = (item.day_of_week + 6) % 7;
          const dayName = dayNames[dayIndex];
          const mealName = mealTypeMap[item.meal_type];
          const key = `${dayName}-${mealName}`;
          
          if (!item.dishes) {
             console.warn("Item without dishes relation:", item);
             return;
          }

          if (!newPlanning[key]) {
            newPlanning[key] = [];
          }
          
          if (item.dishes) {
            newPlanning[key].push({
              id: item.dishes.id,
              name: item.dishes.name,
              category: item.dishes.category,
              allergens: item.dishes.allergens || [],
              nutritionalInfo: item.dishes.nutritional_info || { calories: 0, protein: 0, carbs: 0, fat: 0 },
            });
          }
        });
      }
      
      setPlanning(newPlanning);
    };
    
    fetchPlanning();
  }, [currentWeekMonday]);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{
    day: string;
    meal: string;
  } | null>(null);

  // New dish form state
  const [newDish, setNewDish] = useState<Partial<Dish> & { description?: string; isBreakfast?: boolean }>({
    name: "",
    category: "PLAT",
    allergens: [],
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    description: "",
    isBreakfast: false,
  });

  // Edit dish state
  const [isEditDishOpen, setIsEditDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<(Dish & { description?: string; available?: boolean }) | null>(null);

  // View dish details state
  const [viewingDish, setViewingDish] = useState<(Dish & { description?: string; available?: boolean }) | null>(null);
  const [isViewDishOpen, setIsViewDishOpen] = useState(false);

  // Search/filter for recipes
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState<string>("ALL");

  // Calculate stats dynamically from patients
  const totalMeals = patients.length || 1;
  const preparedMeals = patients.filter(
    (p) => p.status === "ADMITTED",
  ).length;
  const progress = (preparedMeals / totalMeals) * 100;

  // Stats for current meal session
  const stats = useMemo(() => {
    // Get dishes from current planning
    const allPlanningDishes = Object.values(planning).flat();
    const patientCount = patients.length || 1;
    
    return {
      entrees: allPlanningDishes.filter(d => d.category === 'ENTREE').length * patientCount,
      plats: allPlanningDishes.filter(d => d.category === 'PLAT').length * patientCount,
      desserts: allPlanningDishes.filter(d => d.category === 'DESSERT').length * patientCount,
      regimes: patients.filter(p => p.dietary_restrictions && p.dietary_restrictions.length > 0).length,
    };
  }, [planning, patients]);

  // Production list: aggregate dishes from the current week's planning
  const productionList = useMemo(() => {
    const dishCounts = new Map<string, { dish: Dish; count: number; meals: string[] }>();
    const patientCount = patients.filter(p => p.status === 'ADMITTED').length || 1;
    
    Object.entries(planning).forEach(([key, dishes]) => {
      dishes.forEach(dish => {
        const existing = dishCounts.get(dish.id);
        if (existing) {
          existing.count += patientCount;
          if (!existing.meals.includes(key)) {
            existing.meals.push(key);
          }
        } else {
          dishCounts.set(dish.id, { 
            dish, 
            count: patientCount,
            meals: [key]
          });
        }
      });
    });
    
    return Array.from(dishCounts.values()).sort((a, b) => {
      // Sort by category order: ENTREE, PLAT, DESSERT
      const catOrder = { 'ENTREE': 0, 'PLAT': 1, 'DESSERT': 2 };
      return (catOrder[a.dish.category as keyof typeof catOrder] || 0) - 
             (catOrder[b.dish.category as keyof typeof catOrder] || 0);
    });
  }, [planning, patients]);


  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    // Si c'est un petit déjeuner, on force la catégorie à PLAT (ou autre par défaut) car le champ est masqué
    const activeCategory = newDish.isBreakfast ? "PLAT" : newDish.category;

    const dishData = {
      name: newDish.name,
      category: activeCategory,
      nutritional_info: newDish.nutritionalInfo,
      description: newDish.description || null,
      is_breakfast: newDish.isBreakfast || false,
      available: true,
    };

    const { data, error } = await supabase
      .from("dishes")
      .insert(dishData)
      .select()
      .single();

    if (error) {
      console.error("Error adding dish:", error);
      alert("Erreur lors de la création du plat.");
      return;
    }

    // Insert allergens into dishes_allergens junction table
    // Insert allergens into dishes_allergens junction table
    if (data && newDish.allergens && newDish.allergens.length > 0) {
      // 1. Get allergen IDs from names
      const { data: allergenData, error: allergenError } = await supabase
        .from("allergens")
        .select("id, name")
        .in("name", newDish.allergens);

      if (allergenError) {
        console.error("Error fetching allergens IDs:", allergenError);
      } else if (allergenData && allergenData.length > 0) {
        // 2. Create links
        const allergenLinks = allergenData.map((a: any) => ({
          dish_id: data.id,
          allergen_id: a.id,
        }));
        
        // 3. Insert links
        const { error: linkError } = await supabase
          .from("dishes_allergens")
          .insert(allergenLinks);

        if (linkError) {
           console.error("Error linking allergens:", linkError);
        }
      }
    }

    if (data) {
      const mappedDish: Dish = {
        id: data.id,
        name: data.name,
        category: data.category,
        allergens: newDish.allergens || [], // Use form data since we just inserted them
        nutritionalInfo: data.nutritional_info || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        description: data.description,
        isBreakfast: data.is_breakfast,
        available: data.available,
      };
      setDishes([mappedDish, ...dishes]);
    }

    setNewDish({
      name: "",
      category: "PLAT",
      allergens: [],
      nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      description: "",
      isBreakfast: false,
    });
    setIsAddDishOpen(false);
  };

  // Edit an existing dish
  const handleEditDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    
    const supabase = createClient();
    
    // Si c'est un petit déjeuner, on garde la catégorie actuelle ou on force "PLAT" si nécessaire
    const activeCategory = editingDish.isBreakfast ? "PLAT" : editingDish.category;

    const dishData = {
      name: editingDish.name,
      category: activeCategory,
      description: editingDish.description || null,
      nutritional_info: editingDish.nutritionalInfo,
      is_breakfast: editingDish.isBreakfast || false,
      available: editingDish.available ?? true,
    };

    const { error } = await supabase
      .from("dishes")
      .update(dishData)
      .eq("id", editingDish.id);

    if (error) {
      console.error("Error updating dish:", error);
      alert("Erreur lors de la mise à jour du plat.");
      return;
    }

    // Update allergens: delete old, insert new
    await supabase
      .from("dishes_allergens")
      .delete()
      .eq("dish_id", editingDish.id);

    if (editingDish.allergens && editingDish.allergens.length > 0) {
      // 1. Get allergen IDs from names
      const { data: allergenData, error: allergenError } = await supabase
        .from("allergens")
        .select("id, name")
        .in("name", editingDish.allergens);

      if (allergenError) {
        console.error("Error fetching allergens IDs for update:", allergenError);
      } else if (allergenData && allergenData.length > 0) {
        // 2. Create links
        const allergenLinks = allergenData.map((a: any) => ({
          dish_id: editingDish.id,
          allergen_id: a.id,
        }));
        
        // 3. Insert links
        const { error: linkError } = await supabase
          .from("dishes_allergens")
          .insert(allergenLinks);
          
        if (linkError) {
           console.error("Error updating allergen links:", linkError);
        }
      }
    }

    // Update local state
    setDishes(dishes.map(d => 
      d.id === editingDish.id 
        ? { ...editingDish } as Dish
        : d
    ));

    setEditingDish(null);
    setIsEditDishOpen(false);
  };

  // Delete a dish
  const handleDeleteDish = async (dishId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible.")) {
      return;
    }

    const supabase = createClient();

    // First, remove from any menu planning
    await supabase
      .from("menu_planning")
      .delete()
      .eq("dish_id", dishId);

    // Remove allergen links
    await supabase
      .from("dishes_allergens")
      .delete()
      .eq("dish_id", dishId);

    // Delete the dish
    const { error } = await supabase
      .from("dishes")
      .delete()
      .eq("id", dishId);

    if (error) {
      console.error("Error deleting dish:", error);
      alert("Erreur lors de la suppression du plat.");
      return;
    }

    // Update local state
    setDishes(dishes.filter(d => d.id !== dishId));
  };

  // Toggle dish availability
  const handleToggleAvailability = async (dish: Dish & { available?: boolean }) => {
    const supabase = createClient();
    const newAvailable = !(dish.available ?? true);

    const { error } = await supabase
      .from("dishes")
      .update({ available: newAvailable })
      .eq("id", dish.id);

    if (error) {
      console.error("Error toggling availability:", error);
      return;
    }

    // Update local state
    setDishes(dishes.map(d => 
      d.id === dish.id 
        ? { ...d, available: newAvailable } as Dish
        : d
    ));
  };

  // Filtered dishes for recipe search
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()) ||
                           (dish as any).description?.toLowerCase().includes(recipeSearchTerm.toLowerCase());
      const matchesCategory = recipeCategoryFilter === "ALL" || dish.category === recipeCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [dishes, recipeSearchTerm, recipeCategoryFilter]);

  const handleAssignDish = async (dish: Dish) => {
    if (!assignTarget) return;
    const key = `${assignTarget.day}-${assignTarget.meal}`;
    const current = planning[key] || [];
    
    const supabase = createClient();
    const weekDateStr = currentWeekMonday.toISOString().split('T')[0];
    const dayIndex = dayNames.indexOf(assignTarget.day);
    const mealType = mealTypeReverseMap[assignTarget.meal];

    if (current.find((d) => d.id === dish.id)) {
      // Remove from planning
      const { error } = await supabase
        .from("menu_planning")
        .delete()
        .eq("week_date", weekDateStr)
        .eq("day_of_week", dayIndex)
        .eq("meal_type", mealType)
        .eq("dish_id", dish.id);
      
      if (error) {
        console.error("Error removing dish from planning:", error);
        return;
      }
      
      setPlanning({
        ...planning,
        [key]: current.filter((d) => d.id !== dish.id),
      });
    } else {
      // Add to planning
      const { error } = await supabase
        .from("menu_planning")
        .insert({
          week_date: weekDateStr,
          day_of_week: dayIndex,
          meal_type: mealType,
          dish_id: dish.id,
        });
      
      if (error) {
        console.error("Error adding dish to planning:", error);
        return;
      }
      
      setPlanning({ ...planning, [key]: [...current, dish] });
    }
  };

  // Week navigation helpers
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekMonday);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekMonday(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekMonday);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekMonday(newDate);
  };

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const meals = [
    { name: "Petit Déjeuner", icon: <Coffee size={14} /> },
    { name: "Déjeuner", icon: <Sun size={14} /> },
    { name: "Dîner", icon: <Moon size={14} /> },
  ];

  if (!isClient) {
    return null; // Prevent hydration mismatch by confirming client-side render first
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-card h-16 flex items-center shadow-sm px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-orange-600/20 bg-orange-600/5 text-orange-600">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase">
                Espace Cuisine
              </h1>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                Production Alimentaire
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black">
                {chefName || "Chef de Cuisine"}
              </p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-right">
                Cuisine Centrale
              </p>
            </div>
            <div className="h-8 w-8 border border-orange-600/20 bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-xs uppercase">
              {chefName ? chefName.substring(0, 2).toUpperCase() : "CC"}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Visual Overview - Simplified */}
        <Card className="border border-border bg-card shadow-sm rounded-none">
          <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-4 bg-muted/20">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                État de la Production
              </CardTitle>
              <p className="text-[9px] font-bold uppercase text-muted-foreground">
                Progression des plateaux déjeuner
              </p>
            </div>
            <Badge className="bg-orange-600 text-white border-none rounded-none px-3 font-black text-[9px] uppercase tracking-widest h-6">
              Session: MIDI
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <CookingPot size={14} className="text-orange-600" />{" "}
                    Plateaux Termines
                  </span>
                  <span>
                    {preparedMeals} / {totalMeals} ({Math.round(progress)}%)
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-4 bg-muted border border-border rounded-none shadow-none [&>div]:bg-orange-600 [&>div]:border-r [&>div]:border-orange-600"
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "Entrées", val: stats.entrees, col: "muted-foreground" },
                  { label: "Plats Chauds", val: stats.plats, col: "orange-600" },
                  { label: "Desserts", val: stats.desserts, col: "muted-foreground" },
                  { label: "Régimes", val: stats.regimes, col: "blue-500" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-black italic",
                        `text-${item.col}`,
                      )}
                    >
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Area */}
        <Tabs defaultValue="planning" className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <TabsList className="bg-muted border border-border p-1 rounded-none h-10 w-full sm:w-auto">
              <TabsTrigger
                value="planning"
                className="text-[10px] font-black uppercase tracking-widest px-6 h-8 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                Calendrier
              </TabsTrigger>
              <TabsTrigger
                value="production"
                className="text-[10px] font-black uppercase tracking-widest px-6 h-8 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                Liste Production
              </TabsTrigger>
              <TabsTrigger
                value="recipes"
                className="text-[10px] font-black uppercase tracking-widest px-6 h-8 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                Fiches Recettes
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 w-full sm:w-auto border border-orange-600 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-sm rounded-none focus-visible:ring-2 focus-visible:ring-orange-600">
                    <Plus size={16} /> Nouveau Plat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-2 border-border p-8 rounded-none max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">
                      Création Recette
                    </DialogTitle>
                    <DialogDescription className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                      Enregistrez un nouveau plat dans la base.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDish} className="space-y-6">
                    {/* Type Selector Tabs */}
                    <div className="w-full">
                      <Tabs
                        defaultValue="meal"
                        value={newDish.isBreakfast ? "breakfast" : "meal"}
                        onValueChange={(v) =>
                          setNewDish({ ...newDish, isBreakfast: v === "breakfast" })
                        }
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/20 p-1 border border-border">
                          <TabsTrigger
                            value="meal"
                            className="rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                          >
                            Repas (Déj/Dîner)
                          </TabsTrigger>
                          <TabsTrigger
                            value="breakfast"
                            className="rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                          >
                            Petit Déjeuner
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="dishName"
                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                      >
                        Nom du Plat
                      </Label>
                      <Input
                        id="dishName"
                        value={newDish.name}
                        onChange={(e) =>
                          setNewDish({ ...newDish, name: e.target.value })
                        }
                        required
                        className="h-10 font-bold bg-muted/20 border-border rounded-none focus-visible:ring-1 focus-visible:ring-orange-600"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Description
                      </Label>
                      <textarea
                        value={newDish.description || ""}
                        onChange={(e) =>
                          setNewDish({ ...newDish, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 font-medium text-sm bg-muted/20 border border-border rounded-none resize-none focus:outline-none focus:ring-1 focus:ring-orange-600"
                        placeholder="Description du plat..."
                      />
                    </div>

                    {!newDish.isBreakfast && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Catégorie
                          </Label>
                          <Select
                            value={newDish.category}
                            onValueChange={(v: any) =>
                              setNewDish({ ...newDish, category: v })
                            }
                          >
                            <SelectTrigger className="h-10 font-bold bg-muted/20 border-border rounded-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-border">
                              <SelectItem
                                value="ENTREE"
                                className="font-bold text-[10px]"
                              >
                                ENTREE
                              </SelectItem>
                              <SelectItem
                                value="PLAT"
                                className="font-bold text-[10px]"
                              >
                                PLAT
                              </SelectItem>
                              <SelectItem
                                value="DESSERT"
                                className="font-bold text-[10px]"
                              >
                                DESSERT
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Allergens Multi-Select */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Allergènes
                      </Label>
                      <div className="grid grid-cols-2 gap-2 p-4 bg-muted/20 border border-border rounded-none">
                        {ALLERGENS_LIST.map((allergen) => (
                          <label
                            key={allergen}
                            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
                          >
                            <input
                              type="checkbox"
                              checked={newDish.allergens?.includes(allergen)}
                              onChange={(e) => {
                                const current = newDish.allergens || [];
                                if (e.target.checked) {
                                  setNewDish({
                                    ...newDish,
                                    allergens: [...current, allergen],
                                  });
                                } else {
                                  setNewDish({
                                    ...newDish,
                                    allergens: current.filter(
                                      (a) => a !== allergen,
                                    ),
                                  });
                                }
                              }}
                              className="w-4 h-4 accent-orange-600"
                            />
                            <span className="text-xs font-bold">
                              {allergen}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nutritional Info */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Informations Nutritionnelles
                      </Label>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label
                            htmlFor="calories"
                            className="text-[9px] font-bold uppercase text-muted-foreground"
                          >
                            Calories
                          </Label>
                          <Input
                            id="calories"
                            type="number"
                            value={newDish.nutritionalInfo?.calories || 0}
                            onChange={(e) =>
                              setNewDish({
                                ...newDish,
                                nutritionalInfo: {
                                  ...newDish.nutritionalInfo!,
                                  calories: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="protein"
                            className="text-[9px] font-bold uppercase text-muted-foreground"
                          >
                            Protéines (g)
                          </Label>
                          <Input
                            id="protein"
                            type="number"
                            value={newDish.nutritionalInfo?.protein || 0}
                            onChange={(e) =>
                              setNewDish({
                                ...newDish,
                                nutritionalInfo: {
                                  ...newDish.nutritionalInfo!,
                                  protein: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="carbs"
                            className="text-[9px] font-bold uppercase text-muted-foreground"
                          >
                            Glucides (g)
                          </Label>
                          <Input
                            id="carbs"
                            type="number"
                            value={newDish.nutritionalInfo?.carbs || 0}
                            onChange={(e) =>
                              setNewDish({
                                ...newDish,
                                nutritionalInfo: {
                                  ...newDish.nutritionalInfo!,
                                  carbs: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="fat"
                            className="text-[9px] font-bold uppercase text-muted-foreground"
                          >
                            Lipides (g)
                          </Label>
                          <Input
                            id="fat"
                            type="number"
                            value={newDish.nutritionalInfo?.fat || 0}
                            onChange={(e) =>
                              setNewDish({
                                ...newDish,
                                nutritionalInfo: {
                                  ...newDish.nutritionalInfo!,
                                  fat: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-orange-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-none hover:bg-orange-600"
                    >
                      Ajouter au Répertoire
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="h-10 w-full sm:w-auto px-6 border-border text-[10px] font-black uppercase tracking-widest rounded-none gap-2 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                <Download size={16} /> Export JSON
              </Button>
            </div>
          </div>

          {/* PLANNING GRID - CLEAN & ACCESSIBLE */}
          <TabsContent value="planning" className="mt-0">
            <Card className="border border-border bg-card shadow-sm rounded-none overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.1em]">
                    PLANNING SEMAINE {String(getWeekNumber(currentWeekMonday)).padStart(2, '0')}
                  </h2>
                  <div className="flex gap-1 border border-border p-1 bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary"
                      onClick={goToPreviousWeek}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary"
                      onClick={goToNextWeek}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
                <Button className="h-9 px-6 bg-orange-600 font-black text-[10px] uppercase tracking-widest rounded-none shadow-sm gap-2">
                  <CalendarIcon size={14} /> Publier Menu Patient
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table className="border-collapse table-fixed min-w-[1200px]">
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="w-40 border-r border-border bg-muted/30 font-black uppercase text-[9px] tracking-[0.1em] text-center">
                        Service
                      </TableHead>
                      {days.map((day, idx) => {
                        const dayDate = new Date(currentWeekMonday);
                        dayDate.setDate(currentWeekMonday.getDate() + idx);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = dayDate < today;
                        const isToday = dayDate.toDateString() === today.toDateString();
                        
                        return (
                          <TableHead
                            key={day}
                            className={cn(
                              "border-r border-border py-4 text-center pb-6",
                              isToday && "bg-orange-600/5 ring-1 ring-inset ring-orange-600/20",
                              isPast && "opacity-50"
                            )}
                          >
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                              {day}
                            </span>
                            <span className="text-xl font-black tabular-nums">
                              {dayDate.getDate()}
                            </span>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meals.map((meal) => (
                      <TableRow
                        key={meal.name}
                        className="border-b border-border hover:bg-transparent last:border-0"
                      >
                        <TableCell className="border-r border-border bg-muted/20 font-black uppercase text-[9px] text-center p-0">
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <div className="p-2 border border-border bg-background text-muted-foreground shadow-sm">
                              {meal.icon}
                            </div>
                            <span className="tracking-widest">{meal.name}</span>
                          </div>
                        </TableCell>
                        {days.map((day) => {
                          const key = `${day}-${meal.name}`;
                          const items = planning[key] || [];
                          return (
                            <TableCell
                              key={key}
                              className="p-2 border-r border-border align-top"
                            >
                              <div className="flex flex-col gap-3 p-1 flex-1 h-[220px]">
                                <div className="h-[220px] space-y-2 overflow-y-auto pr-1">
                                  {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                      <div className="h-8 w-8 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-600">
                                        <Plus size={16} strokeWidth={3} />
                                      </div>
                                    </div>
                                  ) : (
                                    items.map((dish) => (
                                      <div
                                        key={dish.id}
                                        className="p-1.5 px-2 border border-orange-600/20 bg-orange-600/5 text-[9px] font-black uppercase tracking-tight flex justify-between items-center gap-2 group/item"
                                      >
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "text-[7px] font-black rounded-none px-1 py-0 border-none shrink-0",
                                              dish.category === 'ENTREE' && "bg-green-600/20 text-green-700",
                                              dish.category === 'PLAT' && "bg-orange-600/20 text-orange-700",
                                              dish.category === 'DESSERT' && "bg-purple-600/20 text-purple-700"
                                            )}
                                          >
                                            {dish.category === 'ENTREE' ? 'E' : dish.category === 'PLAT' ? 'P' : 'D'}
                                          </Badge>
                                          <span className="truncate">
                                            {dish.name}
                                          </span>
                                        </div>
                                        <button
                                          aria-label={`Retirer ${dish.name} du menu`}
                                          onClick={() => handleAssignDish(dish)}
                                          className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 hover:text-red-500 transition-opacity shrink-0"
                                        >
                                          <X size={10} aria-hidden="true" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  className="h-8 w-full border border-border text-[9px] font-black uppercase rounded-none hover:bg-orange-600 hover:text-white hover:border-orange-600 focus-visible:ring-1 focus-visible:ring-orange-600"
                                  onClick={() => {
                                    setAssignTarget({ day, meal: meal.name });
                                    setIsAssignOpen(true);
                                  }}
                                >
                                  Gérer
                                </Button>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* PRODUCTION LIST - Based on current week's planning */}
          <TabsContent value="production">
            <Card className="border border-border bg-card shadow-sm rounded-none overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.1em]">
                    LISTE DE PRODUCTION - SEMAINE {String(getWeekNumber(currentWeekMonday)).padStart(2, '0')}
                  </h2>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">
                    {productionList.length} plats à préparer • {patients.filter(p => p.status === 'ADMITTED').length} patients actifs
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-9 px-4 border-border font-black text-[10px] uppercase tracking-widest rounded-none gap-2"
                  >
                    <Download size={14} />
                    Exporter PDF
                  </Button>
                </div>
              </div>
              {productionList.length === 0 ? (
                <div className="p-12 text-center">
                  <CookingPot size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm font-bold">Aucun plat planifié pour cette semaine</p>
                  <p className="text-muted-foreground text-xs mt-1">Ajoutez des plats dans le calendrier pour les voir ici</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30 border-b border-border">
                    <TableRow>
                      <TableHead className="font-black uppercase text-[10px] py-5 px-6 pl-8">
                        Recette
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] py-5">
                        Catégorie
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] py-5">
                        Repas Concernés
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] py-5 text-center">
                        Portions
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] py-5">
                        Allergènes
                      </TableHead>
                      <TableHead className="font-black uppercase text-[10px] py-5 text-right pr-8">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productionList.map(({ dish, count, meals }) => (
                      <TableRow
                        key={dish.id}
                        className="border-b border-border/50 hover:bg-muted/5"
                      >
                        <TableCell className="py-5 px-8">
                          <p className="font-black text-xs uppercase tracking-tight">
                            {dish.name}
                          </p>
                          <p className="text-[9px] font-mono text-muted-foreground uppercase">
                            REF: {dish.id.slice(0, 8)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[8px] font-black border-border rounded-none px-2 uppercase",
                              dish.category === 'ENTREE' && "bg-green-600/10 text-green-700 border-green-600/20",
                              dish.category === 'PLAT' && "bg-orange-600/10 text-orange-700 border-orange-600/20",
                              dish.category === 'DESSERT' && "bg-purple-600/10 text-purple-700 border-purple-600/20"
                            )}
                          >
                            {dish.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {meals.slice(0, 3).map((meal) => (
                              <span
                                key={meal}
                                className="text-[8px] font-bold px-2 py-0.5 border border-border bg-muted/20 uppercase"
                              >
                                {meal.split('-')[0].slice(0, 3)} - {meal.split('-')[1]?.includes('Petit') ? 'PD' : meal.split('-')[1]?.includes('Déjeuner') ? 'DEJ' : 'DIN'}
                              </span>
                            ))}
                            {meals.length > 3 && (
                              <span className="text-[8px] font-bold px-2 py-0.5 text-muted-foreground">
                                +{meals.length - 3}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xl font-black italic text-orange-600">{count}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {dish.allergens && dish.allergens.length > 0 ? (
                              dish.allergens.map((a) => (
                                <span
                                  key={a}
                                  className="text-[8px] font-black uppercase px-1 border border-destructive/20 bg-destructive/5 text-destructive"
                                >
                                  {a}
                                </span>
                              ))
                            ) : (
                              <span className="text-[8px] text-muted-foreground italic">Aucun</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button
                            variant="ghost"
                            className="h-8 text-[9px] font-black uppercase tracking-widest px-4 border border-border rounded-none hover:bg-orange-600 hover:text-white hover:border-orange-600 focus-visible:ring-1 focus-visible:ring-orange-600"
                          >
                            Étiquettes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* FICHES RECETTES */}
          <TabsContent value="recipes" className="mt-0">
            <Card className="border border-border bg-card shadow-sm rounded-none overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.1em]">
                      Répertoire des Recettes
                    </h2>
                    <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">
                      {filteredDishes.length} plats sur {dishes.length} • Cliquez sur une fiche pour voir les détails
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Recherche */}
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={14}
                      />
                      <Input
                        placeholder="Rechercher..."
                        value={recipeSearchTerm}
                        onChange={(e) => setRecipeSearchTerm(e.target.value)}
                        className="pl-9 h-9 w-full sm:w-[200px] bg-muted/20 border-border rounded-none text-xs font-bold"
                      />
                    </div>
                    {/* Filtre catégorie */}
                    <Select value={recipeCategoryFilter} onValueChange={setRecipeCategoryFilter}>
                      <SelectTrigger className="h-9 w-full sm:w-[140px] border-border rounded-none font-bold text-[10px] uppercase">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border">
                        <SelectItem value="ALL" className="font-bold text-[10px]">TOUTES</SelectItem>
                        <SelectItem value="ENTREE" className="font-bold text-[10px]">ENTRÉES</SelectItem>
                        <SelectItem value="PLAT" className="font-bold text-[10px]">PLATS</SelectItem>
                        <SelectItem value="DESSERT" className="font-bold text-[10px]">DESSERTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                {filteredDishes.map((dish) => {
                  const extendedDish = dish as Dish & { description?: string; available?: boolean };
                  const isAvailable = extendedDish.available !== false;
                  
                  return (
                    <Card 
                      key={dish.id} 
                      className={cn(
                        "border rounded-none overflow-hidden transition-all cursor-pointer group",
                        isAvailable 
                          ? "border-border hover:shadow-lg hover:border-orange-600/30" 
                          : "border-border/50 bg-muted/30 opacity-70"
                      )}
                      onClick={() => {
                        setViewingDish(extendedDish);
                        setIsViewDishOpen(true);
                      }}
                    >
                      <CardHeader className="p-4 bg-muted/10 border-b border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-black uppercase tracking-tight truncate">
                                {dish.name}
                              </CardTitle>
                              {!isAvailable && (
                                <Badge variant="outline" className="text-[7px] font-black border-destructive/30 text-destructive bg-destructive/5 rounded-none px-1 shrink-0">
                                  INACTIF
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {!dish.isBreakfast && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[8px] font-black rounded-none px-2 uppercase",
                                    dish.category === 'ENTREE' && "bg-green-600/10 text-green-700 border-green-600/20",
                                    dish.category === 'PLAT' && "bg-orange-600/10 text-orange-700 border-orange-600/20",
                                    dish.category === 'DESSERT' && "bg-purple-600/10 text-purple-700 border-purple-600/20"
                                  )}
                                >
                                  {dish.category}
                                </Badge>
                              )}
                              {dish.isBreakfast && (
                                <Badge variant="outline" className="text-[8px] font-black border-blue-600/20 text-blue-700 bg-blue-600/10 rounded-none px-2 uppercase">
                                  <Coffee size={10} className="mr-1" />
                                  P.DÉJ
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Actions rapides visibles au hover */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none border border-border hover:bg-orange-600 hover:text-white hover:border-orange-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDish(extendedDish);
                                setIsEditDishOpen(true);
                              }}
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7 rounded-none border",
                                isAvailable 
                                  ? "border-border hover:bg-yellow-600 hover:text-white hover:border-yellow-600" 
                                  : "border-green-600/30 bg-green-600/10 hover:bg-green-600 hover:text-white hover:border-green-600"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleAvailability(extendedDish);
                              }}
                            >
                              {isAvailable ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        {/* Description */}
                        {extendedDish.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {extendedDish.description}
                          </p>
                        )}
                        
                        {/* Informations nutritionnelles */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                            <Utensils size={10} />
                            Valeurs Nutritionnelles
                          </p>
                          <div className="grid grid-cols-4 gap-1">
                            <div className="text-center p-2 bg-muted/20 border border-border">
                              <p className="text-sm font-black text-orange-600">{dish.nutritionalInfo?.calories || 0}</p>
                              <p className="text-[7px] font-bold uppercase text-muted-foreground">kcal</p>
                            </div>
                            <div className="text-center p-2 bg-muted/20 border border-border">
                              <p className="text-sm font-black">{dish.nutritionalInfo?.protein || 0}g</p>
                              <p className="text-[7px] font-bold uppercase text-muted-foreground">Prot.</p>
                            </div>
                            <div className="text-center p-2 bg-muted/20 border border-border">
                              <p className="text-sm font-black">{dish.nutritionalInfo?.carbs || 0}g</p>
                              <p className="text-[7px] font-bold uppercase text-muted-foreground">Gluc.</p>
                            </div>
                            <div className="text-center p-2 bg-muted/20 border border-border">
                              <p className="text-sm font-black">{dish.nutritionalInfo?.fat || 0}g</p>
                              <p className="text-[7px] font-bold uppercase text-muted-foreground">Lip.</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Allergènes */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Allergènes
                          </p>
                          {dish.allergens && dish.allergens.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {dish.allergens.map((a) => (
                                <span
                                  key={a}
                                  className="text-[8px] font-black uppercase px-2 py-0.5 border border-destructive/20 bg-destructive/5 text-destructive"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[9px] text-green-600 font-bold">Aucun allergène déclaré</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {filteredDishes.length === 0 && (
                <div className="p-12 text-center">
                  <Utensils size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm font-bold">
                    {dishes.length === 0 ? "Aucun plat disponible" : "Aucun plat ne correspond à votre recherche"}
                  </p>
                  {recipeSearchTerm && (
                    <Button 
                      variant="link" 
                      className="text-orange-600 text-xs mt-2"
                      onClick={() => {
                        setRecipeSearchTerm("");
                        setRecipeCategoryFilter("ALL");
                      }}
                    >
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ASSIGN DISH MODAL - CONDITIONAL BASED ON MEAL TYPE */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-2xl bg-card border-4 border-border p-0 rounded-none shadow-2xl overflow-hidden">
          <div className="bg-orange-600 p-8 text-white border-b border-border">
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
              {assignTarget?.meal}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-2">
              {assignTarget?.day} • Sélection d'options
            </p>
          </div>
          <div className="p-8 space-y-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="FILTRER LE RÉPERTOIRE..."
                className="pl-12 h-12 bg-muted/20 border-2 border-border font-black text-xs uppercase tracking-widest rounded-none focus-visible:ring-1 focus-visible:ring-orange-600"
              />
            </div>

            {/* PETIT DÉJEUNER : Liste simple sans catégories */}
            {assignTarget?.meal === "Petit Déjeuner" ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-2 border-b border-border">
                  Plats disponibles pour le Petit Déjeuner
                </h3>
                {dishes
                  .filter((d) => d.isBreakfast === true)
                  .map((dish) => {
                    const isSelected = planning[
                      `${assignTarget?.day}-${assignTarget?.meal}`
                    ]?.find((d) => d.id === dish.id);
                    return (
                      <div
                        key={dish.id}
                        onClick={() => handleAssignDish(dish)}
                        className={cn(
                          "p-3 border transition-colors cursor-pointer flex justify-between items-center",
                          isSelected
                            ? "border-orange-600 bg-orange-600/10"
                            : "border-border bg-muted/10 hover:border-orange-600/30",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[7px] font-black rounded-none px-1.5 border-none",
                              dish.category === 'ENTREE' && "bg-green-600/20 text-green-700",
                              dish.category === 'PLAT' && "bg-orange-600/20 text-orange-700",
                              dish.category === 'DESSERT' && "bg-purple-600/20 text-purple-700"
                            )}
                          >
                            {dish.category}
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-tight">
                            {dish.name}
                          </span>
                        </div>
                        {isSelected ? (
                          <CheckCircle2
                            size={14}
                            className="text-orange-600"
                          />
                        ) : (
                          <Plus
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    );
                  })}
                {dishes.filter((d) => d.isBreakfast === true).length === 0 && (
                  <div className="p-8 text-center">
                    <Coffee size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-xs text-muted-foreground font-bold">
                      Aucun plat configuré pour le petit déjeuner
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* DÉJEUNER / DÎNER : Grille avec catégories */
              <div className="grid grid-cols-2 gap-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {["ENTREE", "PLAT", "DESSERT"].map((cat) => (
                  <div key={cat} className="col-span-1 space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-1 border-b border-border">
                      {cat}S
                    </h3>
                    <div className="space-y-2">
                      {dishes
                        .filter((d) => d.category === cat)
                        .filter((d) => {
                          // Filtrer selon le type de repas
                          const isBreakfastMeal = assignTarget?.meal === "Petit Déjeuner";
                          // Petit déjeuner: que les plats avec isBreakfast=true
                          // Sinon (déjeuner/dîner): que les plats avec isBreakfast=false ou undefined
                          if (isBreakfastMeal) {
                            return d.isBreakfast === true;
                          }
                          return d.isBreakfast === false || d.isBreakfast === undefined;
                        })
                        .map((dish) => {
                          const isSelected = planning[
                            `${assignTarget?.day}-${assignTarget?.meal}`
                          ]?.find((d) => d.id === dish.id);
                          return (
                            <div
                              key={dish.id}
                              onClick={() => handleAssignDish(dish)}
                              className={cn(
                                "p-3 border transition-colors cursor-pointer flex justify-between items-center",
                                isSelected
                                  ? "border-orange-600 bg-orange-600/10"
                                  : "border-border bg-muted/10 hover:border-orange-600/30",
                              )}
                            >
                              <span className="text-[10px] font-black uppercase tracking-tight">
                                {dish.name}
                              </span>
                              {isSelected ? (
                                <CheckCircle2
                                  size={14}
                                  className="text-orange-600"
                                />
                              ) : (
                                <Plus
                                  size={14}
                                  className="text-muted-foreground"
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-8 bg-muted/30 border-t border-border">
            <Button
              className="w-full h-12 bg-orange-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-none shadow-xl"
              onClick={() => setIsAssignOpen(false)}
            >
              Enregistrer la Sélection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VIEW DISH DETAILS MODAL */}
      <Dialog open={isViewDishOpen} onOpenChange={setIsViewDishOpen}>
        <DialogContent className="max-w-2xl bg-card border-2 border-border p-0 rounded-none max-h-[90vh] overflow-y-auto">
          {viewingDish && (
            <>
              <div className={cn(
                "p-6 text-white border-b border-border",
                viewingDish.category === 'ENTREE' && "bg-green-600",
                viewingDish.category === 'PLAT' && "bg-orange-600",
                viewingDish.category === 'DESSERT' && "bg-purple-600"
              )}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                      {viewingDish.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className="bg-white/20 text-white border-none rounded-none text-[9px] font-black uppercase">
                        {viewingDish.category}
                      </Badge>
                      {viewingDish.isBreakfast && (
                        <Badge className="bg-white/20 text-white border-none rounded-none text-[9px] font-black uppercase">
                          <Coffee size={10} className="mr-1" /> Petit-Déjeuner
                        </Badge>
                      )}
                      {viewingDish.available === false && (
                        <Badge className="bg-red-900/50 text-white border-none rounded-none text-[9px] font-black uppercase">
                          INACTIF
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => {
                        setEditingDish(viewingDish);
                        setIsViewDishOpen(false);
                        setIsEditDishOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Info size={12} /> Description
                  </p>
                  <p className="text-sm text-foreground">
                    {viewingDish.description || "Aucune description disponible."}
                  </p>
                </div>

                {/* Valeurs nutritionnelles */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Utensils size={12} /> Valeurs Nutritionnelles (par portion)
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-4 bg-orange-600/5 border-2 border-orange-600/20">
                      <p className="text-3xl font-black text-orange-600">{viewingDish.nutritionalInfo?.calories || 0}</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">Calories (kcal)</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 border border-border">
                      <p className="text-3xl font-black text-blue-600">{viewingDish.nutritionalInfo?.protein || 0}g</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">Protéines</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 border border-border">
                      <p className="text-3xl font-black text-amber-600">{viewingDish.nutritionalInfo?.carbs || 0}g</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">Glucides</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 border border-border">
                      <p className="text-3xl font-black text-green-600">{viewingDish.nutritionalInfo?.fat || 0}g</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">Lipides</p>
                    </div>
                  </div>
                </div>

                {/* Allergènes */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <AlertTriangle size={12} /> Allergènes
                  </p>
                  {viewingDish.allergens && viewingDish.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingDish.allergens.map((a) => (
                        <span
                          key={a}
                          className="text-xs font-black uppercase px-3 py-1.5 border-2 border-destructive/30 bg-destructive/10 text-destructive"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Aucun allergène déclaré
                    </p>
                  )}
                </div>

                {/* ID du plat */}
                <div className="pt-4 border-t border-border">
                  <p className="text-[9px] font-mono text-muted-foreground">
                    ID: {viewingDish.id}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-black uppercase tracking-widest text-[10px] rounded-none"
                  onClick={() => setIsViewDishOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  className="flex-1 h-11 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-none gap-2"
                  onClick={() => {
                    setEditingDish(viewingDish);
                    setIsViewDishOpen(false);
                    setIsEditDishOpen(true);
                  }}
                >
                  <Edit size={14} /> Modifier
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT DISH MODAL */}
      <Dialog open={isEditDishOpen} onOpenChange={setIsEditDishOpen}>
        <DialogContent className="max-w-2xl bg-card border-2 border-border p-0 rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              Modifier le Plat
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
              Modifiez les informations du plat
            </DialogDescription>
          </DialogHeader>
          
          {editingDish && (
            <form onSubmit={handleEditDish} className="p-6 space-y-6">
              {/* Type Selector Tabs */}
              <div className="w-full">
                <Tabs
                  defaultValue="meal"
                  value={editingDish.isBreakfast ? "breakfast" : "meal"}
                  onValueChange={(v) =>
                    setEditingDish({ ...editingDish, isBreakfast: v === "breakfast" })
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/20 p-1 border border-border">
                    <TabsTrigger
                      value="meal"
                      className="rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                    >
                      Repas (Déj/Dîner)
                    </TabsTrigger>
                    <TabsTrigger
                      value="breakfast"
                      className="rounded-none text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                    >
                      Petit Déjeuner
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {/* Nom */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Nom du Plat *
                </Label>
                <Input
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  required
                  className="h-11 font-bold bg-muted/20 border-border rounded-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Description
                </Label>
                <textarea
                  value={editingDish.description || ""}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 font-medium text-sm bg-muted/20 border border-border rounded-none resize-none focus:outline-none focus:ring-1 focus:ring-orange-600"
                  placeholder="Description du plat..."
                />
              </div>

              {/* Catégorie et Type */}
              {!editingDish.isBreakfast && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Catégorie *
                    </Label>
                    <Select
                      value={editingDish.category}
                      onValueChange={(v: any) => setEditingDish({ ...editingDish, category: v })}
                    >
                      <SelectTrigger className="h-11 font-bold bg-muted/20 border-border rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border">
                        <SelectItem value="ENTREE" className="font-bold">ENTRÉE</SelectItem>
                        <SelectItem value="PLAT" className="font-bold">PLAT</SelectItem>
                        <SelectItem value="DESSERT" className="font-bold">DESSERT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Disponibilité */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Disponibilité
                </Label>
                <div className="flex gap-4 items-center p-3 bg-muted/20 border border-border">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.available !== false}
                      onChange={(e) => setEditingDish({ ...editingDish, available: e.target.checked })}
                      className="w-4 h-4 accent-orange-600"
                    />
                    <span className="text-xs font-bold">
                      {editingDish.available !== false ? "Plat actif (visible dans le planning)" : "Plat inactif (masqué)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Allergènes */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Allergènes
                </Label>
                <div className="grid grid-cols-3 gap-2 p-4 bg-muted/20 border border-border">
                  {ALLERGENS_LIST.map((allergen) => (
                    <label
                      key={allergen}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-none"
                    >
                      <input
                        type="checkbox"
                        checked={editingDish.allergens?.includes(allergen) || false}
                        onChange={(e) => {
                          const current = editingDish.allergens || [];
                          if (e.target.checked) {
                            setEditingDish({ ...editingDish, allergens: [...current, allergen] });
                          } else {
                            setEditingDish({ ...editingDish, allergens: current.filter(a => a !== allergen) });
                          }
                        }}
                        className="w-3.5 h-3.5 accent-orange-600"
                      />
                      <span className="text-[10px] font-bold">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Informations nutritionnelles */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Informations Nutritionnelles
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Calories</Label>
                    <Input
                      type="number"
                      value={editingDish.nutritionalInfo?.calories || 0}
                      onChange={(e) => setEditingDish({
                        ...editingDish,
                        nutritionalInfo: { ...editingDish.nutritionalInfo!, calories: parseInt(e.target.value) || 0 }
                      })}
                      className="h-9 font-bold bg-muted/20 border-border rounded-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Protéines (g)</Label>
                    <Input
                      type="number"
                      value={editingDish.nutritionalInfo?.protein || 0}
                      onChange={(e) => setEditingDish({
                        ...editingDish,
                        nutritionalInfo: { ...editingDish.nutritionalInfo!, protein: parseInt(e.target.value) || 0 }
                      })}
                      className="h-9 font-bold bg-muted/20 border-border rounded-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Glucides (g)</Label>
                    <Input
                      type="number"
                      value={editingDish.nutritionalInfo?.carbs || 0}
                      onChange={(e) => setEditingDish({
                        ...editingDish,
                        nutritionalInfo: { ...editingDish.nutritionalInfo!, carbs: parseInt(e.target.value) || 0 }
                      })}
                      className="h-9 font-bold bg-muted/20 border-border rounded-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Lipides (g)</Label>
                    <Input
                      type="number"
                      value={editingDish.nutritionalInfo?.fat || 0}
                      onChange={(e) => setEditingDish({
                        ...editingDish,
                        nutritionalInfo: { ...editingDish.nutritionalInfo!, fat: parseInt(e.target.value) || 0 }
                      })}
                      className="h-9 font-bold bg-muted/20 border-border rounded-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="destructive"
                  className="h-11 px-6 font-black uppercase tracking-widest text-[10px] rounded-none gap-2"
                  onClick={() => {
                    handleDeleteDish(editingDish.id);
                    setIsEditDishOpen(false);
                  }}
                >
                  <Trash2 size={14} /> Supprimer
                </Button>
                <div className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6 font-black uppercase tracking-widest text-[10px] rounded-none"
                  onClick={() => setIsEditDishOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-8 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-none"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <footer className="p-10 border-t border-border flex flex-col items-center gap-2 bg-card">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">
          OISHII SYSTEMS • KITCHEN OPS v3.1
        </p>
        <div className="flex gap-4 opacity-15 text-[8px] font-bold uppercase tracking-widest">
          <span>Industrial Efficiency</span>
          <span>•</span>
          <span>Data Privacy Locked</span>
        </div>
      </footer>
    </div>
  );
}
