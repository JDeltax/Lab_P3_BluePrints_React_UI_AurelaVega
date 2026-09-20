import blueprintsApiClient from './Blueprintsapiclient.js'
import blueprintsApiMock from './Blueprintsapimock.js'

// La línea que decide todo: VITE_USE_MOCK=true → datos en memoria; cualquier otro valor → API real.
// Vite entrega las variables de .env como texto, por eso se compara con la cadena 'true'.
const blueprintsService =
    import.meta.env.VITE_USE_MOCK === 'true' ? blueprintsApiMock : blueprintsApiClient

export default blueprintsService