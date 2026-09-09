import { useEffect, useState } from 'react';
import { policyApi } from '../api/policyApi';
import type { Policy } from '../types';

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
        <div className="col-12">
          <h2 className="fw-bold" style={{ color: '#003366' }}>
            📋 Gestión de Pólizas
          </h2>
          <p className="text-muted">Administre las pólizas de sus clientes</p>
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
                className="btn w-100"
                onClick={loadPolicies}
                style={{ backgroundColor: '#003366', color: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066CC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#003366';
                }}
              >
                🔍 Buscar
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
                            className="btn btn-sm"
                            onClick={() => handleRenew(p.id)}
                            style={{ 
                              backgroundColor: '#FF6B00', 
                              color: 'white',
                              border: 'none',
                              padding: '6px 14px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E05A00';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FF6B00';
                            }}
                          >
                            🔄 Renovar
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleCancel(p.id)}
                            style={{ 
                              backgroundColor: '#DC3545', 
                              color: 'white',
                              border: 'none',
                              padding: '6px 14px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#B02A37';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#DC3545';
                            }}
                          >
                            ✖ Cancelar
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
        <div className="alert alert-info mt-4 text-center" role="alert">
          <h5>📭 No hay pólizas registradas</h5>
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