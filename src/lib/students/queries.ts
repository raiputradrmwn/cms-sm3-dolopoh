"use client";
import { useQuery } from "@tanstack/react-query";
import type { StudentsListResponse, Student, RegistrationItem } from "./types";
import api from "../api/axios";
import { mapStudentsToRows, sortLatest } from "./utils";


const M_TKRO = "Teknik Kendaraan Ringan Otomotif";
const M_DKVK = "Desain Komunikasi Visual/Komputer";
const M_TBSM = "Teknik Bisnis Sepeda Motor";
const M_TB   = "Tata Busana";


function normalizeMajor(raw: string): string {
  const s = (raw || "").toLowerCase();

  
  if (s.includes("kendaraan ringan")) return M_TKRO;
  if (s.includes("desain") && (s.includes("busana") || s.includes("produksi")))
    return M_TB; 
  if (s.includes("bisnis") && s.includes("motor")) return M_TBSM;
  if (s.includes("dkv") || s.includes("komunikasi visual") || s.includes("komputer"))
    return M_DKVK;

  
  if (s.includes("informatika") || s.includes("ti")) return M_DKVK;

  
  return M_DKVK;
}


function aggregateByMajor(students: Student[]) {
  const map = new Map<string, number>();
  for (const st of students) {
    const key = normalizeMajor(st.major);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  
  const ordered = [M_TKRO, M_DKVK, M_TBSM, M_TB].map((m) => ({
    major: m,
    count: map.get(m) ?? 0,
  }));
  
  return ordered;
}

export function useRegistrationsPerMajor(params = { page: 1, limit: 10 }) {
  const { page, limit } = params;

  return useQuery({
    queryKey: ["students", "list", page, limit],
    queryFn: async () => {
      const r = await api.get<StudentsListResponse>("/students", {
        params: { page, limit },
      });
      const list = r.data.data.data ?? [];
      return aggregateByMajor(list);
    },
  });
}
export function useRecentRegistrations({ page = 1, limit = 10, take = 5 } = {}) {
  return useQuery({
    queryKey: ["students", "recent", page, limit, take],
    queryFn: async (): Promise<RegistrationItem[]> => {
      const r = await api.get<StudentsListResponse>("/students", { params: { page, limit } });
      const raw = r.data.data.data ?? [];
      const rows = mapStudentsToRows(raw);
      const latest = sortLatest(rows);
      return latest.slice(0, take);
    },
  });
}