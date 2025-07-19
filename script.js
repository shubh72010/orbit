let map;
let userMarker;
let userLat = 0;
let userLon = 0;

function initMap() {
  map = L.map("map").setView([20.5937, 78.9629], 5); // India center fallback

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;

        map.setView([userLat, userLon], 14);

        userMarker = L.marker([userLat, userLon])
          .addTo(map)
          .bindPopup("You are here.")
          .openPopup();
      },
      () => {
        alert("Location access denied. Showing default view.");
      }
    );
  } else {
    alert("Geolocation not supported.");
  }
}

function searchNearby() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const radius = 5000; // in meters
  const apiKey = "5ae2e3f221c38a28845f05b6"; // OpenTripMap test API key (free)
  const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${userLon}&lat=${userLat}&kinds=${query}&format=json&apikey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((place) => {
        if (place.point) {
          const marker = L.marker([place.point.lat, place.point.lon]).addTo(map);
          marker.bindPopup(place.name || "Unnamed Place");
        }
      });
    })
    .catch((err) => console.error("Error fetching nearby places:", err));
}

window.onload = initMap;