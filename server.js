
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sri usha",
    database: "bus_reservation"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// PASSENGERS CRUD

app.get("/api/passengers", (req, res) => {
    db.query("SELECT * FROM passengers", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post("/api/passengers", (req, res) => {
    const { name, age, gender, phone } = req.body;

    db.query(
        "INSERT INTO passengers (name, age, gender, phone) VALUES (?, ?, ?, ?)",
        [name, age, gender, phone],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Passenger added successfully" });
        }
    );
});

app.put("/api/passengers/:id", (req, res) => {
    const { name, age, gender, phone } = req.body;

    db.query(
        "UPDATE passengers SET name=?, age=?, gender=?, phone=? WHERE passenger_id=?",
        [name, age, gender, phone, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Passenger updated successfully" });
        }
    );
});

app.delete("/api/passengers/:id", (req, res) => {
    db.query(
        "DELETE FROM passengers WHERE passenger_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Passenger deleted successfully" });
        }
    );
});

// BUSES CRUD

app.get("/api/buses", (req, res) => {
    db.query("SELECT * FROM buses", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post("/api/buses", (req, res) => {
    const { bus_number, bus_name, source, destination, seats, fare } = req.body;

    db.query(
        "INSERT INTO buses (bus_number, bus_name, source, destination, seats, fare) VALUES (?, ?, ?, ?, ?, ?)",
        [bus_number, bus_name, source, destination, seats, fare],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Bus added successfully" });
        }
    );
});

app.put("/api/buses/:id", (req, res) => {
    const { bus_number, bus_name, source, destination, seats, fare } = req.body;

    db.query(
        "UPDATE buses SET bus_number=?, bus_name=?, source=?, destination=?, seats=?, fare=? WHERE bus_id=?",
        [bus_number, bus_name, source, destination, seats, fare, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Bus updated successfully" });
        }
    );
});

app.delete("/api/buses/:id", (req, res) => {
    db.query(
        "DELETE FROM buses WHERE bus_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Bus deleted successfully" });
        }
    );
});

// BOOKINGS CRUD

app.get("/api/bookings", (req, res) => {
    const sql = `
        SELECT bookings.*, passengers.name AS passenger_name,
               buses.bus_name, buses.bus_number
        FROM bookings
        JOIN passengers ON bookings.passenger_id = passengers.passenger_id
        JOIN buses ON bookings.bus_id = buses.bus_id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post("/api/bookings", (req, res) => {
    const { passenger_id, bus_id, journey_date, seats_booked, total_amount } = req.body;

    db.query(
        "INSERT INTO bookings (passenger_id, bus_id, journey_date, seats_booked, total_amount) VALUES (?, ?, ?, ?, ?)",
        [passenger_id, bus_id, journey_date, seats_booked, total_amount],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Booking added successfully" });
        }
    );
});

app.put("/api/bookings/:id", (req, res) => {
    const { passenger_id, bus_id, journey_date, seats_booked, total_amount } = req.body;

    db.query(
        "UPDATE bookings SET passenger_id=?, bus_id=?, journey_date=?, seats_booked=?, total_amount=? WHERE booking_id=?",
        [passenger_id, bus_id, journey_date, seats_booked, total_amount, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Booking updated successfully" });
        }
    );
});

app.delete("/api/bookings/:id", (req, res) => {
    db.query(
        "DELETE FROM bookings WHERE booking_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Booking deleted successfully" });
        }
    );
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
