import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Smile } from "lucide-react";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const healthMessages = [
  "Stay hydrated and keep moving!",
  "Your health is your wealth. Take care of it!",
  "Small steps every day lead to a healthier you!",
  "Take a deep breath and enjoy the moment!",
  "Eat well, stay active, and rest enough!",
  "A healthy outside starts from the inside!",
  "Wellness is the key to happiness!",
  "Physical fitness is the first requisite of happiness!",
  "A good laugh and a long sleep are the best cures!",
  "Self-care is not selfish, it's essential!",
  "Exercise not only changes your body, it changes your mind!",
  "You don’t have to be extreme, just consistent!",
  "Every meal is a chance to nourish your body!",
  "Happiness begins with good health!",
  "Your body deserves to be taken care of!"
];

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [healthMessage, setHealthMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }

        if (data?.user) {
          setUser({
            name: data.user.user_metadata.full_name || "Unknown User",
            avatar: data.user.user_metadata.avatar_url || "https://via.placeholder.com/150",
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUser();
    setHealthMessage(healthMessages[Math.floor(Math.random() * healthMessages.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center mb-8 w-50 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg  ">
      <div className="relative w-16 h-16">
        <img
          src={user?.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
        />
      </div>
      <div className="flex flex-col items-center mt-2 text-center">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold text-lg">
          <Smile className="w-5 h-5 text-blue-500" /> Welcome
        </div>
        <p className="text-gray-900 dark:text-gray-200 text-lg font-semibold">
          {user?.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
          {healthMessage}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;