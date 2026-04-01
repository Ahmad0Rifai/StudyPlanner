// ============================================
// STUDYPLANNER API CLIENT
// ============================================

// API Configuration - Auto-detect environment
const isLocalhost = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost
    ? 'http://localhost:5000/api'
    : 'https://studyplanner-api.onrender.com/api';  // YOUR RENDER URL HERE

console.log('API URL:', API_URL);

// Token storage functions
function getToken() {
    return localStorage.getItem('studyplanner_token');
}

function setToken(token) {
    localStorage.setItem('studyplanner_token', token);
}

function removeToken() {
    localStorage.removeItem('studyplanner_token');
    localStorage.removeItem('studyplanner_user');
}

function getUser() {
    const user = localStorage.getItem('studyplanner_user');
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    localStorage.setItem('studyplanner_user', JSON.stringify(user));
}

// Check if logged in
function isLoggedIn() {
    return !!getToken();
}

// Generic API request helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 401) {
                // Token expired or invalid
                removeToken();
                window.location.reload();
            }
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// AUTHENTICATION API (Req 1-3)
// ============================================

// 1. REGISTER - POST /api/auth/register
async function register(name, email, password) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name, email, password }
    });

    if (data.token) {
        setToken(data.token);
        setUser(data.user);
    }

    return data;
}

// 2. LOGIN - POST /api/auth/login
async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
    });

    if (data.token) {
        setToken(data.token);
        setUser(data.user);
    }

    return data;
}

// 3. LOGOUT - POST /api/auth/logout
async function logout() {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
        // Ignore errors on logout
    }
    removeToken();
}

// Get current user info
async function getCurrentUser() {
    return apiRequest('/auth/me', { method: 'GET' });
}

// ============================================
// COURSES API (Req 4-7)
// ============================================

// 4. CREATE COURSE - POST /api/courses
async function createCourse(name, description, color) {
    return apiRequest('/courses', {
        method: 'POST',
        body: { name, description, color }
    });
}

// 5. GET ALL COURSES - GET /api/courses
async function getCourses() {
    return apiRequest('/courses', { method: 'GET' });
}

// 6. UPDATE COURSE - PUT /api/courses/:id
async function updateCourse(courseId, updates) {
    return apiRequest(`/courses/${courseId}`, {
        method: 'PUT',
        body: updates
    });
}

// 7. DELETE COURSE - DELETE /api/courses/:id
async function deleteCourse(courseId) {
    return apiRequest(`/courses/${courseId}`, {
        method: 'DELETE'
    });
}

// Get single course
async function getCourse(courseId) {
    return apiRequest(`/courses/${courseId}`, { method: 'GET' });
}

// ============================================
// TASKS API (Req 8-12)
// ============================================

// 8. CREATE TASK - POST /api/tasks
async function createTask(title, courseId, deadline) {
    return apiRequest('/tasks', {
        method: 'POST',
        body: { title, courseId, deadline }
    });
}

// 9. GET TASKS - GET /api/tasks (?courseId=xxx)
async function getTasks(courseId = null) {
    const query = courseId ? `?courseId=${courseId}` : '';
    return apiRequest(`/tasks${query}`, { method: 'GET' });
}

// 10. UPDATE TASK - PUT /api/tasks/:id
async function updateTask(taskId, updates) {
    return apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: updates
    });
}

// 11. DELETE TASK - DELETE /api/tasks/:id
async function deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE'
    });
}

// 12. MARK TASK COMPLETED - PUT /api/tasks/:id/complete
async function completeTask(taskId) {
    return apiRequest(`/tasks/${taskId}/complete`, {
        method: 'PUT'
    });
}

// Toggle task completion
async function toggleTask(taskId) {
    return apiRequest(`/tasks/${taskId}/toggle`, {
        method: 'PUT'
    });
}

// ============================================
// STATISTICS & FILTERING API (Req 13-14)
// ============================================

// 13. FILTER TASKS - GET /api/tasks/filter
async function filterTasks(status = 'all', courseId = null) {
    let query = `?status=${status}`;
    if (courseId) query += `&courseId=${courseId}`;
    return apiRequest(`/tasks/filter${query}`, { method: 'GET' });
}

// 14. GET STATISTICS - GET /api/statistics
async function getStatistics() {
    return apiRequest('/statistics', { method: 'GET' });
}

// Quick stats
async function getQuickStats() {
    return apiRequest('/statistics/quick', { method: 'GET' });
}