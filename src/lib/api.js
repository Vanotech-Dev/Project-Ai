import axios from 'axios'

/**
 * Centralized Axios instance.
 *
 * - Development : VITE_API_URL is empty → requests go to the Vite dev proxy
 *                 (relative paths like "/api/…" are forwarded to localhost:5000)
 * - Production  : VITE_API_URL points to the deployed backend
 *                 (e.g. "https://your-backend.railway.app")
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,   // Required for better-auth session cookies
})

export default api
