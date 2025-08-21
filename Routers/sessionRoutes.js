import express from "express"
import {
    createSession,
    getMySessions,
    getSessionById,
    deleteSession
} from '../controllers/sessioncontroller.js'


import protect from "../Middleware/authMiddleware.js"

const router = express.Router()


router.post('/create', protect, createSession)
router.get('/my-sessions', protect, getMySessions)
router.get('/:id', protect, getSessionById)
router.delete('/:id', protect, deleteSession)

export default router