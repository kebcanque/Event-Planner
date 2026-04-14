const BASE_URL = 'http://localhost:5000/api';

export const authApi = {
    async login(username, password) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    }
};

export const eventApi = {
    async getAll(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${BASE_URL}/events?${query}`);
        return response.json();
    },

    async getStats(user_id) {
        const response = await fetch(`${BASE_URL}/events/stats?user_id=${user_id}`);
        return response.json();
    },

    async create(eventData) {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
        }
        return response.json();
    },

    async update(id, eventData) {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    async archive(id) {
        const response = await fetch(`${BASE_URL}/events/${id}/archive`, {
            method: 'PATCH'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to archive event');
        }
        return response.json();
    },

    async restore(id) {
        const response = await fetch(`${BASE_URL}/events/${id}/restore`, {
            method: 'PATCH'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to restore event');
        }
        return response.json();
    }
};

export const guestApi = {
    async getByEvent(eventId) {
        const response = await fetch(`${BASE_URL}/guests/event/${eventId}`);
        return response.json();
    },

    async add(guestData) {
        const response = await fetch(`${BASE_URL}/guests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestData)
        });
        return response.json();
    },

    async update(id, guestData) {
        const response = await fetch(`${BASE_URL}/guests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestData)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${BASE_URL}/guests/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

export const taskApi = {
    async getByEvent(eventId) {
        const response = await fetch(`${BASE_URL}/tasks/event/${eventId}`);
        return response.json();
    },

    async add(taskData) {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return response.json();
    },

    async update(id, taskData) {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

export const archiveApi = {
    async getLogs(userId) {
        const response = await fetch(`${BASE_URL}/archives?user_id=${userId}`);
        return response.json();
    }
};
