require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const taskRoutes = require('./routes/tasks');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS - Allow frontend to connect
// CORS - Allow deployed frontend
const allowedOrigins = [
    'http://localhost:5500',           // Local development
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    null,                               // File:// protocol
    // Add your deployed frontend URL here later
    // 'https://your-app.vercel.app',
    // 'https://your-app.netlify.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// API Routes
app.use('/api/auth', authRoutes);           // Req 1-3: Auth
app.use('/api/courses', courseRoutes);      // Req 4-7: Courses
app.use('/api/tasks', taskRoutes);          // Req 8-12: Tasks
app.use('/api/statistics', statisticsRoutes); // Req 13-14: Stats & Filter

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        available: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET  /api/courses',
            'POST /api/courses',
            'PUT  /api/courses/:id',
            'DELETE /api/courses/:id',
            'GET  /api/tasks',
            'POST /api/tasks',
            'PUT  /api/tasks/:id',
            'DELETE /api/tasks/:id',
            'PUT  /api/tasks/:id/complete',
            'GET  /api/tasks/filter',
            'GET  /api/statistics'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server after database connection
async function startServer() {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`
╔══════════════════════════════════════════════════════════╗
║           StudyPlanner API Server Running                ║
╠══════════════════════════════════════════════════════════╣
║  Port:      ${PORT}                                      ║
║  Database:  MongoDB Atlas (Frankfurt/AWS)               ║
║  Environment: ${process.env.NODE_ENV || 'production'}                          ║
╠══════════════════════════════════════════════════════════╣
║  Available Endpoints:                                    ║
║  Authentication:                                         ║
║    POST /api/auth/register  - Create account           ║
║    POST /api/auth/login     - Login & get token        ║
║    POST /api/auth/logout    - Logout                   ║
║                                                          ║
║  Courses:                                                ║
║    GET    /api/courses      - List all courses         ║
║    POST   /api/courses      - Create course              ║
║    PUT    /api/courses/:id  - Update course              ║
║    DELETE /api/courses/:id  - Delete course + tasks      ║
║                                                          ║
║  Tasks:                                                  ║
║    GET    /api/tasks        - List tasks (?courseId=)    ║
║    POST   /api/tasks        - Create task                ║
║    PUT    /api/tasks/:id    - Update task              ║
║    DELETE /api/tasks/:id    - Delete task              ║
║    PUT    /api/tasks/:id/complete - Mark done          ║
║    PUT    /api/tasks/:id/toggle   - Toggle status        ║
║                                                          ║
║  Statistics & Filters:                                   ║
║    GET /api/tasks/filter?status=pending|completed        ║
║    GET /api/statistics      - Full progress report       ║
║    GET /api/statistics/quick - Quick overview            ║
╚══════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();