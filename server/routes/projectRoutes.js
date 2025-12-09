const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');

// Get All Projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Project
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
        const newProject = new Project({ name, description, image });
        await newProject.save();
        res.json(newProject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ADD THIS DELETE ROUTE ---
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;