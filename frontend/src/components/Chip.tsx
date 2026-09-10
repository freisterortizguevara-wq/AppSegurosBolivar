// Chip suave: fondo tenue + texto y punto del color principal
// Usado para las columnas "Tipo" y "Estado" en la tabla de pólizas.

interface ChipProps {
  color: string;
  label: string;
}

export function Chip({ color, label }: ChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: `${color}1A`, // ~10% opacidad
        color,
        border: `1px solid ${color}40`,
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.2px',
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
