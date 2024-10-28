import express from 'express'
import { getBugs, getBug, removeBug, updateBug, addBug } from './bug.controller.js'
import { requireAuth } from '../../../middlewares/require-auth.middleware.js'
const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireAuth ,removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)

export const bugRoutes = router