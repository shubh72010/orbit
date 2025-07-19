let map;
let userMarker;

function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5); // Fallback view

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        map.setView([lat, lon], 14);
        userMarker = L.marker([lat, lon]).addTo(map)
          .bindPopup('You are here').openPopup();
      },
      () => alert('Location access denied.')
    );
  } else {
    alert('Geolocation not supported.');
  }
}

function searchPlaces() {
  const query = document.getElementById('place-input').value.trim();
  if (!query) return;

  const center = map.getCenter();
  const bbox = [
    center.lng - 0.02,
    center.lat - 0.02,
    center.lng + 0.02,
    center.lat + 0.02
  ].join(',');

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${bbox}&bounded=1&limit=10`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return alert('No results found.');
      data.forEach(place => {
        L.marker([parseFloat(place.lat), parseFloat(place.lon)])
          .addTo(map)
          .bindPopup(place.display_name);
      });
    })
    .catch(err => {
      console.error(err);
      alert('Error retrieving places.');
    });
}

window.onload = initMap;