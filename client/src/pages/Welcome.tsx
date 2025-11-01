import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, User } from "lucide-react";

const Welcome = () => {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (fullName.trim()) {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col px-8 py-8">
        <div className="mb-8">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="7" r="5" fill="#F06A6A"/>
            <circle cx="7" cy="18" r="5" fill="#F06A6A"/>
            <circle cx="21" cy="18" r="5" fill="#F06A6A"/>
          </svg>
        </div>

        <div className="max-w-md mt-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Asana!
          </h1>
          <p className="text-muted-foreground mb-12">
            You're signing up as anshalrai90@gmail.com.
          </p>

          <div className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  What's your full name?
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Anshal Rai"
                  className="border-2 border-primary focus:border-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                />
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!fullName.trim()}
              className="font-semibold"
            >
              Continue
            </Button>

            <p className="text-sm text-muted-foreground">
              You're signing up as anshalrai90@gmail.com.{" "}
              <button className="text-foreground hover:underline">Log in</button> instead.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Phone illustration */}
            <rect x="120" y="80" width="160" height="280" rx="20" fill="white" stroke="#F06A6A" strokeWidth="2"/>

            {/* Clouds */}
            <ellipse cx="80" cy="140" rx="30" ry="20" fill="white" stroke="#F06A6A" strokeWidth="1.5"/>
            <ellipse cx="320" cy="200" rx="25" ry="18" fill="white" stroke="#F06A6A" strokeWidth="1.5"/>

            {/* Email icon */}
            <rect x="220" y="100" width="40" height="30" rx="4" fill="white" stroke="#F06A6A" strokeWidth="2"/>
            <circle cx="225" cy="105" r="4" fill="#F06A6A"/>
            <path d="M220 110 L240 120 L260 110" stroke="#F06A6A" strokeWidth="2" fill="none"/>

            {/* Chart bars */}
            <rect x="240" y="150" width="8" height="15" fill="#F06A6A"/>
            <rect x="250" y="145" width="8" height="20" fill="#FFB4B4"/>
            <rect x="260" y="140" width="8" height="25" fill="#F06A6A"/>

            {/* Speech bubble */}
            <ellipse cx="200" cy="100" rx="35" ry="25" fill="white" stroke="#F06A6A" strokeWidth="1.5"/>

            {/* Fan/circle at bottom */}
            <path d="M 200 320 Q 180 280 200 260 Q 220 280 200 320" fill="#F06A6A"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
