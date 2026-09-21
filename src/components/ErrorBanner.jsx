// Banner de error reutilizable. Si recibe `onRetry`, muestra el botón "Reintentar".
export default function ErrorBanner({ message, onRetry }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        marginBottom: 12,
        borderRadius: 8,
        border: '1px solid #ef4444',
        background: 'rgba(239, 68, 68, 0.12)',
        color: '#fecaca',
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}