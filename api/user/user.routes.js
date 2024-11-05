import express from 'express'
import { getUsers, getUser, removeUser, updateUser, addUser } from './user.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

// router.get('/', getUsers)
// router.get('/:userId', getUser)
// router.delete('/:userId', removeUser)
// router.put('/:userId', updateUser)
// router.post('/', addUser)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, removeUser)


export const userRoutes = router