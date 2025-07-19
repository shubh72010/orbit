const map = L.map('map').setView([28.6139, 77.2090], 13); // Default: New Delhi

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
}).addTo(map);

let marker;

function searchPlace() {
  const query = document.getElementById('searchBox').value;
  if (!query) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];

        if (marker) {
          map.removeLayer(marker);
        }

        marker = L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();
        map.setView([lat, lon], 14);
      } else {
        alert("No results found.");
      }
    })
    .catch(() => {
      alert("Something went wrong.");
    });
}