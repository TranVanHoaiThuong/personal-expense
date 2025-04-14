import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true // This is required for Laravel sanctum/csrf protection
});

// Tự động lấy CSRF token từ meta tag
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

export default axiosInstance;