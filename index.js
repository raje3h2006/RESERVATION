const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
const DATA_FILE = './data.json';

// Helper: Read and Write
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// 1. GET - View all reservations
app.get('/reservations', (req, res) => {
    const data = readData();
    res.json(data);
});

// 2. POST - Book a seat
app.post('/book', (req, res) => {
    const reservations = readData();
    
    const newBooking = {
        id: Date.now(),
        name: req.body.name,
        gender: req.body.gender,
        mobile: req.body.mobile,
        email: req.body.email,
        seatNumber: reservations.length + 1 // Simple seat assignment
    };

    reservations.push(newBooking);
    writeData(reservations); // Saves to data.json
    res.status(201).json({ message: "Seat Booked!", details: newBooking });
});
// 3. PUT - Update reservation details
app.put('/update/:id', (req, res) => {
    let reservations = readData();
    const id = parseInt(req.params.id);
    
    // Find the index of the reservation we want to update
    const index = reservations.findIndex(r => r.id === id);

    if (index !== -1) {
        // Update the fields (keep existing values if new ones aren't provided)
        reservations[index].name = req.body.name || reservations[index].name;
        reservations[index].gender = req.body.gender || reservations[index].gender;
        reservations[index].mobile = req.body.mobile || reservations[index].mobile;
        reservations[index].email = req.body.email || reservations[index].email;

        writeData(reservations); // Save changes to data.json
        res.json({ message: "Reservation updated successfully!", details: reservations[index] });
    } else {
        res.status(404).json({ message: "Reservation not found. Check the ID." });
    }
});

// 3. DELETE - Cancel a reservation
app.delete('/cancel/:id', (req, res) => {
    let reservations = readData();
    const id = parseInt(req.params.id);
    
    const updatedList = reservations.filter(r => r.id !== id);
    writeData(updatedList);
    
    res.json({ message: "Reservation cancelled" });
});

app.listen(3000, () => console.log('Train System running on http://localhost:3000'));
