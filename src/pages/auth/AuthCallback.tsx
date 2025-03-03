import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const url = window.location.href;

      const { data, error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        setError(error.message);
        setTimeout(() => navigate("/", { replace: true }), 5000);
      } else {
        console.log("Authentication Successful:", data);
        navigate("/home", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="p-6 bg-red-100 rounded-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-700">Authentication Error</h1>
          <p className="text-red-600">{error}</p>
          <p className="mt-4 text-gray-700">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Completing Authentication</h1>
        <p className="text-gray-600">Please wait while we finish setting up your session...</p>
        <div className="w-16 h-16 mx-auto mt-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default AuthCallback;
