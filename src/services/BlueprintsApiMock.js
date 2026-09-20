// Implementación de prueba: datos en memoria, sin backend.
// Tiene la misma interfaz y los mismos errores (404, 403) que blueprintsApiClient.

const db = [{
        author: 'john',
        name: 'house',
        points: [
            { x: 60, y: 60 },
            { x: 260, y: 60 },
            { x: 260, y: 240 },
            { x: 60, y: 240 },
            { x: 60, y: 60 },
        ],
    },
    {
        author: 'john',
        name: 'triangle',
        points: [
            { x: 260, y: 40 },
            { x: 420, y: 300 },
            { x: 100, y: 300 },
            { x: 260, y: 40 },
        ],
    },
    {
        author: 'jane',
        name: 'diagonal',
        points: [
            { x: 30, y: 30 },
            { x: 480, y: 320 },
        ],
    },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// Redux Toolkit "congela" los objetos que guarda en el estado. Si el mock devolviera sus
// propios objetos, quedarían congelados y no se podrían modificar después. Por eso se devuelven copias.
const copy = (value) => JSON.parse(JSON.stringify(value))

// Imita la forma del error de Axios (err.response.status) para que la UI no note la diferencia.
const httpError = (status, message) => {
    const err = new Error(message)
    err.response = { status, data: { error: message } }
    return err
}

const blueprintsApiMock = {
    async getAll() {
        await delay()
        return copy(db)
    },

    async getByAuthor(author) {
        await delay()
        const items = db.filter((bp) => bp.author === author)
        if (!items.length) throw httpError(404, `No existen blueprints para el autor ${author}`)
        return copy(items)
    },

    async getByAuthorAndName(author, name) {
        await delay()
        const bp = db.find((b) => b.author === author && b.name === name)
        if (!bp) throw httpError(404, `No existe el blueprint ${author}/${name}`)
        return copy(bp)
    },

    async create(blueprint) {
        await delay()
        if (db.some((b) => b.author === blueprint.author && b.name === blueprint.name)) {
            throw httpError(403, `El blueprint ${blueprint.author}/${blueprint.name} ya existe`)
        }
        const created = { points: [], ...blueprint }
        db.push(copy(created))
        return copy(created)
    },

    async addPoint(author, name, point) {
        await delay()
        const bp = db.find((b) => b.author === author && b.name === name)
        if (!bp) throw httpError(404, `No existe el blueprint ${author}/${name}`)
        bp.points.push({ x: point.x, y: point.y })
        return copy(point)
    },

    async remove(author, name) {
        await delay()
        const index = db.findIndex((b) => b.author === author && b.name === name)
        if (index === -1) throw httpError(404, `No existe el blueprint ${author}/${name}`)
        db.splice(index, 1)
    },
}

export default blueprintsApiMock