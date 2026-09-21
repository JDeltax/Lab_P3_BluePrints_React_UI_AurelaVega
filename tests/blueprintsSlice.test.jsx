import { describe, it, expect } from 'vitest'
import reducer, {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  createBlueprint,
} from '../src/features/blueprints/blueprintsSlice.js'

const initialState = {
  authors: [],
  byAuthor: {},
  current: null,
  status: 'idle',
  error: null,
}

describe('blueprints slice (reducers puros)', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state).toEqual(initialState)
  })

  it('ignora acciones desconocidas y no muta el estado', () => {
    const state = reducer(initialState, { type: 'algo/inexistente' })
    expect(state).toBe(initialState)
  })

  describe('fetchAuthors', () => {
    it('pending pone status en loading', () => {
      const state = reducer(initialState, { type: fetchAuthors.pending.type })
      expect(state.status).toBe('loading')
    })

    it('fulfilled guarda los autores y marca succeeded', () => {
      const state = reducer(
        { ...initialState, status: 'loading' },
        { type: fetchAuthors.fulfilled.type, payload: ['john', 'jane'] },
      )
      expect(state.status).toBe('succeeded')
      expect(state.authors).toEqual(['john', 'jane'])
    })

    it('rejected marca failed y guarda el mensaje de error', () => {
      const state = reducer(
        { ...initialState, status: 'loading' },
        { type: fetchAuthors.rejected.type, error: { message: 'network error' } },
      )
      expect(state.status).toBe('failed')
      expect(state.error).toBe('network error')
    })
  })

  describe('fetchByAuthor', () => {
    it('fulfilled indexa los blueprints bajo el autor consultado', () => {
      const items = [{ author: 'john', name: 'house', points: [] }]
      const state = reducer(initialState, {
        type: fetchByAuthor.fulfilled.type,
        payload: { author: 'john', items },
      })
      expect(state.byAuthor.john).toEqual(items)
    })

    it('no afecta blueprints de otros autores ya cargados', () => {
      const prev = { ...initialState, byAuthor: { jane: [{ name: 'car' }] } }
      const state = reducer(prev, {
        type: fetchByAuthor.fulfilled.type,
        payload: { author: 'john', items: [{ name: 'house' }] },
      })
      expect(state.byAuthor.jane).toEqual([{ name: 'car' }])
      expect(state.byAuthor.john).toEqual([{ name: 'house' }])
    })
  })

  describe('fetchBlueprint', () => {
    it('fulfilled guarda el blueprint actual', () => {
      const bp = { author: 'john', name: 'house', points: [{ x: 1, y: 2 }] }
      const state = reducer(initialState, { type: fetchBlueprint.fulfilled.type, payload: bp })
      expect(state.current).toEqual(bp)
    })
  })

  describe('createBlueprint', () => {
    it('fulfilled agrega el blueprint a la lista existente del autor', () => {
      const prev = { ...initialState, byAuthor: { john: [{ name: 'house' }] } }
      const bp = { author: 'john', name: 'garage' }
      const state = reducer(prev, { type: createBlueprint.fulfilled.type, payload: bp })
      expect(state.byAuthor.john).toEqual([{ name: 'house' }, bp])
    })

    it('fulfilled no falla si el autor aún no tiene lista cargada', () => {
      const bp = { author: 'newauthor', name: 'garage' }
      const state = reducer(initialState, { type: createBlueprint.fulfilled.type, payload: bp })
      expect(state.byAuthor).toEqual({})
    })
  })
})
