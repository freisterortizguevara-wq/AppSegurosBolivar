
import { useMemo, useState } from "react";
import { Search, Copy, Check, ArrowUpDown, RefreshCw, X, FileText } from "lucide-react";

// ---------- Tipos ----------

export interface Poliza {
  id: string;
  cliente: string;
  tipo: "INDIVIDUAL" | "COLECTIVA";
  estado: "Renovada" | "Cancelada" | "Pendiente" | string;
  canon: number;
  prima: number;
}

interface PolizasTableProps {
  polizas: Poliza[];
  onRenovar?: (id: string) => void;
  onCancelar?: (id: string) => void;
}

// ---------- Utilidades ----------

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Paleta determinística para los avatares, basada en el nombre
const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-sky-100 text-sky-800",
  "bg-rose-100 text-rose-800",
  "bg-violet-100 text-violet-800",
];
function avatarColor(name: string) {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

// ---------- Copiar ID ----------

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // portapapeles no disponible; no bloquea la UI
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600 transition hover:bg-gray-200"
      title="Copiar ID completo"
    >
      {id.slice(0, 8)}...
      {copied ? (
        <Check size={12} className="text-emerald-600" />
      ) : (
        <Copy size={12} className="opacity-0 transition group-hover:opacity-100" />
      )}
    </button>
  );
}

// ---------- Tarjetas de resumen ----------

function SummaryCards({ polizas }: { polizas: Poliza[] }) {
  const stats = useMemo(() => {
    const total = polizas.length;
    const renovadas = polizas.filter((p) => p.estado === "Renovada").length;
    const canceladas = polizas.filter((p) => p.estado === "Cancelada").length;
    const primaTotal = polizas.reduce((sum, p) => sum + p.prima, 0);
    return { total, renovadas, canceladas, primaTotal };
  }, [polizas]);

  const cards = [
    { label: "Total de pólizas", value: stats.total.toLocaleString("es-CO") },
    { label: "Renovadas", value: stats.renovadas.toLocaleString("es-CO"), accent: "text-emerald-700" },
    { label: "Canceladas", value: stats.canceladas.toLocaleString("es-CO"), accent: "text-rose-700" },
    { label: "Prima total", value: currency.format(stats.primaTotal) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{c.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${c.accent ?? "text-gray-900"}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- Buscador ----------

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar cliente..."
        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
      />
    </div>
  );
}

// ---------- Chips ----------

function TipoChip({ tipo }: { tipo: Poliza["tipo"] }) {
  const styles =
    tipo === "INDIVIDUAL"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {tipo}
    </span>
  );
}

function EstadoChip({ estado }: { estado: string }) {
  const styles =
    estado === "Renovada"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : estado === "Cancelada"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {estado}
    </span>
  );
}

// ---------- Header ordenable ----------

type SortKey = keyof Pick<Poliza, "cliente" | "canon" | "prima">;

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeKey === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 text-left font-semibold text-white/95 hover:text-white"
    >
      {label}
      <ArrowUpDown size={12} className={isActive ? "opacity-100" : "opacity-40"} />
      {isActive && <span className="text-[10px]">{direction === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

// ---------- Tabla completa ----------

export function PolizasTable({ polizas, onRenovar, onCancelar }: PolizasTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  const filtered = useMemo(() => {
    let rows = polizas.filter((p) => p.cliente.toLowerCase().includes(query.toLowerCase()));
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [polizas, query, sortKey, direction]);

  const exportCsv = () => {
    const header = ["ID", "Cliente", "Tipo", "Estado", "Canon", "Prima"];
    const rows = filtered.map((p) => [p.id, p.cliente, p.tipo, p.estado, p.canon, p.prima]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polizas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <SummaryCards polizas={polizas} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} />
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FileText size={14} />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-emerald-800">
            <tr>
              <th className="px-4 py-3 text-left text-white/95 font-semibold">ID</th>
              <th className="px-4 py-3 text-left">
                <SortableHeader label="Cliente" sortKey="cliente" activeKey={sortKey} direction={direction} onSort={handleSort} />
              </th>
              <th className="px-4 py-3 text-left text-white/95 font-semibold">Tipo</th>
              <th className="px-4 py-3 text-left text-white/95 font-semibold">Estado</th>
              <th className="px-4 py-3 text-left">
                <SortableHeader label="Canon" sortKey="canon" activeKey={sortKey} direction={direction} onSort={handleSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortableHeader label="Prima" sortKey="prima" activeKey={sortKey} direction={direction} onSort={handleSort} />
              </th>
              <th className="px-4 py-3 text-left text-white/95 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.map((p, i) => (
              <tr key={p.id} className={`transition hover:bg-emerald-50/60 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}>
                <td className="px-4 py-3">
                  <CopyableId id={p.id} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(p.cliente)}`}>
                      {initials(p.cliente)}
                    </span>
                    <span className="font-medium text-gray-900">{p.cliente}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TipoChip tipo={p.tipo} />
                </td>
                <td className="px-4 py-3">
                  <EstadoChip estado={p.estado} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{currency.format(p.canon)}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{currency.format(p.prima)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRenovar?.(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-700 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                    >
                      <RefreshCw size={12} />
                      Renovar
                    </button>
                    <button
                      onClick={() => onCancelar?.(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-600 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <X size={12} />
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  No se encontraron pólizas para "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
