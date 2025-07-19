// Initialize the map
const map = L.map('map').setView([19.0760, 72.8777], 13); // Default to Mumbai

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Search for a place and add marker
async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const place = data[0]; // best match
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);
      const name = place.display_name;

      // Add marker
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${name}</b>`)
        .openPopup();

      // Move to location
      map.setView([lat, lon], 16);
    } else {
      alert("No results found.");
    }
  } catch (error) {
    console.error("Error fetching place:", error);
    alert("Something went wrong while searching.");
  }
}

// Hook up search button
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("placeSearch").value;
  if (query.trim()) {
    searchPlace(query);
  }
});

// Optional: press Enter to search
document.getElementById("placeSearch").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchBtn").click();
  }
});