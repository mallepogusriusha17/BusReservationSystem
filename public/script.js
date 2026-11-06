
const API = "/api";

let passengers = [];
let buses = [];
let bookings = [];

// Display messages
function showMessage(id, message) {
    const element = document.getElementById(id);
    if (element) element.textContent = message;
}

// PASSENGERS

async function loadPassengers() {
    try {
        const response = await fetch(`${API}/passengers`);
        passengers = await response.json();

        const table = document.getElementById("passengerTable");
        if (!table) return;

        table.innerHTML = "";

        passengers.forEach(p => {
            table.innerHTML += `
                <tr>
                    <td>${p.passenger_id}</td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${p.phone}</td>
                    <td>
                        <button class="edit" onclick="editPassenger(${p.passenger_id})">Edit</button>
                        <button class="delete" onclick="deletePassenger(${p.passenger_id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        showMessage("passengerMessage", "Unable to load passengers.");
    }
}

document.getElementById("passengerForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("passenger_id").value;

    const data = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value
    };

    const url = id ? `${API}/passengers/${id}` : `${API}/passengers`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        showMessage("passengerMessage", id ? "Passenger updated!" : "Passenger added!");
        resetPassengerForm();
        loadPassengers();
    } else {
        showMessage("passengerMessage", "Error saving passenger.");
    }
});

function editPassenger(id) {
    const p = passengers.find(item => item.passenger_id === id);
    if (!p) return;

    document.getElementById("passenger_id").value = p.passenger_id;
    document.getElementById("name").value = p.name;
    document.getElementById("age").value = p.age;
    document.getElementById("gender").value = p.gender;
    document.getElementById("phone").value = p.phone;

    window.scrollTo(0, 0);
}

async function deletePassenger(id) {
    if (!confirm("Delete this passenger?")) return;

    const response = await fetch(`${API}/passengers/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        showMessage("passengerMessage", "Passenger deleted!");
        loadPassengers();
    } else {
        showMessage("passengerMessage", "Cannot delete passenger. Check related bookings.");
    }
}

function resetPassengerForm() {
    document.getElementById("passengerForm").reset();
    document.getElementById("passenger_id").value = "";
}

// BUSES

async function loadBuses() {
    try {
        const response = await fetch(`${API}/buses`);
        buses = await response.json();

        const table = document.getElementById("busTable");
        if (table) {
            table.innerHTML = "";

            buses.forEach(b => {
                table.innerHTML += `
                    <tr>
                        <td>${b.bus_id}</td>
                        <td>${b.bus_number}</td>
                        <td>${b.bus_name}</td>
                        <td>${b.source}</td>
                        <td>${b.destination}</td>
                        <td>${b.seats}</td>
                        <td>${b.fare}</td>
                        <td>
                            <button class="edit" onclick="editBus(${b.bus_id})">Edit</button>
                            <button class="delete" onclick="deleteBus(${b.bus_id})">Delete</button>
                        </td>
                    </tr>`;
            });
        }

        updateBusDropdown();
    } catch (error) {
        showMessage("busMessage", "Unable to load buses.");
    }
}

document.getElementById("busForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("bus_id").value;

    const data = {
        bus_number: document.getElementById("bus_number").value,
        bus_name: document.getElementById("bus_name").value,
        source: document.getElementById("source").value,
        destination: document.getElementById("destination").value,
        seats: document.getElementById("seats").value,
        fare: document.getElementById("fare").value
    };

    const url = id ? `${API}/buses/${id}` : `${API}/buses`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        showMessage("busMessage", id ? "Bus updated!" : "Bus added!");
        resetBusForm();
        loadBuses();
    } else {
        showMessage("busMessage", "Error saving bus.");
    }
});

function editBus(id) {
    const b = buses.find(item => item.bus_id === id);
    if (!b) return;

    document.getElementById("bus_id").value = b.bus_id;
    document.getElementById("bus_number").value = b.bus_number;
    document.getElementById("bus_name").value = b.bus_name;
    document.getElementById("source").value = b.source;
    document.getElementById("destination").value = b.destination;
    document.getElementById("seats").value = b.seats;
    document.getElementById("fare").value = b.fare;

    window.scrollTo(0, 0);
}

