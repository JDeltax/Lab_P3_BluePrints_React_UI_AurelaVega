import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ErrorBanner from '../src/components/ErrorBanner.jsx'

describe('ErrorBanner', () => {
  it('muestra el mensaje de error', () => {
    render(<ErrorBanner message="No se pudo conectar" />)
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo conectar')
  })

  it('llama onRetry al pulsar Reintentar', () => {
    const onRetry = vi.fn()
    render(<ErrorBanner message="Falló" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('no muestra el botón si no hay onRetry', () => {
    render(<ErrorBanner message="Falló" />)
    expect(screen.queryByRole('button', { name: /reintentar/i })).not.toBeInTheDocument()
  })
})