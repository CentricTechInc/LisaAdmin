import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <p className="text-2xl font-semibold">Reset Password</p>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,white_65%,transparent)]">
          Create a new password for your account
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          // Handle reset password logic
        }}
      >
        <FormInput
          label="New Password*"
          labelClassName="text-white"
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
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

        <FormInput
          label="Confirm Password*"
          labelClassName="text-white"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          wrapperClassName="text-white"
          className="h-12 border-[color-mix(in_oklab,white_20%,transparent)] bg-transparent text-white placeholder:text-[color-mix(in_oklab,white_40%,transparent)] focus:border-[#FF4460]"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        <Button
          type="submit"
          variant="brand"
          shape="pill"
          size="lg"
          className="mt-4 w-full text-base"
        >
          Reset Password
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
