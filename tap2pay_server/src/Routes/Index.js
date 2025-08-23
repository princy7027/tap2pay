import express from 'express'
import { authRoutes } from './AuthRoutes.js';
import { paypalRoutes } from './PaypalRoutes.js';
import { subscriptionRouter } from './SubscriptionRoutes.js';
import { fraudDetection } from '../Middleware/fraudDetection.js';
import { productRoutes } from './productRoutes.js';

const router = express.Router()

// Auth route
router.use('/auth', authRoutes)

router.use('/paypal',paypalRoutes)
router.use('/product',productRoutes)
router.use('/subscription',subscriptionRouter)

export default router;