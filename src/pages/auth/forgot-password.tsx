import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <p className="text-2xl font-semibold">Forgot Password</p>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,white_65%,transparent)]">
          Enter your email address to receive a password reset link
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          // Handle password reset logic here
          console.log("Reset password for:", email);
        }}
      >
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

        <Button
          type="submit"
          variant="brand"
          shape="pill"
          size="lg"
          className="mt-4 w-full text-base"
        >
          Send Reset Link
        </Button>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-[color-mix(in_oklab,white_70%,transparent)] hover:text-white hover:underline"
          >
            Back to Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
