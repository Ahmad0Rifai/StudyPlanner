// ============================================
// STUDYPLANNER APPLICATION LOGIC
// ============================================

// Global state
let currentUser = null;
let courses = [];
let tasks = [];
let currentView = 'all'; // 'all' or course ID
let editingCourseId = null;
let editingTaskId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

function setupEventListeners() {
    // Auth form
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('authSwitch').addEventListener('click', toggleAuthMode);

    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
}

// ============================================
// AUTHENTICATION
// ============================================

let isLoginMode = true;

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    document.getElementById('nameField').classList.toggle('hidden', isLoginMode);
    document.getElementById('authBtn').textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    document.getElementById('authSwitchText').textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
    document.getElementById('authSwitch').textContent = isLoginMode ? 'Sign up' : 'Sign in';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    try {
        if (isLoginMode) {
            await login(email, password);
            showApp();
        } else {
            if (!name) {
                alert('Please enter your name');
                return;
            }
            await register(name, email, password);
            showApp();
        }
    } catch (error) {
        alert(error.message || 'Authentication failed');
    }
}

function checkAuth() {
    if (isLoggedIn()) {
        currentUser = getUser();
        showApp();
    }
}

function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    currentUser = getUser();
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

    loadData();
}

async function logoutUser() {
    await logout();
    location.reload();
}

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
    try {
        showLoading(true);
        const [coursesData, tasksData] = await Promise.all([
            getCourses(),
            getTasks()
        ]);

        courses = coursesData.courses || [];
        tasks = tasksData.tasks || [];

        renderCourses();
        renderTasks();
    } catch (error) {
        console.error('Failed to load data:', error);
        alert('Failed to load data. Please refresh the page.');
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    // You can add a loading spinner here if needed
}

// ============================================
// COURSES MANAGEMENT
// ============================================

function renderCourses() {
    const list = document.getElementById('courseList');
    list.innerHTML = '';

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = `course-item ${currentView === course._id.toString() ? 'active' : ''}`;
        div.onclick = (e) => {
            if (!e.target.closest('.icon-btn')) selectCourse(course._id);
        };

        div.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="course-color" style="background: ${course.color}"></div>
                <span>${course.name}</span>
            </div>
            <div class="course-actions">
                <button class="icon-btn" onclick="editCourseHandler('${course._id}')" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="icon-btn" onclick="deleteCourseHandler('${course._id}')" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        list.appendChild(div);
    });

    // Update task modal course select
    const select = document.getElementById('taskCourseSelect');
    select.innerHTML = courses.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
}

function openCourseModal() {
    editingCourseId = null;
    document.getElementById('courseModalTitle').textContent = 'Add Course';
    document.getElementById('courseNameInput').value = '';
    document.getElementById('courseDescInput').value = '';
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
    document.querySelector('.color-option').classList.add('selected');
    document.getElementById('courseModal').classList.add('active');
}

async function editCourseHandler(id) {
    const course = courses.find(c => c._id.toString() === id.toString());
    if (!course) return;

    editingCourseId = id;
    document.getElementById('courseModalTitle').textContent = 'Edit Course';
    document.getElementById('courseNameInput').value = course.name;
    document.getElementById('courseDescInput').value = course.description || '';

    document.querySelectorAll('.color-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.color === course.color);
    });

    document.getElementById('courseModal').classList.add('active');
}

async function saveCourse() {
    const name = document.getElementById('courseNameInput').value.trim();
    if (!name) {
        alert('Please enter a course name');
        return;
    }

    const description = document.getElementById('courseDescInput').value.trim();
    const color = document.querySelector('.color-option.selected').dataset.color;

    try {
        if (editingCourseId) {
            await updateCourse(editingCourseId, { name, description, color });
        } else {
            await createCourse(name, description, color);
        }

        // Reload courses
        const data = await getCourses();
        courses = data.courses;
        renderCourses();
        closeModal('courseModal');
    } catch (error) {
        alert(error.message || 'Failed to save course');
    }
}

async function deleteCourseHandler(id) {
    if (!confirm('Delete this course and all its tasks?')) return;

    try {
        await deleteCourse(id);
        const data = await getCourses();
        courses = data.courses;
        if (currentView === id.toString()) currentView = 'all';
        renderCourses();
        await loadTasks();
    } catch (error) {
        alert(error.message || 'Failed to delete course');
    }
}

function selectCourse(id) {
    currentView = id.toString();
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.course-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const course = courses.find(c => c._id.toString() === id.toString());
    document.getElementById('currentViewTitle').textContent = course.name;
    showView('tasks');
    loadTasks();
}

