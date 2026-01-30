import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LogoutPage = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
    return redirect("/staff/login");
  }

  return redirect("/staff/login");
};

export default LogoutPage;
