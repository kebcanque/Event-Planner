import { eventApi, guestApi, taskApi, archiveApi } from './api.js';

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
    eventForm: document.getElementById('event-form'),
    modalTitle: document.getElementById('modal-title'),
    statusGroup: document.getElementById('status-group'),
    eventIdInput: document.getElementById('event-id'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    logoutBtn: document.getElementById('logout-btn'),
    userDisplayName: document.getElementById('user-display-name'),
    userAvatar: document.getElementById('user-avatar'),
    navItems: document.querySelectorAll('.nav-item'),
    contentHeader: document.querySelector('.welcome-section h2'),
    contentSubtitle: document.querySelector('.welcome-section p'),
    overviewCards: document.querySelector('.overview-cards'),
    eventsSectionTitle: document.getElementById('section-title'),
    tableHead: document.getElementById('table-head'),
    headerActions: document.querySelector('.header-actions'),
    
    // Guest Modal Elements
    guestModal: document.getElementById('guest-modal'),
    guestForm: document.getElementById('guest-form'),
    guestTableBody: document.getElementById('guest-table-body'),
    guestEventTitle: document.getElementById('guest-event-title'),
    guestEventId: document.getElementById('guest-event-id'),
    
    // Task Modal Elements
    taskModal: document.getElementById('task-modal'),
    taskForm: document.getElementById('task-form'),
    taskTableBody: document.getElementById('task-table-body'),
    taskEventTitle: document.getElementById('task-event-title'),
    taskEventId: document.getElementById('task-event-id')
};

let allEvents = [];
let currentUser = JSON.parse(localStorage.getItem('user'));
let currentView = 'dashboard'; // 'dashboard', 'archives', 'guests', 'tasks', 'events'

