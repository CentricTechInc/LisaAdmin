import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppLayout } from "@/components/layout/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith("/auth") || router.pathname === "/";

  if (isAuthPage) {
    return <Component {...pageProps} />;
  }

  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}
