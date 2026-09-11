import { useEffect, useState } from 'react';
import { policyApi } from '../api/policyApi';
import type { Policy } from '../types';

// Toda la lógica de datos de la pantalla de pólizas vive aquí:
// carga, filtros, renovar y cancelar. El componente PolicyList solo
// consume lo que este hook expone y se encarga del JSX.
export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        alert(' Póliza renovada exitosamente');
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
        alert(' Póliza cancelada exitosamente');
      } catch (error) {
        alert('❌ Error al cancelar póliza');
      }
    }
  };

  return {
    policies,
    loading,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    loadPolicies,
    handleRenew,
    handleCancel,
  };
}
