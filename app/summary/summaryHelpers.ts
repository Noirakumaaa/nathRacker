import * as XLSX from "xlsx";
import { MONTHS, DOC_TYPES } from "~/types/SummaryType";
import type { MonthlySummaryResponse } from "~/types/SummaryType";

export function isWorkday(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day >= 1 && day <= 5;
}

export function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export function downloadAccomplishment(
  month: number,
  year: number,
  data: MonthlySummaryResponse,
) {
  const monthName = MONTHS[month - 1];
  const daysInMonth = new Date(year, month, 0).getDate();

  const entryDateKeys = new Set<string>();

  DOC_TYPES.forEach((type) => {
    data[type].entries.forEach((e) => {
      const d = new Date(e.date);
      
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      entryDateKeys.add(key);
    });
  });

  const days: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const day = date.getDay();
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const isWeekday = day >= 1 && day <= 5;
    const hasEntry = entryDateKeys.has(key);

    if (isWeekday || hasEntry) days.push(date);
  }

  // ── Header ────────────────────────────────────────────────────
  const wsData: string[][] = [
    ["DATE", "TARGET PLAN", "ACCOMPLISHMENT / ACTUAL"],
  ];

  days.forEach((wd) => {
    const dateLabel = wd.toLocaleDateString("en-PH", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    const activeTypes: string[] = [];
    const accomplishmentLines: string[] = [];

    DOC_TYPES.forEach((type) => {
      const dayEntries = data[type].entries.filter((e) => {
        const entryDate = new Date(e.date);
        return (
          entryDate.getUTCFullYear() === wd.getFullYear() &&
          entryDate.getUTCMonth()    === wd.getMonth() &&
          entryDate.getUTCDate()     === wd.getDate()
        );
      });

      if (dayEntries.length === 0) return;

      activeTypes.push(type);

      const enc = dayEntries.filter((e) => e.type === "encode").length;
      const upd = dayEntries.filter((e) => e.type === "update").length;
      const iss = dayEntries.filter((e) => e.type === "issue").length;

      accomplishmentLines.push(
        `${type} ${enc} ENCODED / ${upd} UPDATED / ${iss} ISSUES `
      );
    });

    wsData.push([
      dateLabel,
      activeTypes.join(", "),
      accomplishmentLines.join("\n"),
    ]);
  });


  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  worksheet["!cols"] = [
    { wch: 12 }, 
    { wch: 24 }, 
    { wch: 52 }, 
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${monthName} ${year}`);
  XLSX.writeFile(workbook, `Accomplishment_${monthName}_${year}.xlsx`);
}