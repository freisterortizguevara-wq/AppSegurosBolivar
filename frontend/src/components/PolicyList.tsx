import { useMemo, useState } from 'react';
import { usePolicies } from '../hooks/usePolicies';
import { Chip } from './Chip';
import { StatusChip } from './StatusChip';
import { IconRefresh, IconX, IconSearch, IconClipboard, IconInbox, IconCopy, IconCheck, IconSort, IconDownload } from './icons';
import { actionBtnBase, onBtnEnter, onBtnLeave } from '../styles/actionButton';

type SortKey = 'clientName' | 'canonAmount' | 'premiumAmount';

const currency = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(n);

export function PolicyList() {
  const {
    policies,
    loading,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    loadPolicies,
    handleRenew,
    handleCancel,
  } = usePolicies();

  // --- estado local, solo frontend, no toca el hook ni el backend ---
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // portapapeles no disponible; no bloquea la UI
    }
  };

  const visiblePolicies = useMemo(() => {
    let rows = policies.filter((p) =>
      p.clientName.toLowerCase().includes(query.toLowerCase())
    );
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [policies, query, sortKey, sortDir]);

  const summary = useMemo(() => {
    const total = policies.length;
    const renovadas = policies.filter((p) => p.status === 'RENOVADA').length;
    const canceladas = policies.filter((p) => p.status === 'CANCELLED').length;
    const primaTotal = policies.reduce((sum, p) => sum + p.premiumAmount, 0);
    return { total, renovadas, canceladas, primaTotal };
  }, [policies]);

  const exportCsv = () => {
    const header = ['ID', 'Cliente', 'Tipo', 'Estado', 'Canon', 'Prima'];
    const rows = visiblePolicies.map((p) => [p.id, p.clientName, p.type, p.status, p.canonAmount, p.premiumAmount]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polizas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortIcon = (key: SortKey) => (
    <span
      className="d-inline-flex align-items-center ms-1"
      style={{ opacity: sortKey === key ? 1 : 0.5, cursor: 'pointer' }}
      onClick={() => handleSort(key)}
    >
      <IconSort />
      {sortKey === key && <small className="ms-1">{sortDir === 'asc' ? '↑' : '↓'}</small>}
    </span>
  );

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pólizas...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 d-flex align-items-center gap-2">
          <IconClipboard />
          <div>
          <p className="text-muted mb-0">Administre las pólizas de sus clientes</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total de pólizas', value: summary.total, color: '#003366' },
          { label: 'Renovadas', value: summary.renovadas, color: '#0066CC' },
          { label: 'Canceladas', value: summary.canceladas, color: '#DC3545' },
          { label: 'Prima total', value: currency(summary.primaTotal), color: '#003366' },
        ].map((card) => (
          <div className="col-6 col-md-3" key={card.label}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{card.label}</p>
                <p className="mb-0 fw-bold" style={{ fontSize: '1.4rem', color: card.color }}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mb-4" style={{ borderColor: '#003366', borderWidth: '2px' }}>
        <div className="card-body" style={{ backgroundColor: '#F5F7FA' }}>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Tipo de Póliza</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ borderColor: '#0066CC' }}
              >
                <option value="">Todos los tipos</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COLECTIVA">Colectiva</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ borderColor: '#0066CC' }}
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Activa</option>
                <option value="RENOVADA">Renovada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={loadPolicies}
                style={{
                  backgroundColor: '#003366',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '10px 0',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066CC';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003366';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                }}
              >
                <IconSearch /> Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador por cliente + exportar CSV (client-side, no toca el backend) */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="position-relative" style={{ maxWidth: '280px', width: '100%' }}>
          <IconSearch />
          <input
            type="text"
            className="form-control ps-4"
            placeholder="Buscar cliente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ borderColor: '#0066CC' }}
          />
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={exportCsv}
        >
          <IconDownload /> Exportar CSV
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#003366', color: 'white' }}>
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3" style={{ cursor: 'pointer' }} onClick={() => handleSort('clientName')}>
                    Cliente {sortIcon('clientName')}
                  </th>
                  <th className="py-3">Tipo</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-end" style={{ cursor: 'pointer' }} onClick={() => handleSort('canonAmount')}>
                    Canon {sortIcon('canonAmount')}
                  </th>
                  <th className="py-3 text-end" style={{ cursor: 'pointer' }} onClick={() => handleSort('premiumAmount')}>
                    Prima {sortIcon('premiumAmount')}
                  </th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visiblePolicies.map((p) => (
                  <tr key={p.id} className="align-middle">
                    <td className="px-4">
                      <button
                        className="btn btn-sm btn-light d-inline-flex align-items-center gap-1"
                        onClick={() => handleCopy(p.id)}
                        title="Copiar ID completo"
                        style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                      >
                        {p.id.slice(0, 8)}...
                        {copiedId === p.id ? <IconCheck /> : <IconCopy />}
                      </button>
                    </td>
                    <td>
                      <span className="fw-semibold">{p.clientName}</span>
                    </td>
                    <td>
                      <Chip
                        color={p.type === 'INDIVIDUAL' ? '#0066CC' : '#FF6B00'}
                        label={p.type}
                      />
                    </td>
                    <td>
                      <StatusChip status={p.status} />
                    </td>
                    <td className="text-end fw-semibold" style={{ color: '#003366' }}>
                      {currency(p.canonAmount)}
                    </td>
                    <td className="text-end" style={{ color: '#6C757D' }}>
                      {currency(p.premiumAmount)}
                    </td>
                    <td className="text-center">
                      {p.status !== 'CANCELLED' && (
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleRenew(p.id)}
                            style={{ ...actionBtnBase, borderColor: '#0066CC', color: '#0066CC' }}
                            onMouseEnter={(e) => onBtnEnter(e, '#0066CC')}
                            onMouseLeave={(e) => onBtnLeave(e, '#0066CC')}
                          >
                            <IconRefresh /> Renovar
                          </button>
                          <button
                            onClick={() => handleCancel(p.id)}
                            style={{ ...actionBtnBase, borderColor: '#DC3545', color: '#DC3545' }}
                            onMouseEnter={(e) => onBtnEnter(e, '#DC3545')}
                            onMouseLeave={(e) => onBtnLeave(e, '#DC3545')}
                          >
                            <IconX /> Cancelar
                          </button>
                        </div>
                      )}
                      {p.status === 'CANCELLED' && <Chip color="#6C757D" label="Cancelada" />}
                    </td>
                  </tr>
                ))}

                {visiblePolicies.length === 0 && policies.length > 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No se encontraron pólizas para "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {policies.length === 0 && (
        <div className="alert alert-info mt-4 text-center d-flex flex-column align-items-center gap-2" role="alert">
          <IconInbox />
          <h5 className="mb-0">No hay pólizas registradas</h5>
          <p className="mb-0">Comience creando una nueva póliza</p>
        </div>
      )}

      <div className="mt-4 text-center text-muted" style={{ fontSize: '0.85rem' }}>
        <hr />
        <p>Seguros Bolívar - Prueba Técnica Freister L Ortiz</p>
      </div>
    </div>
  );
}
