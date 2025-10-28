export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api',
    BOOK_SERVICE: process.env.NEXT_PUBLIC_BOOK_SERVICE || 'http://localhost:8082/api',
    ADMIN_SERVICE: process.env.NEXT_PUBLIC_ADMIN_SERVICE || 'http://localhost:8083/api',
    REVIEW_SERVICE: process.env.NEXT_PUBLIC_REVIEW_SERVICE || 'http://localhost:8084/api',
    MESSAGE_SERVICE: process.env.NEXT_PUBLIC_MESSAGE_SERVICE || 'http://localhost:8085/api',
};
