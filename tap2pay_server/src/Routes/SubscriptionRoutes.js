
import express from 'express'
import {
  createPlan,
  createSubscription,
  executeSubscription,
} from '../Controller/SubscriptionController.js'
import { verifyToken } from '../Helper/Core/JWT.js'

const router = express.Router()

// Create and activate PayPal billing plan
router.post('/plan', createPlan)

// Create subscription agreement for a user
router.post('/subscribe', createSubscription)

//kai che api?

// Execute subscription after user approves payment
router.get('/execute', verifyToken, executeSubscription)

export const subscriptionRouter = router
