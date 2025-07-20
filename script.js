document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('.calendar');
  const savedEvents = JSON.parse(localStorage.getItem('events')) || {};

  for (let i = 1; i <= 30; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayNum = document.createElement('div');
    dayNum.classList.add('day-number');
    dayNum.innerText = i;

    dayDiv.appendChild(dayNum);

    // Add saved events for this day
    if (savedEvents[i]) {
      savedEvents[i].forEach(eventName => {
        const eventDiv = createEventDiv(i, eventName);
        dayDiv.appendChild(eventDiv);
      });
    }

    // Add new event
    dayDiv.addEventListener('click', () => {
      const eventName = prompt("Enter Event:");
      if (eventName) {
        const eventDiv = createEventDiv(i, eventName);
        dayDiv.appendChild(eventDiv);

        if (!savedEvents[i]) savedEvents[i] = [];
        savedEvents[i].push(eventName);
        localStorage.setItem('events', JSON.stringify(savedEvents));
      }
    });

    calendar.appendChild(dayDiv);
  }

  function createEventDiv(day, name) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerText = name;

    // Right-click to delete
    eventDiv.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm("Delete this event?")) {
        eventDiv.remove();

        // Remove from localStorage
        savedEvents[day] = savedEvents[day].filter(n => n !== name);
        localStorage.setItem('events', JSON.stringify(savedEvents));
      }
    });

    return eventDiv;
  }
});
