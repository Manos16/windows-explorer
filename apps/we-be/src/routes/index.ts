import { Elysia } from 'elysia'
import { folderRoutes } from './folder.routes'
import { fileRoutes } from './file.routes'

export const registerRoutes = (app: Elysia) => {
    app.group('/api/v1', (v1) => {
        folderRoutes(v1)
        fileRoutes(v1)
        return v1
    })
}
