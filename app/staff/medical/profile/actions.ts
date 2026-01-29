"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileName(userId: string, newName: string) {
    try {
        // Validation
        if (!newName || newName.trim().length === 0) {
            return {
                success: false,
                error: "Le nom ne peut pas être vide"
            };
        }

        if (newName.trim().length < 2) {
            return {
                success: false,
                error: "Le nom doit contenir au moins 2 caractères"
            };
        }

        if (newName.trim().length > 100) {
            return {
                success: false,
                error: "Le nom ne peut pas dépasser 100 caractères"
            };
        }

        // Update in database
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('profiles')
            .update({ full_name: newName.trim() })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            return {
                success: false,
                error: "Erreur lors de la mise à jour du profil"
            };
        }

        // Revalidate the profile page to show updated data
        revalidatePath('/staff/medical/profile');
        revalidatePath('/staff/medical/dashboard');

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Erreur inattendue:", error);
        return {
            success: false,
            error: "Une erreur inattendue s'est produite"
        };
    }
}
