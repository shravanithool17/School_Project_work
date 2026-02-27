import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    verifyToken: async () => {
        const response = await api.get('/auth/verify');
        return response.data;
    }
};

// User authentication services
export const userService = {
    register: async (data) => {
        const response = await api.post('/users/register', data);
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (formData) => {
        const response = await api.put('/users/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    changePassword: async (current_password, new_password) => {
        const response = await api.post('/users/change-password', {
            current_password,
            new_password
        });
        return response.data;
    }
};

export const facultyService = {
    getAll: async () => {
        const response = await api.get('/faculty');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/faculty/${id}`);
        return response.data;
    },

    create: async (formData) => {
        const response = await api.post('/faculty', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    update: async (id, formData) => {
        const response = await api.put(`/faculty/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/faculty/${id}`);
        return response.data;
    }
};

export const eventsService = {
    getAll: async (type) => {
        const response = await api.get('/events', { params: { type } });
        return response.data;
    },

    getAllAdmin: async () => {
        const response = await api.get('/events/admin/all');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    create: async (formData) => {
        const response = await api.post('/events', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    update: async (id, formData) => {
        const response = await api.put(`/events/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    }
};

export const galleryService = {
    getAll: async (category) => {
        const response = await api.get('/gallery', { params: { category } });
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/gallery/categories');
        return response.data;
    },

    upload: async (formData) => {
        const response = await api.post('/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    }
};

export const admissionsService = {
    submit: async (data) => {
        const response = await api.post('/admissions', data);
        return response.data;
    },

    getAll: async (status) => {
        const response = await api.get('/admissions', { params: { status } });
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/admissions/${id}`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admissions/${id}`);
        return response.data;
    }
};

export const contactService = {
    submit: async (data) => {
        const response = await api.post('/contact', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/contact');
        return response.data;
    },

    reply: async (id, reply_message) => {
        const response = await api.post(`/contact/${id}/reply`, { reply_message });
        return response.data;
    },

    getReplies: async (id) => {
        const response = await api.get(`/contact/${id}/replies`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    }
};

export const announcementsService = {
    getActive: async () => {
        const response = await api.get('/announcements/active');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/announcements', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/announcements/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    }
};

