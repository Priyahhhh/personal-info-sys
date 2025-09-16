const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/eventdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Schemas
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
});
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// Insert default events
async function insertDefaultEvents() {
  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.insertMany([
      { title: "Tech Conference 2025", description: "AI & Blockchain trends.", date: "2025-10-05" },
      { title: "Music Festival", description: "Live music with top artists.", date: "2025-11-12" },
      { title: "Startup Pitch Day", description: "Pitch ideas to investors.", date: "2025-12-01" },
    ]);
    console.log("✅ Default events added");
  }
}
insertDefaultEvents();

// Routes (API)
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post("/api/register/:eventId", async (req, res) => {
  const { name, email, phone } = req.body;
  await Booking.create({
    name,
    email,
    phone,
    eventId: req.params.eventId,
  });
  res.json({ message: "✅ Registration successful" });
});

app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find().populate("eventId");
  res.json(bookings);
});

// Start Server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
