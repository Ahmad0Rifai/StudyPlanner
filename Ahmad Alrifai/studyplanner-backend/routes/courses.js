const express = require('express');
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 4. CREATE COURSE (POST /api/courses)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { name, description, color } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Course name is required' });
        }

        const newCourse = {
            userId: req.user.userId,
            name: name.trim(),
            description: (description || '').trim(),
            color: color || '#e44332', // Default Todoist red
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('courses').insertOne(newCourse);

        res.status(201).json({
            message: 'Course created successfully',
            course: {
                _id: result.insertedId,
                ...newCourse
            }
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: 'Server error creating course' });
    }
});

// 5. VIEW COURSES (GET /api/courses)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = getDb();

        const courses = await db.collection('courses')
            .find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error('View courses error:', error);
        res.status(500).json({ error: 'Server error fetching courses' });
    }
});

// 6. UPDATE COURSE (PUT /api/courses/:id)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { name, description, color } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const updates = {
            updatedAt: new Date()
        };

        if (name !== undefined) updates.name = name.trim();
        if (description !== undefined) updates.description = description.trim();
        if (color !== undefined) updates.color = color;

        const result = await db.collection('courses').updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.userId // Ensure user owns this course
            },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Course not found or access denied' });
        }

        res.json({
            message: 'Course updated successfully',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Server error updating course' });
    }
});

// 7. DELETE COURSE (DELETE /api/courses/:id)
// Also deletes all associated tasks
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const courseId = new ObjectId(id);

        // Verify ownership and delete course
        const courseResult = await db.collection('courses').deleteOne({
            _id: courseId,
            userId: req.user.userId
        });

        if (courseResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Course not found or access denied' });
        }

        // Delete all tasks associated with this course
        const tasksResult = await db.collection('tasks').deleteMany({
            courseId: id, // Stored as string in tasks
            userId: req.user.userId
        });

        res.json({
            message: 'Course and associated tasks deleted successfully',
            deletedCourse: 1,
            deletedTasks: tasksResult.deletedCount
        });

    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ error: 'Server error deleting course' });
    }
});

// Get single course by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const course = await db.collection('courses').findOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ course });

    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: 'Server error fetching course' });
    }
});

module.exports = router;