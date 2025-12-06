// src/components/layout/login-form.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getToken, useLoginMutation } from "@/lib/auth/mutation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const login = useLoginMutation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return toast.error("Email & kata sandi wajib diisi");
    const res = await login.mutateAsync({ email, password });
    if (res.role) Cookies.set("role", res.role);
    if (res.name) Cookies.set("name", res.name);
    if (res.email) Cookies.set("email", res.email);

    if (getToken()) router.replace("/dashboard");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Header gradasi teal + logo statis */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white">
          <div className="mx-auto flex w-full max-w-sm items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white/10">
              <Image
                src="/images/logo.jpg"
                alt="Logo SMK 3 Dolopo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">CMS SMK 3 Dolopo</div>
              <div className="text-xs/none opacity-90">Panel Admin</div>
            </div>
          </div>
        </div>

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Selamat Datang Kembali</CardTitle>
          <CardDescription>Masuk untuk mengelola berita & pendaftaran</CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm">
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-teal-600"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 focus-visible:ring-teal-600"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPass ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={login.isPending}
                >
                  {login.isPending ? "Masuk..." : "Masuk"}
                </Button>
              </Field>
            </FieldGroup>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Butuh bantuan? Hubungi admin sekolah.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
