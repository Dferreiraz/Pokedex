import './style.css'

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message">
            <div className="error-icon">⚠️</div>
            <h3>Ops! Algo deu errado</h3>
            <p>{message || 'Não foi possível carregar o Pokémon'}</p>
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    Tentar novamente
                </button>
            )}
        </div>
    )
}

export default ErrorMessage
