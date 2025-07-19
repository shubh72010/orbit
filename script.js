let map = L.map("map").setView([28.6139, 77.209], 13); // Default to Delhi

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

let userMarker, routeControl;

// Get User Location
navigator.geolocation.watchPosition(
  (pos) => {
    const latlng = [pos.coords.latitude, pos.coords.longitude];
    if (!userMarker) {
      userMarker = L.marker(latlng).addTo(map).bindPopup("You");
      map.setView(latlng, 15);
    } else {
      userMarker.setLatLng(latlng);
    }
  },
  (err) => {
    alert("Enable location to use Ørbit!");
  }
);

// Center Map on User
function centerMap() {
  if (userMarker) {
    map.setView(userMarker.getLatLng(), 15);
  }
}

// Route Navigation
function routeTo() {
  const input = document.getElementById("destination").value;
  if (!input.includes(",")) {
    alert("Enter destination as lat,lng");
    return;
  }

  const [lat, lng] = input.split(",").map(Number);
  if (routeControl) map.removeControl(routeControl);

  routeControl = L.Routing.control({
    waypoints: [
      userMarker.getLatLng(),
      L.latLng(lat, lng)
    ],
    routeWhileDragging: false,
    show: false,
    collapsible: true
  }).addTo(map);
}