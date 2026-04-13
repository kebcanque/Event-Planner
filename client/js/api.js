const BASE_URL = 'http://localhost:5000/api';

export const eventApi = {
    async getAll(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${BASE_URL}/events?${query}`);
        return response.json();
    },

    async getStats() {
        const response = await fetch(`${BASE_URL}/events/stats`);
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
        return response.json();
    }
};
