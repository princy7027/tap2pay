import { loginUser, registerUser } from '../Controller/UserController.js'
import { Router } from 'express'
import { fraudDetection } from '../Middleware/fraudDetection.js'

const router = Router()

//create user apiend point
router.post('/register', fraudDetection,registerUser)

//login using auth0
router.post('/login', fraudDetection,loginUser)

export const authRoutes = router