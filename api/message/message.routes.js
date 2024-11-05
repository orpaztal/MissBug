import express from 'express'

import { log } from '../../middlewares/log.middleware.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'
import { addMessage, getMessages, deleteMessage } from './message.controller.js'

const router = express.Router()

router.get('/', log, getMessages)
router.post('/', log, requireAuth, addMessage)
router.delete('/:id',  requireAuth, deleteMessage)

export const messageRoutes = router