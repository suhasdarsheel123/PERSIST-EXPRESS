import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;
const FILE_PATH = path.resolve('faculties.json');

app.use(express.json());

// Helper function: Read data from file synchronously
function getFaculties() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

// Helper function: Write data to file synchronously
function saveFaculties(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. CREATE: Add a new faculty member
app.post('/faculties', (req, res) => {
    try {
        const faculties = getFaculties();
        const newFaculty = req.body;

        faculties.push(newFaculty);
        saveFaculties(faculties);

        res.status(201).json({
            message: 'Faculty created successfully',
            data: newFaculty
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 2. READ ALL: Get all faculty members
app.get('/faculties', (req, res) => {
    try {
        const faculties = getFaculties();
        res.status(200).json({
            message: 'All faculties fetched successfully',
            data: faculties
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 3. READ ONE: Get a single faculty member by ID
app.get('/faculties/:id', (req, res) => {
    try {
        const facultyId = parseInt(req.params.id);
        const faculties = getFaculties();
        const faculty = faculties.find(f => f.id === facultyId);

        if (faculty) {
            res.status(200).json({
                message: 'Faculty details fetched successfully',
                data: faculty
            });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 4. UPDATE: Update a faculty member by ID
app.put('/faculties/:id', (req, res) => {
    try {
        const facultyId = parseInt(req.params.id);
        const updatedInfo = req.body;
        const faculties = getFaculties();
        const facultyIndex = faculties.findIndex(f => f.id === facultyId);

        if (facultyIndex !== -1) {
            faculties[facultyIndex] = { ...faculties[facultyIndex], ...updatedInfo };
            saveFaculties(faculties);

            res.status(200).json({
                message: 'Faculty updated successfully',
                data: faculties[facultyIndex]
            });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 5. DELETE: Remove a faculty member by ID
app.delete('/faculties/:id', (req, res) => {
    try {
        const facultyId = parseInt(req.params.id);
        const faculties = getFaculties();
        const facultyIndex = faculties.findIndex(f => f.id === facultyId);

        if (facultyIndex !== -1) {
            const deletedFaculty = faculties.splice(facultyIndex, 1);
            saveFaculties(faculties);

            res.status(200).json({
                message: 'Faculty deleted successfully',
                data: deletedFaculty[0]
            });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});