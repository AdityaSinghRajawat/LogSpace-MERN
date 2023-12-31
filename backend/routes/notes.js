const express = require('express')
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Get all the notes using GET "/api/auth/fetchallnotes",Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }

});

// Add a new Note using POST "/api/auth/addnote",Login required

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', "Description must be atleat 5 characters").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }

});

// Updating an existing Note using PUT "/api/auth/updatenote",Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        // Creating a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description }; // Corrected 'description'
        if (tag) { newNote.tag = tag }; // Corrected 'tag'


        // Find the note to be updated and update it

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(401).send("Not found") };
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not allowed") };

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }

});

// Deleting an existing Note using DELETE "/api/auth/deletenote",Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        // Find the note to be deleted and delete it

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(401).send("Not found") };

        // Allow deletion if only user owns this note
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not allowed") };

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }

});


module.exports = router;