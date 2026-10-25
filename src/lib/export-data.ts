import { csvCell } from "@/lib/catalog-builder";

export type ExportRow = Record<string, string | number>;
export function recordsToCsv(rows: ExportRow[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return [headers, ...rows.map((row) => headers.map((header) => String(row[header] ?? "")))].map((row) => row.map(csvCell).join(",")).join("\r\n");
}