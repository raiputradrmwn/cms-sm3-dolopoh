// src/components/layout/app-sidebar.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Newspaper, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const menu = [
    { title: "Beranda", url: "/dashboard", icon: Home },
    { title: "Berita", url: "/dashboard/berita", icon: Newspaper },
    { title: "Pendaftaran", url: "/dashboard/pendaftaran", icon: ClipboardList },
  ];

  async function handleLogout() {
    try {
      setLoading(true);

      // Hapus token di cookie (SAMAKAN nama cookie-nya dengan yang kamu set saat login)
      Cookies.remove("token");
      // Jika dulu sempat pakai nama lain:
      Cookies.remove("access_token");

      // (Opsional) Bersihkan cache lokal yang mungkin ada
      // localStorage.removeItem("swr_students_list_1_10_v1");

      toast.success("Berhasil keluar");
      router.replace("/"); // kembali ke halaman login
    } catch (e) {
      toast.error("Gagal logout, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 font-semibold text-lg px-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary font-bold">
            3
          </div>
          <span>SMK 3 Dolopo</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <a
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 text-base py-2 rounded-lg transition-colors",
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profil pengguna + Logout */}
      <div className="mt-auto border-t p-4 flex items-center gap-3">
        <Image
          src="/photos/man.png"
          alt="User Photo"
          width={42}
          height={42}
          className="rounded-full border"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Admin Dolopo</p>
          <p className="text-xs text-muted-foreground truncate">
            admin@smk3dolopo.sch.id
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          disabled={loading}
          title="Keluar"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
