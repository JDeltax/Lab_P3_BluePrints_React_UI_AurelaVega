import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import { createBlueprint, selectRequests } from '../features/blueprints/blueprintsSlice.js'

export default function NewBlueprintPage() {
  const dispatch = useDispatch()
  const saving = useSelector(selectRequests).createBlueprint.status === 'loading'

  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  // El borrador vive en estado local: es temporal de esta pantalla y solo pasa a Redux al guardar.
  const [points, setPoints] = useState([])
  const [feedback, setFeedback] = useState(null) // { type: 'ok' | 'error', text }

  const canSave = author.trim() && name.trim() && points.length >= 2 && !saving

  const addPoint = (point) => {
    setFeedback(null)
    setPoints((prev) => [...prev, point])
  }
  const undoLast = () => setPoints((prev) => prev.slice(0, -1))
  const clear = () => setPoints([])

  const save = async (e) => {
    e.preventDefault()
    if (!canSave) return
    const blueprint = { author: author.trim(), name: name.trim(), points }
    try {
      // dispatch() de un thunk nunca rechaza; unwrap() sí lanza el error si la petición falló.
      await dispatch(createBlueprint(blueprint)).unwrap()
      setFeedback({ type: 'ok', text: `Plano ${blueprint.author}/${blueprint.name} guardado.` })
      setName('')
      setPoints([])
    } catch (err) {
      setFeedback({
        type: 'error',
        text: `No se pudo guardar: ${err.message}. Un 403 puede ser falta del permiso blueprints.write o que el plano ya exista.`,
      })
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <h2 style={{ marginTop: 0 }}>Nuevo plano</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          className="input"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="input"
          placeholder="Blueprint name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <p style={{ marginTop: 0 }}>
        Haz clic en el lienzo para agregar puntos. Puntos: {points.length}
        {points.length < 2 && ' (se necesitan al menos 2 para guardar)'}
      </p>
      <BlueprintCanvas points={points} onAddPoint={addPoint} />

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button type="submit" className="btn primary" disabled={!canSave}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="btn" onClick={undoLast} disabled={!points.length}>
          Deshacer
        </button>
        <button type="button" className="btn" onClick={clear} disabled={!points.length}>
          Limpiar
        </button>
      </div>

      {feedback && (
        <p style={{ color: feedback.type === 'ok' ? '#4ade80' : '#ef4444' }}>{feedback.text}</p>
      )}
    </form>
  )
}