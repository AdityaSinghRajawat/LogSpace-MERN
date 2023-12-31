import { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {

    const host = 'http://localhost:5000'
    const initnotes = [];
    const [notes, setNotes] = useState(initnotes)


    // Get all Notes
    const getNotes = async () => {

        console.log(localStorage.getItem('token'));

        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkZmI3OWE5OGFjNzM1OTJiYWMwZWNkIn0sImlhdCI6MTY5MjQzMDk1MX0.8oxlmGWjzBipgOYpW1QeIVON-uHCY2LrKIk5dN-Jb0k'
            },
        });
        const json = await response.json();
        setNotes(json);

    }


    // Add a Note
    const addNote = async (title, description, tag) => {

        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkZmI3OWE5OGFjNzM1OTJiYWMwZWNkIn0sImlhdCI6MTY5MjQzMDk1MX0.8oxlmGWjzBipgOYpW1QeIVON-uHCY2LrKIk5dN-Jb0k'
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    // Delete a Note
    const deleteNote = async (id) => {

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkZmI3OWE5OGFjNzM1OTJiYWMwZWNkIn0sImlhdCI6MTY5MjQzMDk1MX0.8oxlmGWjzBipgOYpW1QeIVON-uHCY2LrKIk5dN-Jb0k'
            },
        });
        const json = await response.json();
        console.log(json);

        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    // Edit a Note

    const editNote = async (id, title, description, tag) => {
        // API Call 
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkZmI3OWE5OGFjNzM1OTJiYWMwZWNkIn0sImlhdCI6MTY5MjQzMDk1MX0.8oxlmGWjzBipgOYpW1QeIVON-uHCY2LrKIk5dN-Jb0k"
                // localStorage.getItem('token');
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        console.log(json);

        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;