import { Chip } from './Chip';

// Traduce el status crudo del backend (ACTIVE, RENOVADA, CANCELLED...)
// al Chip visual correspondiente.
export function StatusChip({ status }: { status: string }) {
  switch (status) {
    case 'ACTIVE':
      return <Chip color="#28A745" label="Activa" />;
    case 'RENOVADA':
      return <Chip color="#0066CC" label="Renovada" />;
    case 'CANCELLED':
      return <Chip color="#DC3545" label="Cancelada" />;
    default:
      return <Chip color="#6C757D" label={status} />;
  }
}
