// src/root.tsx
import { useEffect } from "react";
import { useToastStore } from "lib/zustand/ToastStore";
import { useThemeStore } from "lib/zustand/ThemeStore";
import { Toast, toastConfig } from "component/toastConfig";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)resolved-theme=([^;]*)/);
  const theme = match?.[1] === "dark" ? "dark" : "light";
  return { theme };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/nathracker_icon_v9.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// root.tsx

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang="en" data-theme={data?.theme ?? "light"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const { open, statusMessage, toastStatus } = useToastStore();
  // const { theme, setTheme } = useThemeStore();

  // useEffect(() => {
  //   APIFETCH.get("/settings/UserInfo")
  //     .then((res) => {
  //       const t = res.data?.theme;
  //       if (t === "LIGHT") setTheme("light");
  //       else if (t === "DARK") setTheme("dark");
  //     })
  //     .catch(() => {
  //       // Not authenticated — use system preference
  //       setTheme("system");
  //     });
  // }, []);

  // useEffect(() => {
  //   const mq = window.matchMedia("(prefers-color-scheme: dark)");

  //   const apply = () => {
  //     const resolved = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
  //     document.documentElement.setAttribute("data-theme", resolved);
  //     document.cookie = `resolved-theme=${resolved}; path=/; max-age=31536000; SameSite=Lax`;
  //   };

  //   apply();

  //   // Keep in sync if system preference changes while on a public page
  //   if (theme === "system") {
  //     mq.addEventListener("change", apply);
  //     return () => mq.removeEventListener("change", apply);
  //   }
  // }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {open && ( // ✅ renders after hydration, no mismatch
        <Toast
          statusMessage={statusMessage}
          toastStatus={toastStatus}
          toastConfig={toastConfig}
        />
      )}
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}