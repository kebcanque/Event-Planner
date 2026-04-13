import { eventApi } from './api.js';

const elements = {
    eventTableBody: document.getElementById('event-table-body'),
    totalEvents: document.getElementById('total-events'),
    upcomingEvents: document.getElementById('upcoming-events'),
    remainingSlots: document.getElementById('remaining-slots'),
    searchBtn: document.getElementById('search-btn'),
    searchInput: document.getElementById('search-input'),
    locationFilter: document.getElementById('location-filter'),
    addEventBtn: document.getElementById('add-event-btn'),
    modal: document.getElementById('event-modal'),
    closeModal: document.querySelector('.close'),
    eventForm: document.getElementById('event-form'),
    modalTitle: document.getElementById('modal-title'),
    statusGroup: document.getElementById('status-group'),
    eventIdInput: document.getElementById('event-id')
};

let allEvents = [];

async function loadDashboard() {
    try {
        const stats = await eventApi.getStats();
        elements.totalEvents.textContent = stats.totalEvents;
        elements.upcomingEvents.textContent = stats.upcomingThisWeek;
        elements.remainingSlots.textContent = stats.remainingSlots;

        allEvents = await eventApi.getAll();
        renderEvents(allEvents);
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

function renderEvents(events) {
    elements.eventTableBody.innerHTML = '';
    events.forEach(event => {
        const date = new Date(event.event_date).toLocaleString();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${date}</td>
            <td>${event.location || 'N/A'}</td>
            <td><span class="badge badge-${event.status.toLowerCase()}">${event.status}</span></td>
            <td>$${parseFloat(event.budget || 0).toFixed(2)}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${event.event_id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="archive-btn" data-id="${event.event_id}" title="Archive"><i class="fas fa-archive"></i></button>
                <button class="delete-btn" data-id="${event.event_id}" title="Delete Permanently"><i class="fas fa-trash"></i></button>
            </td>
        `;
        elements.eventTableBody.appendChild(row);
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => openEditModal(btn.dataset.id);
    });
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.onclick = () => archiveEvent(btn.dataset.id);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => deleteEvent(btn.dataset.id);
    });
}

async function handleSearch() {
    const search = elements.searchInput.value;
    const location = elements.locationFilter.value;
    try {
        const filteredEvents = await eventApi.getAll({ search, location });
        renderEvents(filteredEvents);
    } catch (err) {
        console.error('Search error:', err);
    }
}

function openAddModal() {
    elements.modalTitle.textContent = 'Create New Event';
    elements.eventForm.reset();
    elements.eventIdInput.value = '';
    elements.statusGroup.style.display = 'none';
    elements.modal.style.display = 'block';
}

function openEditModal(id) {
    const event = allEvents.find(e => e.event_id == id);
    if (!event) return;

    elements.modalTitle.textContent = 'Edit Event';
    elements.eventIdInput.value = event.event_id;
    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    
    // Format date for datetime-local input
    const date = new Date(event.event_date);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('event_date').value = localDate;
    
    document.getElementById('location').value = event.location;
    document.getElementById('budget').value = event.budget;
    document.getElementById('status').value = event.status;
    
    elements.statusGroup.style.display = 'block';
    elements.modal.style.display = 'block';
}

async function saveEvent(e) {
    e.preventDefault();
    const id = elements.eventIdInput.value;
    const eventData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        event_date: document.getElementById('event_date').value,
        location: document.getElementById('location').value,
        budget: document.getElementById('budget').value,
        status: document.getElementById('status').value
    };

    try {
        if (id) {
            await eventApi.update(id, eventData);
        } else {
            await eventApi.create(eventData);
        }
        elements.modal.style.display = 'none';
        loadDashboard();
    } catch (err) {
        alert(err.message);
    }
}

async function archiveEvent(id) {
    if (confirm('Are you sure you want to archive this event? It will no longer count towards your 100-event limit.')) {
        try {
            await eventApi.archive(id);
            loadDashboard();
        } catch (err) {
            console.error('Archive error:', err);
        }
    }
}

async function deleteEvent(id) {
    if (confirm('Are you sure you want to PERMANENTLY delete this event?')) {
        try {
            await eventApi.delete(id);
            loadDashboard();
        } catch (err) {
            console.error('Delete error:', err);
        }
    }
}

// Event Listeners
elements.addEventBtn.onclick = openAddModal;
elements.closeModal.onclick = () => elements.modal.style.display = 'none';
window.onclick = (event) => { if (event.target == elements.modal) elements.modal.style.display = 'none'; };
elements.eventForm.onsubmit = saveEvent;
elements.searchBtn.onclick = handleSearch;
elements.searchInput.onkeyup = (e) => { if (e.key === 'Enter') handleSearch(); };

// Initial Load
document.addEventListener('DOMContentLoaded', loadDashboard);
