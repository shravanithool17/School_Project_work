const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000');

export const getUploadUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
    return `${SERVER_URL}/uploads/${filename}`;
};

export default SERVER_URL;
