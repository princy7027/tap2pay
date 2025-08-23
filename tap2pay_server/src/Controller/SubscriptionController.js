
import paypal from 'paypal-rest-sdk'
import dotenv from 'dotenv'
import Subscription from '../Model/Subscription.js'
import mongoose from 'mongoose'
dotenv.config()

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
})

export const createPlan = async (req, res) => {
  const billingPlanAttributes = {
    name: 'Monthly Subscription Plan',
    description: 'Monthly plan for premium access',
    type: 'fixed',
    payment_definitions: [
      {
        name: 'Standard Plan',
        type: 'REGULAR',
        frequency: 'MONTH',
        frequency_interval: '1',
        amount: { currency: 'USD', value: '10.00' },
        cycles: '12',
      },
    ],
    merchant_preferences: {
      return_url: 'http://localhost:5173/subscription-success',
      cancel_url: 'http://localhost:5173/deshboard',
      auto_bill_amount: 'YES',
      initial_fail_amount_action: 'CONTINUE',
      max_fail_attempts: '1',
    },
  }

  paypal.billingPlan.create(billingPlanAttributes, (error, billingPlan) => {
    if (error) return res.status(500).json({ error })

    // Activate the plan
    const billingPlanUpdateAttributes = [
      {
        op: 'replace',
        path: '/',
        value: { state: 'ACTIVE' },
      },
    ]

    paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, (err) => {
      if (err) return res.status(500).json({ err })
      res.status(200).json({ message: 'Plan created and activated', id: billingPlan.id })
    })
  })
}

// Create subscription from plan
export const createSubscription = (req, res) => {
  const { planId } = req.body
  const billingAgreementAttributes = {
    name: 'Monthly Agreement',
    description: 'Agreement for Monthly Subscription',
    start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    plan: { id: planId },
    payer: { payment_method: 'paypal' },
  }

  paypal.billingAgreement.create(billingAgreementAttributes, (error, agreement) => {
    if (error) return res.status(500).json({ error })

    const approvalUrl = agreement.links.find(link => link.rel === 'approval_url')?.href
    res.status(200).json({ approvalUrl })
  })
}

// Execute after approval
export const executeSubscription = async (req, res) => {
  const { token } = req.query
  console.log("Recevied token", token);

  if (!token) {
    return res.status(400).json({ message: "Missing token in query" });
  }

  const userId = req.headers['userId'];

  paypal.billingAgreement.execute(token, {}, async (error, agreement) => {
    if (error) return res.status(400).json({ error: 'Invalid Payment Token', details: error.response });

    try {
      const subscription = new Subscription({
        userId,
        agreementId: agreement.id,
        // planId: agreement.plan.id,
        state: agreement.state,
        startDate: agreement.start_date,
        payerInfo: {
          email: agreement.payer.payer_info.email,
          payerId: agreement.payer.payer_info.payer_id,
          paymentMethod: agreement.payer.payment_method,
        },
      })

      await subscription.save();
      // return res.redirect('http://localhost:5173/subscription-success');
      return res.status(200).json({ message: 'Subscription successful', agreement })
    } catch (dbError) {
      res.status(500).json({ error: 'DB Save failed', details: dbError })
    }
  })
}
