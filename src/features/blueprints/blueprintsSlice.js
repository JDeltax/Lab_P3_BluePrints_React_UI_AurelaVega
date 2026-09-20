import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import api from '../../services/apiClient.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async() => {
    const { data } = await api.get('/blueprints')
        // Se espera que la API retorne un arreglo de { author, name, points }
    return [...new Set(data.map((bp) => bp.author))]
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async(author) => {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return { author, items: data }
})

export const fetchBlueprint = createAsyncThunk(
    'blueprints/fetchBlueprint',
    async({ author, name }) => {
        const { data } = await api.get(
            `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
        )
        return data
    },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async(payload) => {
    const { data } = await api.post('/blueprints', payload)
    return data
})

// Cada thunk tiene su propio estado: { status: 'idle' | 'loading' | 'succeeded' | 'failed', error }
const idleRequest = () => ({ status: 'idle', error: null })

const start = (s, key) => {
    s.requests[key] = { status: 'loading', error: null }
}
const succeed = (s, key) => {
    s.requests[key] = { status: 'succeeded', error: null }
}
const fail = (s, key, action) => {
    s.requests[key] = { status: 'failed', error: action.error.message }
}

const slice = createSlice({
    name: 'blueprints',
    initialState: {
        authors: [],
        byAuthor: {},
        current: null,
        requests: {
            fetchAuthors: idleRequest(),
            fetchByAuthor: idleRequest(),
            fetchBlueprint: idleRequest(),
            createBlueprint: idleRequest(),
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // fetchAuthors
            .addCase(fetchAuthors.pending, (s) => start(s, 'fetchAuthors'))
            .addCase(fetchAuthors.fulfilled, (s, a) => {
                succeed(s, 'fetchAuthors')
                s.authors = a.payload
            })
            .addCase(fetchAuthors.rejected, (s, a) => fail(s, 'fetchAuthors', a))

        // fetchByAuthor
        .addCase(fetchByAuthor.pending, (s) => start(s, 'fetchByAuthor'))
            .addCase(fetchByAuthor.fulfilled, (s, a) => {
                succeed(s, 'fetchByAuthor')
                s.byAuthor[a.payload.author] = a.payload.items
            })
            .addCase(fetchByAuthor.rejected, (s, a) => fail(s, 'fetchByAuthor', a))

        // fetchBlueprint
        .addCase(fetchBlueprint.pending, (s) => start(s, 'fetchBlueprint'))
            .addCase(fetchBlueprint.fulfilled, (s, a) => {
                succeed(s, 'fetchBlueprint')
                s.current = a.payload
            })
            .addCase(fetchBlueprint.rejected, (s, a) => fail(s, 'fetchBlueprint', a))

        // createBlueprint
        .addCase(createBlueprint.pending, (s) => start(s, 'createBlueprint'))
            .addCase(createBlueprint.fulfilled, (s, a) => {
                succeed(s, 'createBlueprint')
                const bp = a.payload
                    // Solo se agrega si la lista de ese autor ya estaba cargada
                if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
            })
            .addCase(createBlueprint.rejected, (s, a) => fail(s, 'createBlueprint', a))
    },
})

// ---------- Selectores ----------

export const selectRequests = (state) => state.blueprints.requests

const selectByAuthorState = (state) => state.blueprints.byAuthor

// Top-5 de planos por cantidad de puntos. createSelector memoiza el resultado:
// solo se recalcula si cambia byAuthor.
export const selectTopBlueprints = createSelector([selectByAuthorState], (byAuthor) =>
    Object.values(byAuthor)
    .flat() // .flat() crea un arreglo nuevo, por eso .sort() no muta el estado de Redux
    .sort((a, b) => (b.points ? .length || 0) - (a.points ? .length || 0))
    .slice(0, 5),
)

export default slice.reducer