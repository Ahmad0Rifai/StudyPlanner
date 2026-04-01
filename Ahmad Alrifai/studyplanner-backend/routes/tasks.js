const express = require('express');
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 8. CREATE TASK (POST /api/tasks)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { title, courseId, deadline } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        // Verify course exists and belongs to user
        let courseObjectId;
        try {
            courseObjectId = new ObjectId(courseId);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }

        const course = await db.collection('courses').findOne({
            _id: courseObjectId,
            userId: req.user.userId
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found or access denied' });
        }

        const newTask = {
            userId: req.user.userId,
            courseId: courseId, // Store as string for easier querying
            title: title.trim(),
            deadline: deadline ? new Date(deadline) : null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('tasks').insertOne(newTask);

        res.status(201).json({
            message: 'Task created successfully',
            task: {
                _id: result.insertedId,
                ...newTask
            }
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Server error creating task' });
    }
});

// 9. VIEW TASKS (GET /api/tasks)
// Query params: ?courseId=xxx to filter by course
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { courseId } = req.query;

        let query = { userId: req.user.userId };

        if (courseId) {
            // Validate courseId belongs to user
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
            .sort({
                completed: 1,  // Pending first
                createdAt: -1 // Newest first
            })
            .toArray();

        res.json({
            count: tasks.length,
            courseId: courseId || 'all',
            tasks
        });

    } catch (error) {
        console.error('View tasks error:', error);
        res.status(500).json({ error: 'Server error fetching tasks' });
    }
});

// 10. UPDATE TASK (PUT /api/tasks/:id)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { title, deadline, completed, courseId } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const updates = {
            updatedAt: new Date()
        };

        if (title !== undefined) updates.title = title.trim();
        if (deadline !== undefined) updates.deadline = deadline ? new Date(deadline) : null;
        if (completed !== undefined) updates.completed = completed;
        if (courseId !== undefined) updates.courseId = courseId;

        const result = await db.collection('tasks').updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.userId
            },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        res.json({
            message: 'Task updated successfully',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Server error updating task' });
    }
});

// 11. DELETE TASK (DELETE /api/tasks/:id)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const result = await db.collection('tasks').deleteOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        res.json({
            message: 'Task deleted successfully',
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Server error deleting task' });
    }
});

// 12. MARK TASK AS COMPLETED (PUT /api/tasks/:id/complete)
router.put('/:id/complete', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const result = await db.collection('tasks').updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.userId
            },
            {
                $set: {
                    completed: true,
                    updatedAt: new Date(),
                    completedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        res.json({
            message: 'Task marked as completed',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Complete task error:', error);
        res.status(500).json({ error: 'Server error completing task' });
    }
});

// Toggle task completion (alternative endpoint)
router.put('/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const task = await db.collection('tasks').findOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const newStatus = !task.completed;
        const updates = {
            completed: newStatus,
            updatedAt: new Date()
        };

        if (newStatus) {
            updates.completedAt = new Date();
        } else {
            updates.completedAt = null;
        }

        await db.collection('tasks').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        res.json({
            message: `Task marked as ${newStatus ? 'completed' : 'pending'}`,
            completed: newStatus
        });

    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({ error: 'Server error toggling task' });
    }
});

module.exports = router;