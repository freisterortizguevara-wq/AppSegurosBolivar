import type { CSSProperties, MouseEvent } from 'react';

// Estilo "outline" corporativo para los botones Renovar / Cancelar.
export const actionBtnBase: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1.5px solid',
  padding: '7px 14px',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.82rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
  cursor: 'pointer',
};

// tone: color principal del botón (borde/texto en reposo, fondo al hover)
export function onBtnEnter(e: MouseEvent<HTMLButtonElement>, tone: string) {
  e.currentTarget.style.backgroundColor = tone;
  e.currentTarget.style.color = '#FFFFFF';
  e.currentTarget.style.boxShadow = `0 2px 8px ${tone}55`;
}

export function onBtnLeave(e: MouseEvent<HTMLButtonElement>, tone: string) {
  e.currentTarget.style.backgroundColor = '#FFFFFF';
  e.currentTarget.style.color = tone;
  e.currentTarget.style.boxShadow = 'none';
}
