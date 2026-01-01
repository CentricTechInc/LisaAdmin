import React from "react";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

function OtpBox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      className="h-12 w-12 rounded-md border border-[color-mix(in_oklab,white_25%,transparent)] bg-transparent text-center text-lg font-semibold text-white outline-none focus:border-[color-mix(in_oklab,#FF4460_100%,transparent)]"
      {...props}
    />
  );
}

export default function OtpPage() {
  const router = useRouter();
  const [codes, setCodes] = React.useState(["", "", "", ""]);
  const { verifyOtp, isLoading, error, success } = useAuth();
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const next = [...codes];
    next[index] = value;
    setCodes(next);
  };

  const handleVerify = async () => {
    const otp = codes.join("");
    if (otp.length !== 4) {
      setMessage({ type: "error", text: "Please enter a valid 4-digit OTP." });
      return;
    }

    const email = router.query.email as string;
    if (!email) {
      setMessage({ type: "error", text: "Email address is missing. Please try again from forgot password page." });
      return;
    }

    setMessage(null);
    try {
      await verifyOtp(email, parseInt(otp));
      setMessage({ type: "success", text: success || "OTP Verified Successfully." });
    } catch (err: any) {
      // Error is already handled in context, but we can set local message too
      setMessage({ type: "error", text: error || "Verification failed." });
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <p className="text-2xl font-semibold">OTP Verification</p>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,white_65%,transparent)]">
          Enter your OTP code here
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

      <div className="mb-6 flex justify-center gap-3">
        {codes.map((code, i) => (
          <OtpBox
            key={i}
            value={code}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
      </div>

      <div className="mb-6 text-center text-xs text-[color-mix(in_oklab,white_70%,transparent)]">
        <span>Didn&apos;t receive the OTP? </span>
        <button
          type="button"
          className="text-[color-mix(in_oklab,#FF4460_100%,transparent)] hover:underline"
        >
          Resend
        </button>
      </div>

      <Button
        type="button"
        variant="brand"
        shape="pill"
        size="lg"
        className="w-full text-base"
        onClick={handleVerify}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </AuthLayout>
  );
}
