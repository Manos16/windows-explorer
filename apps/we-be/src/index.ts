import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .get('/', () => 'API OK')
    .get('/folders', () => {
        return [
            { id: 1, name: 'Documents', parentId: null },
            { id: 2, name: 'Pictures', parentId: null },
            { id: 3, name: 'Work', parentId: 1 },
        ]
    })
    .listen(3000)

console.log(`🦊 Backend running at http://${app.server?.hostname}:${app.server?.port}`)
