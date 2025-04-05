import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const InputPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex relative text-white">
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        className="pr-10"
      />
      <button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default InputPassword;
