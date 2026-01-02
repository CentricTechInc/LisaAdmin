import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading, error, success } = useAuth();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    const email = router.query.email as string;
    if (!email) {
      setMessage({ type: "error", text: "Email address is missing. Please restart the process." });
      return;
    }

    setMessage(null);
    try {
      await resetPassword(email, password, confirmPassword);
      setMessage({ type: "success", text: success || "Password reset successfully." });
    } catch (err: any) {
       const errorMessage = err.message || (typeof err === 'string' ? err : "Reset failed.");
       setMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <p className="text-2xl font-semibold">Reset Password</p>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,white_65%,transparent)]">
          Create a new password for your account
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 text-sm border rounded-lg whitespace-pre-wrap ${message.type === "success"
              ? "bg-green-500/20 border-green-500 text-white"
              : "bg-red-500/20 border-red-500 text-white"
            }`}
        >
          {message.text}
        </div>
      )}

      <form
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <FormInput
          label="New Password*"
          labelClassName="!text-white"
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
          labelClassName="!text-white"
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
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
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