function checkAuth() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    if (elements.userDisplayName) {
        elements.userDisplayName.textContent = currentUser.username;
    }
    if (elements.userAvatar) {
        elements.userAvatar.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=6c5ce7&color=fff`;
    }
    return true;
}

async function loadDashboard() {
    if (!checkAuth()) return;

    try {
        const stats = await eventApi.getStats(currentUser.user_id);
        if (elements.totalEvents) elements.totalEvents.textContent = stats.totalEvents;
        if (elements.upcomingEvents) elements.upcomingEvents.textContent = stats.upcomingThisWeek;
        if (elements.remainingSlots) {
            elements.remainingSlots.textContent = stats.remainingSlots;
        }

        // Attach global listener once
        attachGlobalEventListeners();

        await fetchAndRenderData();
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

async function fetchAndRenderData() {
    try {
        const search = elements.searchInput.value;
        const location = elements.locationFilter.value;
        const isArchived = currentView === 'archives';
        
        allEvents = await eventApi.getAll({ 
            user_id: currentUser.user_id, 
            is_archived: isArchived,
            search,
            location
        });
        
        if (currentView === 'guests') {
            await renderAllGuests(allEvents);
        } else if (currentView === 'tasks') {
            await renderAllTasks(allEvents);
        } else {
            renderEvents(allEvents);
        }
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

function renderEvents(events) {
    const isDashboard = currentView === 'dashboard';
    const isArchives = currentView === 'archives';
    const showActions = !isDashboard;
    
    elements.tableHead.innerHTML = `
        <tr>
            <th>Event Name</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Status</th>
            <th>Budget</th>
            ${showActions ? '<th>Actions</th>' : ''}
        </tr>
    `;
    elements.eventTableBody.innerHTML = '';
    events.forEach(event => {
        const date = new Date(event.event_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        const row = document.createElement('tr');
        
        let actionsHtml = '';
        if (showActions) {
            if (isArchives) {
                actionsHtml = `
                    <div class="actions-cell">
                        <button class="icon-btn restore-btn" data-id="${event.event_id}" title="Restore"><i class="fas fa-rotate-left"></i></button>
                        <button class="icon-btn delete-btn" data-id="${event.event_id}" title="Delete"><i class="fas fa-trash-can"></i></button>
                    </div>
                `;
            } else {
                actionsHtml = `
                    <div class="actions-cell">
                        <button class="icon-btn guest-btn" data-id="${event.event_id}" title="Guests"><i class="fas fa-users"></i></button>
                        <button class="icon-btn task-btn" data-id="${event.event_id}" title="Tasks"><i class="fas fa-tasks"></i></button>
                        <button class="icon-btn edit-btn" data-id="${event.event_id}" title="Edit"><i class="fas fa-pen-to-square"></i></button>
                        <button class="icon-btn archive-btn" data-id="${event.event_id}" title="Archive"><i class="fas fa-box-archive"></i></button>
                        <button class="icon-btn delete-btn" data-id="${event.event_id}" title="Delete"><i class="fas fa-trash-can"></i></button>
                    </div>
                `;
            }
        }

        row.innerHTML = `
            <td style="font-weight: 600;">${event.title}</td>
            <td>${date}</td>
            <td><i class="fas fa-location-dot" style="color: var(--text-muted); margin-right: 5px;"></i> ${event.location || 'N/A'}</td>
            <td><span class="badge badge-${(event.status || 'tentative').toLowerCase()}">${event.status || 'Tentative'}</span></td>
            <td>$${parseFloat(event.budget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            ${showActions ? `<td>${actionsHtml}</td>` : ''}
        `;
        elements.eventTableBody.appendChild(row);
    });
}

function attachGlobalEventListeners() {
    // Only attach once
    if (elements.eventTableBody.dataset.listenerAttached) return;
    
    elements.eventTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.icon-btn');
        if (!btn) return;
        
        const id = btn.dataset.id;
        if (btn.classList.contains('edit-btn')) openEditModal(id);
        else if (btn.classList.contains('archive-btn')) archiveEvent(id);
        else if (btn.classList.contains('delete-btn')) deleteEvent(id);
        else if (btn.classList.contains('restore-btn')) restoreEvent(id);
        else if (btn.classList.contains('guest-btn')) openGuestModal(id);
        else if (btn.classList.contains('task-btn')) openTaskModal(id);
        
        // Handle guest/task specific deletes if they use delegation too
        if (btn.classList.contains('delete-guest-btn')) deleteGuest(id, btn.dataset.eventId);
        if (btn.classList.contains('delete-task-btn')) deleteTask(id, btn.dataset.eventId);
    });
    
    elements.eventTableBody.dataset.listenerAttached = "true";
}

// GUEST MANAGEMENT
async function openGuestModal(eventId) {
    elements.guestEventId.value = eventId;
    elements.guestModal.style.display = 'block';
    
    // Find title from allEvents or fallback
    const event = allEvents.find(e => e.event_id == eventId);
    if (event) {
        elements.guestEventTitle.textContent = `Event: ${event.title}`;
    } else {
        const resp = await eventApi.getAll({ user_id: currentUser.user_id });
        const found = resp.find(e => e.event_id == eventId);
        if (found) elements.guestEventTitle.textContent = `Event: ${found.title}`;
    }
    
    loadGuests(eventId);
}

async function loadGuests(eventId) {
    try {
        const guests = await guestApi.getByEvent(eventId);
        renderGuests(guests);
    } catch (err) {
        console.error('Error loading guests:', err);
    }
}

function renderGuests(guests) {
    elements.guestTableBody.innerHTML = '';
    guests.forEach(guest => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guest.name}</td>
            <td>${guest.emails || 'N/A'}</td>
            <td><span class="badge badge-${guest.rsvp_status.toLowerCase()}">${guest.rsvp_status}</span></td>
            <td>
                <button class="icon-btn delete-guest-btn" data-id="${guest.guest_id}" data-event-id="${guest.event_id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        elements.guestTableBody.appendChild(row);
    });
}

async function saveGuest(e) {
    e.preventDefault();
    const eventId = elements.guestEventId.value;
    const guestData = {
        event_id: eventId,
        name: document.getElementById('guest-name').value,
        emails: document.getElementById('guest-emails').value,
        rsvp_status: document.getElementById('guest-rsvp').value
    };
    
    try {
        await guestApi.add(guestData);
        elements.guestForm.reset();
        loadGuests(eventId);
    } catch (err) {
        alert(err.message);
    }
}

async function deleteGuest(id, eventId) {
    if (confirm('Remove this guest?')) {
        try {
            await guestApi.delete(id);
            loadGuests(eventId);
        } catch (err) {
            alert(err.message);
        }
    }
}

// TASK MANAGEMENT
async function openTaskModal(eventId) {
    elements.taskEventId.value = eventId;
    elements.taskModal.style.display = 'block';
    
    const event = allEvents.find(e => e.event_id == eventId);
    if (event) {
        elements.taskEventTitle.textContent = `Event: ${event.title}`;
    } else {
        const resp = await eventApi.getAll({ user_id: currentUser.user_id });
        const found = resp.find(e => e.event_id == eventId);
        if (found) elements.taskEventTitle.textContent = `Event: ${found.title}`;
    }
    
    loadTasks(eventId);
}

async function loadTasks(eventId) {
    try {
        const tasks = await taskApi.getByEvent(eventId);
        renderTasks(tasks);
    } catch (err) {
        console.error('Error loading tasks:', err);
    }
}

function renderTasks(tasks) {
    elements.taskTableBody.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('tr');
        const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A';
        row.innerHTML = `
            <td style="${task.is_completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${task.task_description}</td>
            <td>${dueDate}</td>
            <td>
                <input type="checkbox" class="task-check" data-id="${task.task_id}" data-event-id="${task.event_id}" ${task.is_completed ? 'checked' : ''}>
            </td>
            <td>
                <button class="icon-btn delete-task-btn" data-id="${task.task_id}" data-event-id="${task.event_id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        elements.taskTableBody.appendChild(row);
    });
    
    document.querySelectorAll('.task-check').forEach(check => {
        check.onchange = () => toggleTask(check.dataset.id, check.dataset.eventId, check.checked);
    });
}

