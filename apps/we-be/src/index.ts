import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { env } from "./config/env";
import cors from "@elysiajs/cors";
import {registerRoutes} from "./routes"

const app = new Elysia()
    .use(cors({
        origin: '*',
    }))
    .use(swagger({
        path: '/swagger',
        documentation: {
            info: {
                title: 'Windows Explorer API',
                version: '1.0.0'
            }
        }
    }))

registerRoutes(app)

app.listen(env.port)

console.log(`🦊 Backend running at http://${app.server?.hostname}:${app.server?.port}`)
