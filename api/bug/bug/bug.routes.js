import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug, addBugMsg, removeBugMsg } from './bug.controller.js'
import { requireAuth } from '../../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireAuth ,removeBug)
router.put('/:bugId', requireAuth ,updateBug)
router.post('/', requireAuth ,addBug)

// router.post('/:id/msg', requireAuth, addBugMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeBugMsg)

export const bugRoutes = router