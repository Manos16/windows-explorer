export const env = {
    apiUrl: import.meta.env.VITE_API_URL,
    apiVersion: import.meta.env.VITE_API_VERSION || '/api/v1',
    appName: import.meta.env.VITE_APP_NAME,
    env: import.meta.env.VITE_ENV || 'development',
}

// Helper untuk membangun full base URL API
export const getBaseApiUrl = () => {
    const base = env.apiUrl.endsWith('/') ? env.apiUrl.slice(0, -1) : env.apiUrl
    const version = env.apiVersion.startsWith('/') ? env.apiVersion : `/${env.apiVersion}`
    return `${base}${version}`
}
