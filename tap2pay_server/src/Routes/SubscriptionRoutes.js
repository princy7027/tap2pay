
import express from 'express'
import {
  createPlan,
  createSubscription,
  executeSubscription,
} from '../Controller/SubscriptionController.js'

const router = express.Router()

// Create and activate PayPal billing plan
router.post('/plan', createPlan)

// Create subscription agreement for a user
router.post('/subscribe', createSubscription)

// Execute subscription after user approves payment
router.get('/execute', executeSubscription)

export const subscriptionRouter = router
