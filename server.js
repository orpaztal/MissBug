import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { messageRoutes } from './api/message/message.routes.js'

const app = express()

// const corsOptions = {
// 	origin: [
// 		'http://127.0.0.1:5174', 'http://localhost:5174',
// 		'http://127.0.0.1:5173', 'http://localhost:5173'
// 	],
// 	credentials: true,
// }

app.use(cookieParser())
app.use(express.json()) 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [   'http://127.0.0.1:3000',
                    'http://localhost:3000',
                    'http://127.0.0.1:5173',
                    'http://localhost:5173'
                ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.all('*', setupAsyncLocalStorage)

// app.use(express.static('public'))
// app.use(cors(corsOptions))

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030

app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
