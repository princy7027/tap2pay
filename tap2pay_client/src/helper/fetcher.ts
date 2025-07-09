// src/utils/fetchWrapper.js
import { toast } from 'react-hot-toast'

const API_BASE = 'http://localhost:3000/api/v1'

export const fetchWrapper = async (url, options = {}) => {
    const token = localStorage.getItem('authToken') // or use cookie

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `${token}` }),
        ...options.headers,
    }

    const fetchOptions = {
        ...options,
        headers,
    }

    try {
        const response = await fetch(`${API_BASE}${url}`, fetchOptions)

        const data = await response.json()
        if (data.code !== 200 && data.code !== 201) {
            toast.error(data.message || 'Something went wrong')
            throw new Error(data.message || 'Request failed')
        }

        return data
    } catch (error) {
        throw error
    }
}
