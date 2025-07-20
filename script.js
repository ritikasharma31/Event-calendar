document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('.calendar');

  for (let i = 1; i <= 30; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayNum = document.createElement('div');
    dayNum.classList.add('day-number');
    dayNum.innerText = i;

    dayDiv.appendChild(dayNum);

    dayDiv.addEventListener('click', () => {
      const eventName = prompt("Enter Event:");
      if (eventName) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventName;

        // Add right-click delete functionality
        eventDiv.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          if (confirm("Delete this event?")) {
            eventDiv.remove();
          }
        });

        dayDiv.appendChild(eventDiv);
      }
    });

    calendar.appendChild(dayDiv);
  }
});
