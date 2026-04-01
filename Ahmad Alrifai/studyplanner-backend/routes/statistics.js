const express = require('express');
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 13. FILTER TASKS (GET /api/tasks/filter)
// Query: ?status=completed|pending&courseId=xxx
router.get('/tasks/filter', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { status, courseId } = req.query;

        let query = { userId: req.user.userId };

        // Filter by status
        if (status === 'completed') {
            query.completed = true;
        } else if (status === 'pending') {
            query.completed = false;
        } else if (status && status !== 'all') {
            return res.status(400).json({
                error: 'Invalid status. Use: completed, pending, or all'
            });
        }

        // Filter by course
        if (courseId) {
            if (ObjectId.isValid(courseId)) {
                const course = await db.collection('courses').findOne({
                    _id: new ObjectId(courseId),
                    userId: req.user.userId
                });
                if (!course) {
                    return res.status(404).json({ error: 'Course not found' });
                }
            }
            query.courseId = courseId;
        }

        const tasks = await db.collection('tasks')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            filter: { status: status || 'all', courseId: courseId || 'all' },
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error('Filter tasks error:', error);
        res.status(500).json({ error: 'Server error filtering tasks' });
    }
});

// 14. VIEW PROGRESS STATISTICS (GET /api/statistics)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const userId = req.user.userId;

        // Get all courses for this user
        const courses = await db.collection('courses')
            .find({ userId })
            .toArray();

        // Calculate stats for each course
        const courseStats = await Promise.all(
            courses.map(async (course) => {
                const courseTasks = await db.collection('tasks')
                    .find({
                        userId,
                        courseId: course._id.toString()
                    })
                    .toArray();

                const total = courseTasks.length;
                const completed = courseTasks.filter(t => t.completed).length;
                const pending = total - completed;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                return {
                    courseId: course._id,
                    courseName: course.name,
                    courseColor: course.color,
                    totalTasks: total,
                    completedTasks: completed,
                    pendingTasks: pending,
                    completionPercentage: percentage
                };
            })
        );

        // Overall statistics
        const allTasks = await db.collection('tasks')
            .find({ userId })
            .toArray();

        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const overallPercentage = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        // Tasks due soon (next 7 days)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const dueSoon = allTasks.filter(t =>
            !t.completed &&
            t.deadline &&
            new Date(t.deadline) >= now &&
            new Date(t.deadline) <= nextWeek
        ).length;

        // Overdue tasks
        const overdue = allTasks.filter(t =>
            !t.completed &&
            t.deadline &&
            new Date(t.deadline) < now
        ).length;

        res.json({
            overall: {
                totalCourses: courses.length,
                totalTasks,
                completedTasks,
                pendingTasks,
                completionPercentage: overallPercentage,
                dueSoon,
                overdue
            },
            courses: courseStats.sort((a, b) => b.completionPercentage - a.completionPercentage)
        });

    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ error: 'Server error calculating statistics' });
    }
});

// Quick stats endpoint (lightweight)
router.get('/quick', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const userId = req.user.userId;

        const [totalCourses, totalTasks, completedTasks] = await Promise.all([
            db.collection('courses').countDocuments({ userId }),
            db.collection('tasks').countDocuments({ userId }),
            db.collection('tasks').countDocuments({ userId, completed: true })
        ]);

        res.json({
            totalCourses,
            totalTasks,
            completedTasks,
            pendingTasks: totalTasks - completedTasks,
            completionPercentage: totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0
        });

    } catch (error) {
        console.error('Quick stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;