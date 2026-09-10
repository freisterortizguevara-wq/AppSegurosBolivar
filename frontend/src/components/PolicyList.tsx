import { useEffect, useState } from 'react';
import { policyApi } from '../api/policyApi';
import type { Policy } from '../types';

// ---- Iconos SVG (reemplazan los emojis por algo más profesional) ----
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconClipboard = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

const IconInbox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

// Logo de marca: escudo estilizado con la estrella original, para usar en el header
export const BolivarLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path
      d="M20 2 L36 9 V19 C36 29 29.5 35.5 20 38 C10.5 35.5 4 29 4 19 V9 Z"
      fill="#F4B400"
      stroke="#B8860B"
      strokeWidth="0.5"
    />
    <path
      d="M20 4.3 L34 10.3 V19 C34 27.8 28.3 33.6 20 36 C11.7 33.6 6 27.8 6 19 V10.3 Z"
      fill="#046A38"
    />
    <path
      d="M20 11 L22.3 16.9 L28.5 17.3 L23.7 21.3 L25.3 27.3 L20 23.9 L14.7 27.3 L16.3 21.3 L11.5 17.3 L17.7 16.9 Z"
      fill="#F4B400"
    />
  </svg>
);

// ---- Estilos reutilizables para los botones de acción ----
const actionBtnBase: React.CSSProperties = {
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '999px',
  fontWeight: 600,
  fontSize: '0.85rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
  cursor: 'pointer',
};

const onBtnEnter = (e: React.MouseEvent<HTMLButtonElement>, hoverColor: string) => {
  e.currentTarget.style.backgroundColor = hoverColor;
  e.currentTarget.style.transform = 'translateY(-1px)';
  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.22)';
};

const onBtnLeave = (e: React.MouseEvent<HTMLButtonElement>, baseColor: string) => {
  e.currentTarget.style.backgroundColor = baseColor;
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
};

export function PolicyList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadPolicies();
  }, [filterType, filterStatus]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const response = await policyApi.list(filterType, filterStatus);
      setPolicies(response.data);
    } catch (error) {
      console.error('Error cargando pólizas:', error);
      alert('Error al cargar pólizas. Asegúrate que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id: string) => {
    const ipc = prompt('Ingrese IPC (%) para renovar:', '5.2');
    if (ipc) {
      try {
        await policyApi.renew(id, parseFloat(ipc));
        loadPolicies();
        alert('✅ Póliza renovada exitosamente');
      } catch (error) {
        alert('❌ Error al renovar póliza');
      }
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('¿Está seguro de cancelar esta póliza?')) {
      try {
        await policyApi.cancel(id);
        loadPolicies();
        alert('✅ Póliza cancelada exitosamente');
      } catch (error) {
        alert('❌ Error al cancelar póliza');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge" style={{ backgroundColor: '#28A745' }}>Activa</span>;
      case 'RENOVADA':
        return <span className="badge" style={{ backgroundColor: '#0066CC' }}>Renovada</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: '#DC3545' }}>Cancelada</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

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
            <h2 className="fw-bold mb-0" style={{ color: '#003366' }}>
              Gestión de Pólizas
            </h2>
            <p className="text-muted mb-0">Administre las pólizas de sus clientes</p>
          </div>
        </div>
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

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#003366', color: 'white' }}>
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Tipo</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-end">Canon</th>
                  <th className="py-3 text-end">Prima</th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id} className="align-middle">
                    <td className="px-4">
                      <code className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {p.id.slice(0, 8)}...
                      </code>
                    </td>
                    <td>
                      <span className="fw-semibold">{p.clientName}</span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: p.type === 'INDIVIDUAL' ? '#0066CC' : '#FF6B00',
                        color: 'white',
                        padding: '6px 12px'
                      }}>
                        {p.type}
                      </span>
                    </td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td className="text-end fw-semibold" style={{ color: '#003366' }}>
                      ${p.canonAmount.toFixed(2)}
                    </td>
                    <td className="text-end" style={{ color: '#6C757D' }}>
                      ${p.premiumAmount.toFixed(2)}
                    </td>
                    <td className="text-center">
                      {p.status !== 'CANCELLED' && (
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleRenew(p.id)}
                            style={{ ...actionBtnBase, backgroundColor: '#FF6B00' }}
                            onMouseEnter={(e) => onBtnEnter(e, '#E05A00')}
                            onMouseLeave={(e) => onBtnLeave(e, '#FF6B00')}
                          >
                            <IconRefresh /> Renovar
                          </button>
                          <button
                            onClick={() => handleCancel(p.id)}
                            style={{ ...actionBtnBase, backgroundColor: '#DC3545' }}
                            onMouseEnter={(e) => onBtnEnter(e, '#B02A37')}
                            onMouseLeave={(e) => onBtnLeave(e, '#DC3545')}
                          >
                            <IconX /> Cancelar
                          </button>
                        </div>
                      )}
                      {p.status === 'CANCELLED' && (
                        <span className="badge" style={{ backgroundColor: '#6C757D' }}>
                          Cancelada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
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
        <p>Seguros Bolívar - Prueba Técnica</p>
      </div>
    </div>
  );
}
