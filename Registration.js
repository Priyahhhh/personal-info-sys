// Get eventId from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("eventId");
document.getElementById("eventId").value = eventId;

// Handle form submit
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const bookingData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    eventId: document.getElementById("eventId").value
  };

  fetch("/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData)
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    window.location.href = "index.html"; // go back to events page
  })
  .catch(err => {
    console.error(err);
    alert("Booking failed!");
  });
});
