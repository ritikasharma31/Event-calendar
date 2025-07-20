const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const modal = document.getElementById("eventModal");
const form = document.getElementById("eventForm");
const closeModal = document.getElementById("closeModal");
const deleteBtn = document.getElementById("deleteEvent");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("events")) || [];
let editingEventId = null;

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  calendar.innerHTML = "";
  monthYear.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split("T")[0];
    const cell = document.createElement("div");
    cell.className = "day";
    cell.dataset.date = date;
    cell.innerHTML = "<div class='date-number'>" + day + "</div>";
    
    const dayEvents = events.filter(e => e.date === date);
    dayEvents.forEach(e => {
      const evt = document.createElement("div");
      evt.className = "event";
      evt.textContent = e.title;
      evt.style.background = e.color || "#3174ad";
      cell.appendChild(evt);
    });

    cell.onclick = () => openModal(date);
    calendar.appendChild(cell);
  }
}

function openModal(date) {
  modal.style.display = "flex";
  form.reset();
  editingEventId = null;
  form["eventDate"].value = date;
}

closeModal.onclick = () => {
  modal.style.display = "none";
};

form.onsubmit = (e) => {
  e.preventDefault();
  const eventData = {
    id: editingEventId || Date.now(),
    title: form["eventTitle"].value,
    date: form["eventDate"].value,
    time: form["eventTime"].value,
    desc: form["eventDesc"].value,
    color: form["eventColor"].value
  };

  if (editingEventId) {
    events = events.map(e => e.id === editingEventId ? eventData : e);
  } else {
    events.push(eventData);
  }
  localStorage.setItem("events", JSON.stringify(events));
  modal.style.display = "none";
  renderCalendar();
};

deleteBtn.onclick = () => {
  if (editingEventId) {
    events = events.filter(e => e.id !== editingEventId);
    localStorage.setItem("events", JSON.stringify(events));
    modal.style.display = "none";
    renderCalendar();
  }
};

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};
document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();