async function loadTasks() {
    try {
        const data = currentView === 'all'
            ? await getTasks()
            : await getTasks(currentView);
        tasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

// ============================================
// TASKS MANAGEMENT
// ============================================

function renderTasks() {
    const list = document.getElementById('taskList');
    const filter = document.getElementById('taskFilter').value;

    let filteredTasks = tasks;

    // Filter by status
    if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
    } else if (filter === 'pending') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    }

    // Sort: pending first, then by date
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    document.getElementById('taskCount').textContent = `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}`;

    // Update progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.getElementById('completionRate').textContent = `${rate}%`;
    document.getElementById('progressFill').style.width = `${rate}%`;

    if (filteredTasks.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                <h3>No tasks found</h3>
                <p>Add a new task to get started</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filteredTasks.map(task => {
        const course = courses.find(c => c._id.toString() === task.courseId.toString());
        const dateStr = task.deadline ? new Date(task.deadline).toLocaleDateString() : '';
        const isOverdue = task.deadline && !task.completed && new Date(task.deadline) < new Date();

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task._id}">
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTaskStatus('${task._id}')"></div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        ${course ? `<span style="color: ${course.color}">● ${course.name}</span>` : ''}
                        ${dateStr ? `<span style="color: ${isOverdue ? '#e44332' : 'inherit'}">📅 ${dateStr} ${isOverdue ? '(Overdue)' : ''}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="icon-btn" onclick="editTaskHandler('${task._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="icon-btn" onclick="deleteTaskHandler('${task._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openTaskModal() {
    if (courses.length === 0) {
        alert('Please create a course first');
        return;
    }
    editingTaskId = null;
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    document.getElementById('taskTitleInput').value = '';
    document.getElementById('taskDeadlineInput').value = '';

    if (currentView !== 'all') {
        document.getElementById('taskCourseSelect').value = currentView;
    }

    document.getElementById('taskModal').classList.add('active');
}

async function editTaskHandler(id) {
    const task = tasks.find(t => t._id.toString() === id.toString());
    if (!task) return;

    editingTaskId = id;
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskTitleInput').value = task.title;
    document.getElementById('taskCourseSelect').value = task.courseId;

    if (task.deadline) {
        const date = new Date(task.deadline);
        const formatted = date.toISOString().slice(0, 16);
        document.getElementById('taskDeadlineInput').value = formatted;
    } else {
        document.getElementById('taskDeadlineInput').value = '';
    }

    document.getElementById('taskModal').classList.add('active');
}

async function saveTask() {
    const title = document.getElementById('taskTitleInput').value.trim();
    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const courseId = document.getElementById('taskCourseSelect').value;
    const deadline = document.getElementById('taskDeadlineInput').value || null;

    try {
        if (editingTaskId) {
            await updateTask(editingTaskId, { title, courseId, deadline });
        } else {
            await createTask(title, courseId, deadline);
        }

        await loadTasks();
        closeModal('taskModal');
    } catch (error) {
        alert(error.message || 'Failed to save task');
    }
}

async function toggleTaskStatus(id) {
    try {
        await toggleTask(id);
        await loadTasks();
    } catch (error) {
        alert(error.message || 'Failed to update task');
    }
}

async function deleteTaskHandler(id) {
    if (!confirm('Delete this task?')) return;

    try {
        await deleteTask(id);
        await loadTasks();
    } catch (error) {
        alert(error.message || 'Failed to delete task');
    }
}

async function filterTasks() {
    const filter = document.getElementById('taskFilter').value;

    try {
        let data;
        if (filter === 'all') {
            data = currentView === 'all'
                ? await getTasks()
                : await getTasks(currentView);
        } else {
            data = await filterTasks(filter, currentView === 'all' ? null : currentView);
        }
        tasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Filter error:', error);
    }
}

// ============================================
// STATISTICS VIEW
// ============================================

async function showView(view) {
    if (view === 'tasks') {
        document.getElementById('tasksView').classList.remove('hidden');
        document.getElementById('statsView').classList.add('hidden');
        document.querySelectorAll('.nav-item')[0].classList.add('active');
        document.querySelectorAll('.nav-item')[1].classList.remove('active');
        if (currentView === 'all') {
            document.getElementById('currentViewTitle').textContent = 'All Tasks';
        }
        await loadTasks();
    } else if (view === 'stats') {
        document.getElementById('tasksView').classList.add('hidden');
        document.getElementById('statsView').classList.remove('hidden');
        document.querySelectorAll('.nav-item')[0].classList.remove('active');
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        await renderStats();
    }
}

async function renderStats() {
    try {
        const stats = await getStatistics();

        document.getElementById('totalTasksStat').textContent = stats.overall.totalTasks;
        document.getElementById('completedTasksStat').textContent = stats.overall.completedTasks;
        document.getElementById('completionRateStat').textContent = `${stats.overall.completionPercentage}%`;
        document.getElementById('activeCoursesStat').textContent = stats.overall.totalCourses;

        const list = document.getElementById('courseStatsList');
        list.innerHTML = stats.courses.map(course => `
            <div class="course-progress-item">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${course.courseColor}"></div>
                    <span>${course.courseName}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="color: var(--text-muted); font-size: 0.9rem;">${course.completedTasks}/${course.totalTasks}</span>
                    <div class="course-progress-bar">
                        <div class="course-progress-fill" style="width: ${course.completionPercentage}%"></div>
                    </div>
                    <span style="font-weight: 600; min-width: 40px; text-align: right;">${course.completionPercentage}%</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Stats error:', error);
        alert('Failed to load statistics');
    }
}

// ============================================
// UTILITIES
// ============================================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}