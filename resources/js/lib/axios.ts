import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
    baseURL: "/",
    timeout: 10000, // 10 seconds
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Request interceptor - Add CSRF token and other headers
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get CSRF token from meta tag
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (csrfToken) {
            config.headers["X-CSRF-TOKEN"] = csrfToken;
        }

        // Don't add X-Inertia header for axios requests
        // This ensures they're treated as regular AJAX requests, not Inertia requests
        // Remove it if it was set elsewhere
        if (config.headers["X-Inertia"]) {
            delete config.headers["X-Inertia"];
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle 419 CSRF token mismatch
        if (error.response?.status === 419) {
            // Reload the page to get a new CSRF token
            window.location.reload();
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Redirect to login
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            // Could show a toast or redirect
            console.error("Access forbidden");
            return Promise.reject(error);
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error("Server error:", error.response.data);
            return Promise.reject(error);
        }

        // Handle validation errors (422)
        if (error.response?.status === 422) {
            // Validation errors are handled in components
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