async function saveTask(e) {
    e.preventDefault();
    const eventId = elements.taskEventId.value;
    const taskData = {
        event_id: eventId,
        task_description: document.getElementById('task-desc').value,
        due_date: document.getElementById('task-due').value
    };
    
    try {
        await taskApi.add(taskData);
        elements.taskForm.reset();
        loadTasks(eventId);
    } catch (err) {
        alert(err.message);
    }
}

async function toggleTask(id, eventId, isCompleted) {
    try {
        const tasks = await taskApi.getByEvent(eventId);
        const task = tasks.find(t => t.task_id == id);
        await taskApi.update(id, { ...task, is_completed: isCompleted ? 1 : 0 });
        loadTasks(eventId);
    } catch (err) {
        alert(err.message);
    }
}

async function deleteTask(id, eventId) {
    if (confirm('Delete this task?')) {
        try {
            await taskApi.delete(id);
            loadTasks(eventId);
        } catch (err) {
            alert(err.message);
        }
    }
}

// VIEW SWITCHING
function switchView(view) {
    currentView = view;
    
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        const text = item.textContent.trim();
        if (view === 'dashboard' && text.includes('Overview')) item.classList.add('active');
        if (view === 'events' && text.includes('Events')) item.classList.add('active');
        if (view === 'guests' && text.includes('Guests')) item.classList.add('active');
        if (view === 'tasks' && text.includes('Tasks')) item.classList.add('active');
        if (view === 'archives' && text.includes('Archives')) item.classList.add('active');
    });

    if (view === 'archives') {
        elements.contentHeader.textContent = 'Event Archives';
        elements.contentSubtitle.textContent = 'View and manage your archived events.';
        elements.overviewCards.style.display = 'none';
        elements.eventsSectionTitle.textContent = 'Archived Events';
        if (elements.headerActions) elements.headerActions.style.display = 'none';
    } else if (view === 'guests') {
        elements.contentHeader.textContent = 'Guest Management';
        elements.contentSubtitle.textContent = 'Manage guests across all your events.';
        elements.overviewCards.style.display = 'none';
        elements.eventsSectionTitle.textContent = 'All Guests';
        if (elements.headerActions) elements.headerActions.style.display = 'none';
    } else if (view === 'tasks') {
        elements.contentHeader.textContent = 'Task Tracking';
        elements.contentSubtitle.textContent = 'Track tasks across all your events.';
        elements.overviewCards.style.display = 'none';
        elements.eventsSectionTitle.textContent = 'All Tasks';
        if (elements.headerActions) elements.headerActions.style.display = 'none';
    } else if (view === 'events') {
        elements.contentHeader.textContent = 'Event Management';
        elements.contentSubtitle.textContent = 'Create, edit, and manage your events.';
        elements.overviewCards.style.display = 'none';
        elements.eventsSectionTitle.textContent = 'All Events';
        if (elements.headerActions) elements.headerActions.style.display = 'flex';
    } else {
        elements.contentHeader.textContent = 'Dashboard Overview';
        elements.contentSubtitle.textContent = "Welcome back! Here's what's happening today.";
        elements.overviewCards.style.display = 'grid';
        elements.eventsSectionTitle.textContent = 'Upcoming Events';
        if (elements.headerActions) elements.headerActions.style.display = 'none';
    }

    fetchAndRenderData();
}

