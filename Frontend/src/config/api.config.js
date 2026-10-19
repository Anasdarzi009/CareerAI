/**
 * Application API Configuration
 * Supports production API deployment via VITE_API_BASE_URL.
 * Falls back to local development URL (http://localhost:3000).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
