import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import BlueprintCanvas from '../src/components/BlueprintCanvas.jsx'

describe('BlueprintCanvas', () => {
  it('renderiza un canvas y llama getContext', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
    const { container } = render(
      <BlueprintCanvas
        points={[
          { x: 10, y: 10 },
          { x: 50, y: 60 },
        ]}
      />,
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('llama onAddPoint con las coordenadas del canvas al hacer clic', () => {
    const onAddPoint = vi.fn()
    const { container } = render(<BlueprintCanvas onAddPoint={onAddPoint} />)
    const canvas = container.querySelector('canvas')
    // jsdom no calcula layout: se simula un canvas mostrado a tamaño real, en la posición (10, 20)
    canvas.getBoundingClientRect = () => ({ left: 10, top: 20, width: 520, height: 360 })

    fireEvent.click(canvas, { clientX: 110, clientY: 70 })

    expect(onAddPoint).toHaveBeenCalledWith({ x: 100, y: 50 })
  })

  it('escala las coordenadas cuando el canvas se muestra más pequeño que su tamaño real', () => {
    const onAddPoint = vi.fn()
    const { container } = render(<BlueprintCanvas onAddPoint={onAddPoint} />)
    const canvas = container.querySelector('canvas')
    // Mostrado a la mitad (260×180) mientras el canvas mide 520×360
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 260, height: 180 })

    fireEvent.click(canvas, { clientX: 50, clientY: 40 })

    expect(onAddPoint).toHaveBeenCalledWith({ x: 100, y: 80 })
  })
})