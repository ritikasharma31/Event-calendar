document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('.calendar');

  // Generate 30 days
  for (let i = 1; i <= 30; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dayNum = document.createElement('div');
    dayNum.classList.add('day-number');
    dayNum.innerText = i;

    dayDiv.appendChild(dayNum);

    // Add event click functionality
    dayDiv.addEventListener('click', () => {
      const eventName = prompt("Enter Event:");
      if (eventName) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventName;
        dayDiv.appendChild(eventDiv);
      }
    });

    calendar.appendChild(dayDiv);
  }
});
