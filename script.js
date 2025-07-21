const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const modal = document.getElementById("eventModal");
const form = document.getElementById("eventForm");
const closeModal = document.getElementById("closeModal");
const deleteBtn = document.getElementById("deleteEvent");
const recurrenceSelect = document.getElementById("eventRecurrence");
const customRepeatLabel = document.getElementById("customRepeatLabel");
const customRepeatValue = document.getElementById("customRepeatValue");
const customRepeatUnit = document.getElementById("customRepeatUnit");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("events")) || [];
let editingEventId = null;

recurrenceSelect.addEventListener("change", () => {
  customRepeatLabel.style.display = recurrenceSelect.value === "custom" ? "block" : "none";
});

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";
  monthYear.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split("T")[0];
    const cell = document.createElement("div");
    cell.className = "day";
    cell.dataset.date = date;
    cell.innerHTML = `<div class="date-number">${day}</div>`;
    cell.ondragover = e => e.preventDefault();
    cell.ondrop = e => onDropEvent(e, date);

    const dayEvents = events.filter(e => e.date === date);
    dayEvents.forEach(e => {
      const evt = document.createElement("div");
      evt.className = "event";
      evt.draggable = true;
      evt.dataset.id = e.id;
      evt.textContent = e.title;
      evt.style.background = e.color || "#3174ad";
      evt.onclick = event => {
        event.stopPropagation();
        openModal(date, e.id);
      };
      evt.ondragstart = ev => ev.dataTransfer.setData("text/plain", e.id);
      cell.appendChild(evt);
    });

    cell.onclick = () => openModal(date);
    calendar.appendChild(cell);
  }
}

function openModal(date, eventId = null) {
  modal.style.display = "flex";
  form.reset();
  editingEventId = eventId;
  customRepeatLabel.style.display = "none";

  if (eventId) {
    const e = events.find(ev => ev.id === eventId);
    if (!e) return;
    form["eventTitle"].value = e.title;
    form["eventDate"].value = e.date;
    form["eventTime"].value = e.time;
    form["eventDesc"].value = e.desc;
    form["eventColor"].value = e.color;
    form["eventRecurrence"].value = e.recurrence || "none";
    if (e.recurrence === "custom") {
      customRepeatLabel.style.display = "block";
      customRepeatValue.value = e.repeatEvery || 2;
      customRepeatUnit.value = e.repeatUnit || "weeks";
    }
  } else {
    form["eventDate"].value = date;
  }
}

function onDropEvent(event, newDate) {
  const id = event.dataTransfer.getData("text/plain");
  const ev = events.find(e => e.id == id);
  if (ev) {
    ev.date = newDate;
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar();
  }
}

closeModal.onclick = () => {
  modal.style.display = "none";
};

form.onsubmit = e => {
  e.preventDefault();
  const recurrence = form["eventRecurrence"].value;
  const baseEvent = {
    id: editingEventId || Date.now(),
    title: form["eventTitle"].value,
    date: form["eventDate"].value,
    time: form["eventTime"].value,
    desc: form["eventDesc"].value,
    color: form["eventColor"].value,
    recurrence,
  };

  if (recurrence === "custom") {
    baseEvent.repeatEvery = parseInt(customRepeatValue.value);
    baseEvent.repeatUnit = customRepeatUnit.value;
  }

  if (editingEventId) {
    events = events.map(e => e.id === editingEventId ? baseEvent : e);
  } else {
    events.push(baseEvent);
    if (recurrence !== "none") {
      const more = getRecurringDates(baseEvent);
      more.forEach(date => {
        events.push({ ...baseEvent, id: Date.now() + Math.random(), date });
      });
    }
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

function getRecurringDates(event) {
  const { date, recurrence, repeatEvery = 2, repeatUnit = "weeks" } = event;
  const dates = [];
  const base = new Date(date);
  for (let i = 1; i <= 4; i++) {
    const next = new Date(base);
    if (recurrence === "daily") next.setDate(base.getDate() + i);
    else if (recurrence === "weekly") next.setDate(base.getDate() + 7 * i);
    else if (recurrence === "monthly") next.setMonth(base.getMonth() + i);
    else if (recurrence === "custom") {
      if (repeatUnit === "days") next.setDate(base.getDate() + i * repeatEvery);
      if (repeatUnit === "weeks") next.setDate(base.getDate() + i * repeatEvery * 7);
      if (repeatUnit === "months") next.setMonth(base.getMonth() + i * repeatEvery);
    }
    dates.push(next.toISOString().split("T")[0]);
  }
  return dates;
}

renderCalendar();
