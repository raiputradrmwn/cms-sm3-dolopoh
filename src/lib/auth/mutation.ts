"use client";

import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginRequest } from "./fetcher";
import type { LoginPayload, LoginResponse } from "./types";

const TOKEN_COOKIE = "token";

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (p) => loginRequest(p),
    onSuccess: (data) => {
      Cookies.set(TOKEN_COOKIE, data.token, {
        expires: 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      toast.success("Berhasil masuk");
    },
    onError: (e) => toast.error(e.message || "Login gagal"),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      Cookies.remove(TOKEN_COOKIE, { path: "/" });
    },
  });
}

export const getToken = () => Cookies.get(TOKEN_COOKIE);
