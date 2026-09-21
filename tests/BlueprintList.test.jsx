import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BlueprintList from '../src/components/BlueprintList.jsx'

describe('BlueprintList', () => {
  it('muestra un mensaje cuando no hay blueprints', () => {
    render(<BlueprintList items={[]} onSelect={() => {}} />)
    expect(screen.getByText(/No hay blueprints/i)).toBeInTheDocument()
  })

  it('renderiza una tarjeta por cada blueprint con su autor y cantidad de puntos', () => {
    const items = [
      { author: 'john', name: 'house', points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] },
      { author: 'john', name: 'garage', points: [] },
    ]
    render(<BlueprintList items={items} onSelect={() => {}} />)

    expect(screen.getByText('house')).toBeInTheDocument()
    expect(screen.getByText('garage')).toBeInTheDocument()
    expect(screen.getAllByText(/john/)).toHaveLength(2)
    expect(screen.getAllByText(/Ver detalle/i)).toHaveLength(2)
  })

  it('invoca onSelect con el blueprint correspondiente al hacer click', () => {
    const onSelect = vi.fn()
    const items = [{ author: 'john', name: 'house', points: [] }]
    render(<BlueprintList items={items} onSelect={onSelect} />)

    fireEvent.click(screen.getByText(/Ver detalle/i))

    expect(onSelect).toHaveBeenCalledWith(items[0])
  })
})
