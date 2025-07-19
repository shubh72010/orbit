let map;
let userMarker;

function initMap() {
  map = L.map('map').setView([0, 0], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        map.setView([lat, lon], 15);

        userMarker = L.marker([lat, lon]).addTo(map)
          .bindPopup('You are here').openPopup();
      },
      () => alert("Could not get your location.")
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function searchPlaces() {
  const query = document.getElementById('place-input').value;
  if (!query) return;

  if (!map.getCenter()) return;

  const center = map.getCenter();
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&bounded=1&viewbox=${center.lng - 0.01},${center.lat + 0.01},${center.lng + 0.01},${center.lat - 0.01}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("No results found.");
        return;
      }

      data.forEach(place => {
        const lat = place.lat;
        const lon = place.lon;
        const name = place.display_name;

        L.marker([lat, lon]).addTo(map).bindPopup(name);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching places.");
    });
}

window.onload = initMap;