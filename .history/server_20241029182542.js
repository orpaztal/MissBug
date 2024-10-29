import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

const app = express()

const corsOptions = {
	origin: [
		'http://127.0.0.1:5174', 'http://localhost:5174',
		'http://127.0.0.1:5173', 'http://localhost:5173'
	],
	credentials: true,
}

app.use(cookieParser())
app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(express.json()) 

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

const port = process3030

app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
