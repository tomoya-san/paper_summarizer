"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, confirmSignUp, signIn } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";

type Mode = "sign-in" | "sign-up" | "confirm";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshAuth } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "sign-up") {
        await signUp(email, password);
        setMode("confirm");
      } else if (mode === "confirm") {
        await confirmSignUp(email, code);
        await signIn(email, password);
        await refreshAuth();
        router.push("/");
      } else {
        await signIn(email, password);
        await refreshAuth();
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "sign-in" && "Sign in"}
        {mode === "sign-up" && "Create account"}
        {mode === "confirm" && "Verify your email"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "confirm" ? (
          <Input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        ) : (
          <>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        <Button type="submit" disabled={loading}>
          {loading
            ? "Loading..."
            : mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create account"
                : "Verify"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {mode === "sign-in" && (
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => { setMode("sign-up"); setError(""); }}
          >
            Sign up
          </button>
        </p>
      )}
      {mode === "sign-up" && (
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => { setMode("sign-in"); setError(""); }}
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}
