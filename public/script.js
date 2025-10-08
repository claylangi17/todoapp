// Global variables
let tasks = [];
let currentFilter = 'all';
let currentEditingTaskId = null;
let currentDeletingTaskId = null;

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksContainer = document.getElementById('tasksContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');

// Modal elements
const editModal = document.getElementById('editModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const deleteModal = document.getElementById('deleteModal');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Task form submission
    taskForm.addEventListener('submit', handleAddTask);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    
    // Search input
    searchInput.addEventListener('input', handleSearch);
    
    // Edit modal
    editTaskForm.addEventListener('submit', handleEditTask);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    
    // Delete modal
    document.getElementById('confirmDelete').addEventListener('click', handleDeleteTask);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeEditModal();
            closeDeleteModal();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// API functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Terjadi kesalahan: ' + error.message, 'error');
        throw error;
    }
}

// Load tasks from server
async function loadTasks() {
    try {
        showLoading(true);
        tasks = await apiRequest('/api/tasks');
        renderTasks();
    } catch (error) {
        console.error('Failed to load tasks:', error);
    } finally {
        showLoading(false);
    }
}

// Add new task
async function handleAddTask(event) {
    event.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) {
        showNotification('Judul tugas tidak boleh kosong', 'error');
        return;
    }
    
    try {
        setButtonLoading(event.target.querySelector('button[type="submit"]'), true);
        
        const newTask = await apiRequest('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title, description })
        });
        
        tasks.unshift(newTask);
        renderTasks();
        taskForm.reset();
        showNotification('Tugas berhasil ditambahkan', 'success');
    } catch (error) {
        console.error('Failed to add task:', error);
    } finally {
        setButtonLoading(event.target.querySelector('button[type="submit"]'), false);
    }
}

// Toggle task completion
async function toggleTask(taskId) {
    try {
        const updatedTask = await apiRequest(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH'
        });
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            renderTasks();
        }
        
        const status = updatedTask.is_completed ? 'selesai' : 'belum selesai';
        showNotification(`Tugas ditandai sebagai ${status}`, 'success');
    } catch (error) {
        console.error('Failed to toggle task:', error);
    }
}

// Open edit modal
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentEditingTaskId = taskId;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || '';
    editModal.style.display = 'block';
    editTaskTitle.focus();
}

// Handle edit task
async function handleEditTask(event) {
    event.preventDefault();
    
    const title = editTaskTitle.value.trim();
    const description = editTaskDescription.value.trim();
    
    if (!title) {
        showNotification('Judul tugas tidak boleh kosong', 'error');
        return;
    }
    
    try {
        const task = tasks.find(t => t.id === currentEditingTaskId);
        const updatedTask = await apiRequest(`/api/tasks/${currentEditingTaskId}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                title, 
                description,
                is_completed: task.is_completed
            })
        });
        
        const taskIndex = tasks.findIndex(task => task.id === currentEditingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            renderTasks();
        }
        
        closeEditModal();
        showNotification('Tugas berhasil diperbarui', 'success');
    } catch (error) {
        console.error('Failed to update task:', error);
    }
}

// Open delete modal
function openDeleteModal(taskId) {
    currentDeletingTaskId = taskId;
    deleteModal.style.display = 'block';
}

// Handle delete task
async function handleDeleteTask() {
    try {
        await apiRequest(`/api/tasks/${currentDeletingTaskId}`, {
            method: 'DELETE'
        });
        
        tasks = tasks.filter(task => task.id !== currentDeletingTaskId);
        renderTasks();
        closeDeleteModal();
        showNotification('Tugas berhasil dihapus', 'success');
    } catch (error) {
        console.error('Failed to delete task:', error);
    }
}

// Close modals
function closeEditModal() {
    editModal.style.display = 'none';
    currentEditingTaskId = null;
    editTaskForm.reset();
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    currentDeletingTaskId = null;
}

// Filter tasks
function handleFilterChange(event) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentFilter = event.target.dataset.filter;
    renderTasks();
}

// Search tasks
function handleSearch() {
    renderTasks();
}

// Render tasks
function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredTasks = tasks.filter(task => {
        // Filter by status
        if (currentFilter === 'completed' && !task.is_completed) return false;
        if (currentFilter === 'pending' && task.is_completed) return false;
        
        // Filter by search term
        if (searchTerm) {
            const titleMatch = task.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = task.description && task.description.toLowerCase().includes(searchTerm);
            return titleMatch || descriptionMatch;
        }
        
        return true;
    });
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const tasksHTML = filteredTasks.map(task => `
        <div class="task-item ${task.is_completed ? 'completed' : ''}">
            <div class="task-header">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.is_completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-title ${task.is_completed ? 'completed' : ''}">
                        ${escapeHtml(task.title)}
                    </div>
                    ${task.description ? `
                        <div class="task-description">
                            ${escapeHtml(task.description)}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="task-meta">
                <span>Dibuat: ${formatDate(task.created_at)}</span>
                <div class="task-actions">
                    <button class="btn btn-secondary" onclick="openEditModal(${task.id})">
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="openDeleteModal(${task.id})">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    tasksContainer.innerHTML = tasksHTML;
}

// Utility functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        button.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        maxWidth: '300px',
        wordWrap: 'break-word',
        animation: 'slideInRight 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Hari ini';
    } else if (diffDays === 2) {
        return 'Kemarin';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} hari yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);