async function deleteBus(id) {
    if (!confirm("Delete this bus?")) return;

    const response = await fetch(`${API}/buses/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        showMessage("busMessage", "Bus deleted!");
        loadBuses();
    } else {
        showMessage("busMessage", "Cannot delete bus. Check related bookings.");
    }
}

function resetBusForm() {
    document.getElementById("busForm").reset();
    document.getElementById("bus_id").value = "";
}

// BOOKINGS

async function loadBookings() {
    try {
        const response = await fetch(`${API}/bookings`);
        bookings = await response.json();

        const table = document.getElementById("bookingTable");
        if (!table) return;

        table.innerHTML = "";

        bookings.forEach(b => {
            table.innerHTML += `
                <tr>
                    <td>${b.booking_id}</td>
                    <td>${b.passenger_name}</td>
                    <td>${b.bus_name} (${b.bus_number})</td>
                    <td>${String(b.journey_date).substring(0, 10)}</td>
                    <td>${b.seats_booked}</td>
                    <td>${b.total_amount}</td>
                    <td>
                        <button class="edit" onclick="editBooking(${b.booking_id})">Edit</button>
                        <button class="delete" onclick="deleteBooking(${b.booking_id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        showMessage("bookingMessage", "Unable to load bookings.");
    }
}

document.getElementById("bookingForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("booking_id").value;

    const data = {
        passenger_id: document.getElementById("passenger_id").value,
        bus_id: document.getElementById("bus_id").value,
        journey_date: document.getElementById("journey_date").value,
        seats_booked: document.getElementById("seats_booked").value,
        total_amount: document.getElementById("total_amount").value
    };

    const url = id ? `${API}/bookings/${id}` : `${API}/bookings`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        showMessage("bookingMessage", id ? "Booking updated!" : "Booking added!");
        resetBookingForm();
        loadBookings();
    } else {
        showMessage("bookingMessage", "Error saving booking.");
    }
});

function editBooking(id) {
    const b = bookings.find(item => item.booking_id === id);
    if (!b) return;

    document.getElementById("booking_id").value = b.booking_id;
    document.getElementById("passenger_id").value = b.passenger_id;
    document.getElementById("bus_id").value = b.bus_id;
    document.getElementById("journey_date").value = String(b.journey_date).substring(0, 10);
    document.getElementById("seats_booked").value = b.seats_booked;
    document.getElementById("total_amount").value = b.total_amount;

    window.scrollTo(0, 0);
}

async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;

    const response = await fetch(`${API}/bookings/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        showMessage("bookingMessage", "Booking deleted!");
        loadBookings();
    } else {
        showMessage("bookingMessage", "Error deleting booking.");
    }
}

function resetBookingForm() {
    document.getElementById("bookingForm").reset();
    document.getElementById("booking_id").value = "";
}

// DROPDOWNS

function updatePassengerDropdown() {
    const select = document.getElementById("passenger_id");
    if (!select) return;

    select.innerHTML = '<option value="">Select Passenger</option>';

    passengers.forEach(p => {
        select.innerHTML += `
            <option value="${p.passenger_id}">${p.name}</option>`;
    });
}

function updateBusDropdown() {
    const select = document.getElementById("bus_id");
    if (!select) return;

    select.innerHTML = '<option value="">Select Bus</option>';

    buses.forEach(b => {
        select.innerHTML += `
            <option value="${b.bus_id}">
                ${b.bus_number} - ${b.bus_name} (${b.source} to ${b.destination})
            </option>`;
    });
}

// INITIAL LOAD

document.addEventListener("DOMContentLoaded", async function () {
    await loadPassengers();
    await loadBuses();

    updatePassengerDropdown();
    updateBusDropdown();

    await loadBookings();
});
