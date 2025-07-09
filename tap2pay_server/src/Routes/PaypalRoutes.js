import { createCheckoutSession, executePayment, getProducts, getPurchases } from '../Controller/PaypalController.js'
import { Router } from 'express'
import { verifyToken } from '../Helper/Core/JWT.js'

const router = Router()

router.get('/get-products', getProducts)

router.get('/get-purchases', verifyToken, getPurchases)

// create user apiend point
router.post('/create-checkout', createCheckoutSession)

//login using auth0
router.post('/execute-payment', verifyToken, executePayment)

export const paypalRoutes = router