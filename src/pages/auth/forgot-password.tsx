import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const { forgotPassword, isLoading, error, success } = useAuth();
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
console.log(success,"<----------success")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: error || "Please enter your email address" });
      return;
    }

    setMessage(null);

    try {
      await forgotPassword(email);
      setMessage({ type: "success", text: "Reset link has been sent to your email address." });
      
      // Redirect to OTP page after a short delay or immediately
      // Passing email as query param so OTP page can use it
      setTimeout(() => {
        router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
      }, 1500);
      
    } catch (err: any) {
      // axios.ts interceptor already processes the error and returns a clean message
      setMessage({ type: "error", text: error || "Failed to send reset link." });
    }
  };

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
        onSubmit={handleSubmit}
      >
        {message && (
          <div
            className={`p-3 text-sm border rounded-lg whitespace-pre-wrap ${message.type === "success"
                ? "bg-green-500/20 border-green-500 text-white"
                : "bg-red-500/20 border-red-500 text-white"
              }`}
          >
            {success}
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

        <Button
          type="submit"
          variant="brand"
          shape="pill"
          size="lg"
          className="mt-4 w-full text-base"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
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
