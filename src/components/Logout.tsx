import React from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut } from "lucide-react"; // Import logout icon

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to login page
      window.location.href = "https://medicheck-health-tracker.vercel.app/";
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Error logging out. Try again!");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center p-3 rounded-lg mb-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      <LogOut className="mr-3" />
      Logout
    </button>
  );
};

export default Logout;
