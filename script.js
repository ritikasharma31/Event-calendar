document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('.calendar');
  const searchInput = document.getElementById('search');
  const savedEvents = JSON.parse(localStorage.getItem('events')) || {};

  document.getElementById('clear').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all events?")) {
      localStorage.removeItem('events');
      window.location.reload();
    }
  });

  // Search Function
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    document.querySelectorAll('.event').forEach(event => {
      const match = event.innerText.toLowerCase().includes(keyword);
      event.style.display = match ? 'block' : 'none';
    });
  });

  // Render 30-day calendar
  for (let i = 1; i <= 30; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayNum = document.createElement('div');
    dayNum.classList.add('day-number');
    dayNum.innerText = i;
    dayDiv.appendChild(dayNum);

    // Render saved events
    if (savedEvents[i]) {
      savedEvents[i].forEach(eventName => {
        const eventDiv = createEventDiv(i, eventName);
        dayDiv.appendChild(eventDiv);
      });
    }
    

    // Add new event
    dayDiv.addEventListener('click', () => {
      const eventName = prompt("Enter Event:");
      if (!eventName) return;

      const repeat = prompt("Should this event repeat? (none / daily / weekly)").toLowerCase();

      if (repeat === 'daily') {
        for (let d = 1; d <= 30; d++) {
          addEventToDay(d, eventName);
        }
      } else if (repeat === 'weekly') {
        for (let d = i; d <= 30; d += 7) {
          addEventToDay(d, eventName);
        }
      } else {
        addEventToDay(i, eventName);
      }

      localStorage.setItem('events', JSON.stringify(savedEvents));
      window.location.reload();
    });

    calendar.appendChild(dayDiv);
  }

  // Utility to add event to a given day
  function addEventToDay(day, name) {
    if (!savedEvents[day]) savedEvents[day] = [];
    if (!savedEvents[day].includes(name)) savedEvents[day].push(name);
  }

  // Create event DOM
  function createEventDiv(day, name) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerText = name;

    // Right-click to delete
    eventDiv.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm("Delete this event?")) {
        eventDiv.remove();
        savedEvents[day] = savedEvents[day].filter(n => n !== name);
        localStorage.setItem('events', JSON.stringify(savedEvents));
      }
    });

    return eventDiv;
  }
});
