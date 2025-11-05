import type { Student, RegistrationItem } from "./types";

export function toRegNo(id: string) {
  const tail = id.slice(-6).toUpperCase();
  return `STU-${tail}`;
}

export function mapStudentsToRows(list: Student[]): RegistrationItem[] {
  return list.map((s) => ({
    id: s.id,
    regNo: toRegNo(s.id),
    name: s.name,
    major: s.major,
    status: "BARU",     // fallback sampai backend punya field status
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));
}

export function sortLatest<T extends { createdAt?: string; created_at?: string }>(arr: T[]) {
  return [...arr].sort(
    (a, b) =>
      +new Date((b.createdAt ?? b.created_at) || 0) -
      +new Date((a.createdAt ?? a.created_at) || 0)
  );
}
