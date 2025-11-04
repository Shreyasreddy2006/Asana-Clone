import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

const Welcome = () => {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleContinue = async () => {
    if (fullName.trim()) {
      try {
        // Update user profile with the full name
        await authService.updateProfile({ name: fullName.trim() });
        navigate("/onboarding");
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update your name. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col px-12 py-10 max-w-2xl">
        {/* Logo */}
        <div className="mb-16">
          <img src="/asana-logo.png" alt="Asana" width="32" height="32" className="w-8 h-8 object-contain" />
        </div>

        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to Asana!
          </h1>
          <p className="text-gray-600 text-base mb-12">
            You're signing up as {user?.email || 'anshalrai90@gmail.com'}.
          </p>

          <div className="space-y-6">
            {/* Avatar and Name Input */}
            <div className="flex items-start gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <User className="w-9 h-9 text-gray-400" strokeWidth={1.5} />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 pt-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                  What's your full name?
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=""
                  className="h-11 border-2 border-gray-900 rounded-md focus:border-gray-900 focus:ring-0 text-base px-3"
                  onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                />
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!fullName.trim()}
              className="h-11 px-6 bg-rose-800 hover:bg-rose-900 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: fullName.trim() ? '#a0777a' : '#d4c4c6' }}
            >
              Continue
            </Button>

            <p className="text-sm text-gray-600">
              You're signing up as {user?.email || 'anshalrai90@gmail.com'}.{" "}
              <Link to="/login" className="text-gray-900 hover:underline font-normal">
                Log in
              </Link>{" "}
              instead.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="flex-1 flex items-center justify-center p-12" style={{ backgroundColor: '#fef0f2' }}>
        <div className="w-full max-w-md">
          <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Phone/Card */}
            <rect x="130" y="120" width="180" height="300" rx="16" fill="white" stroke="#F06A6A" strokeWidth="2.5"/>

            {/* Top Left Cloud/Bubble */}
            <ellipse cx="90" cy="180" rx="40" ry="28" fill="white" stroke="#F06A6A" strokeWidth="2"/>

            {/* Top Right Speech Bubble */}
            <ellipse cx="280" cy="120" rx="50" ry="35" fill="white" stroke="#F06A6A" strokeWidth="2"/>

            {/* Email/Message Icon Top Right */}
            <rect x="285" y="110" width="42" height="30" rx="4" fill="white" stroke="#F06A6A" strokeWidth="2"/>
            <path d="M285 115 L306 125 L327 115" stroke="#F06A6A" strokeWidth="2" fill="none"/>

            {/* Bar Chart Inside Phone */}
            <rect x="250" y="165" width="12" height="20" rx="2" fill="#F8B4B4"/>
            <rect x="265" y="160" width="12" height="25" rx="2" fill="#F8B4B4"/>
            <rect x="280" y="155" width="12" height="30" rx="2" fill="#F8B4B4"/>

            {/* Bottom Right Circle */}
            <ellipse cx="340" cy="260" rx="35" ry="25" fill="white" stroke="#F06A6A" strokeWidth="2"/>

            {/* Leaf/Teardrop Shape at Bottom */}
            <path d="M 220 380 Q 200 340 220 310 Q 240 340 220 380 Z" fill="#F06A6A"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
