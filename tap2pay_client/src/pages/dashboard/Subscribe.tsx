// src/pages/dashboard/Subscribe.tsx

import { useEffect, useState } from 'react'
import axios from 'axios'

const Subscribe = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')
    try {
      // Step 1: create plan (1 time or you can store planId in backend)
      const planRes = await axios.post('http://localhost:3000/api/v1/subscription/plan')
      const planId = planRes.data.id

      // Step 2: generate approval URL using planId
      const subRes = await axios.post('http://localhost:3000/api/v1/subscription/subscribe', { planId })
      const { approvalUrl } = subRes.data

      // Step 3: redirect user to PayPal approval
      window.location.href = approvalUrl
    } catch (err: any) {
      console.error(err)
      setError('Subscription failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Subscribe to Premium Plan</h2>
      <p>Get access to all products for just $10/month!</p>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Redirecting to PayPal...' : 'Subscribe Now'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Subscribe
