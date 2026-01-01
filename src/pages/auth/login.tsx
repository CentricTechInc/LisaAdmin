import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     const data= await login(email, password);
     console.log(data,"frontent ka error!")
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <p className="text-2xl font-semibold">Log in</p>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,white_65%,transparent)]">
          Enter your email and password to get access your account
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="p-3 text-sm text-white bg-red-500/20 border border-red-500 rounded-lg whitespace-pre-wrap">
            {error}
          </div>
        )}
        
        <FormInput
          label="Email*"
          labelClassName="text-white"
          type="email"
          placeholder="joe.doe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          wrapperClassName="text-white"
          className="h-12 border-[color-mix(in_oklab,white_20%,transparent)] bg-transparent text-white placeholder:text-[color-mix(in_oklab,white_40%,transparent)] focus:border-[#FF4460]"
        />

        <FormInput
          label="Password*"
          labelClassName="text-white"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          wrapperClassName="text-white"
          className="h-12 border-[color-mix(in_oklab,white_20%,transparent)] bg-transparent text-white placeholder:text-[color-mix(in_oklab,white_40%,transparent)] focus:border-[#FF4460]"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="opacity-70 hover:opacity-100"
            >
              <Image
                src="/icons/eye.svg"
                alt="Toggle password"
                width={20}
                height={20}
              />
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Checkbox
              label="Remember me"
              className="text-white"
            />
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-[color-mix(in_oklab,#FF4460_100%,transparent)] hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          variant="brand"
          shape="pill"
          size="lg"
          className="mt-4 w-full text-base"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