async function renderAllGuests(events) {
    elements.tableHead.innerHTML = `
        <tr>
            <th>Guest Name</th>
            <th>Event</th>
            <th>Emails</th>
            <th>RSVP Status</th>
            <th>Actions</th>
        </tr>
    `;
    elements.eventTableBody.innerHTML = '<tr><td colspan="5">Loading guests...</td></tr>';
    
    try {
        elements.eventTableBody.innerHTML = '';
        if (events.length === 0) {
            elements.eventTableBody.innerHTML = '<tr><td colspan="5">No events found.</td></tr>';
            return;
        }

        for (const event of events) {
            const guests = await guestApi.getByEvent(event.event_id);
            guests.forEach(guest => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${guest.name}</td>
                    <td>${event.title}</td>
                    <td>${guest.emails || 'N/A'}</td>
                    <td><span class="badge badge-${guest.rsvp_status.toLowerCase()}">${guest.rsvp_status}</span></td>
                    <td>
                        <button class="icon-btn guest-btn" data-id="${event.event_id}" title="Manage"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                elements.eventTableBody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error rendering all guests:', err);
    }
}

async function renderAllTasks(events) {
    elements.tableHead.innerHTML = `
        <tr>
            <th>Task</th>
            <th>Event</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;
    elements.eventTableBody.innerHTML = '<tr><td colspan="5">Loading tasks...</td></tr>';
    
    try {
        elements.eventTableBody.innerHTML = '';
        if (events.length === 0) {
            elements.eventTableBody.innerHTML = '<tr><td colspan="5">No events found.</td></tr>';
            return;
        }

        for (const event of events) {
            const tasks = await taskApi.getByEvent(event.event_id);
            tasks.forEach(task => {
                const row = document.createElement('tr');
                const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A';
                row.innerHTML = `
                    <td style="${task.is_completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${task.task_description}</td>
                    <td>${event.title}</td>
                    <td>${dueDate}</td>
                    <td><span class="badge ${task.is_completed ? 'badge-completed' : 'badge-tentative'}">${task.is_completed ? 'Completed' : 'Pending'}</span></td>
                    <td>
                        <button class="icon-btn task-btn" data-id="${event.event_id}" title="Manage"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                elements.eventTableBody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error rendering all tasks:', err);
    }
}

// EVENT MANAGEMENT ACTIONS
async function openEditModal(id) {
    const event = allEvents.find(e => e.event_id == id);
    if (!event) return;

    elements.modalTitle.textContent = 'Edit Event';
    elements.eventIdInput.value = event.event_id;
    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    
    const date = new Date(event.event_date);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('event_date').value = localDate;
    
    document.getElementById('location').value = event.location;
    document.getElementById('budget').value = event.budget;
    document.getElementById('status').value = event.status || 'Tentative';
    
    elements.statusGroup.style.display = 'block';
    elements.modal.style.display = 'block';
}

async function saveEvent(e) {
    e.preventDefault();
    const id = elements.eventIdInput.value;
    
    let isArchived = 0;
    if (id) {
        const existingEvent = allEvents.find(ev => ev.event_id == id);
        if (existingEvent) isArchived = existingEvent.is_archived;
    }

    const eventData = {
        user_id: currentUser.user_id,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        event_date: document.getElementById('event_date').value,
        location: document.getElementById('location').value,
        budget: document.getElementById('budget').value,
        status: document.getElementById('status').value,
        is_archived: isArchived
    };

    try {
        if (id) {
            await eventApi.update(id, eventData);
        } else {
            await eventApi.create(eventData);
        }
        elements.modal.style.display = 'none';
        await loadDashboard();
    } catch (err) {
        alert(err.message);
    }
}

async function archiveEvent(id) {
    if (confirm('Are you sure you want to archive this event?')) {
        try {
            await eventApi.archive(id);
            await loadDashboard();
        } catch (err) {
            alert(err.message);
        }
    }
}

async function restoreEvent(id) {
    console.log('Restore triggered for ID:', id);
    if (confirm('Restore this event to your active list?')) {
        try {
            const result = await eventApi.restore(id);
            console.log('Restore success:', result);
            await loadDashboard();
        } catch (err) {
            console.error('Restore error:', err);
            alert(err.message);
        }
    }
}

async function deleteEvent(id) {
    if (confirm('Are you sure you want to PERMANENTLY delete this event?')) {
        try {
            await eventApi.delete(id);
            await loadDashboard();
        } catch (err) {
            alert(err.message);
        }
    }
}

function openAddModal() {
    elements.modalTitle.textContent = 'Create New Event';
    elements.eventForm.reset();
    elements.eventIdInput.value = '';
    elements.statusGroup.style.display = 'none';
    elements.modal.style.display = 'block';
}

function toggleSidebar() {
    elements.sidebar.classList.toggle('collapsed');
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// EVENT LISTENERS
if (elements.addEventBtn) elements.addEventBtn.onclick = openAddModal;
if (elements.eventForm) elements.eventForm.onsubmit = saveEvent;
if (elements.guestForm) elements.guestForm.onsubmit = saveGuest;
if (elements.taskForm) elements.taskForm.onsubmit = saveTask;
if (elements.sidebarToggle) elements.sidebarToggle.onclick = toggleSidebar;
if (elements.logoutBtn) elements.logoutBtn.onclick = logout;

elements.navItems.forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        if (text.includes('Overview')) switchView('dashboard');
        else if (text.includes('Events')) switchView('events');
        else if (text.includes('Guests')) switchView('guests');
        else if (text.includes('Tasks')) switchView('tasks');
        else if (text.includes('Archives')) switchView('archives');
    };
});

if (elements.searchInput) {
    elements.searchInput.onkeyup = () => fetchAndRenderData();
}

if (elements.locationFilter) {
    elements.locationFilter.onkeyup = () => fetchAndRenderData();
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadDashboard);
