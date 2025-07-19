const map = L.map("map").setView([28.6139, 77.2090], 13); // Default: New Delhi

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// Optional: user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      map.setView([lat, lng], 15);
      L.marker([lat, lng]).addTo(map).bindPopup("You're here!").openPopup();
    },
    () => console.warn("Location access denied.")
  );
}

// Nominatim place search
function searchPlace() {
  const query = document.getElementById("search").value;
  if (!query) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        map.setView([lat, lon], 16);
        L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();
      } else {
        alert("No results found.");
      }
    })
    .catch((err) => console.error("Search failed:", err));
}