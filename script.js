const map = L.map('map').setView([20.5937,78.9629],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19,
  attribution:'© OpenStreetMap contributors'
}).addTo(map);

let userMarker;
navigator.geolocation.getCurrentPosition(pos=>{
  const {latitude: lat, longitude: lon} = pos.coords;
  map.setView([lat,lon],14);
  userMarker = L.marker([lat,lon]).addTo(map)
    .bindPopup("You are here").openPopup();
}, ()=>alert("Location access denied."));

document.getElementById('btnSearch').onclick = searchNearby;

let currentMarkers = [];
function clearMarkers(){
  currentMarkers.forEach(m=>map.removeLayer(m));
  currentMarkers = [];
}

function searchNearby(){
  const term = document.getElementById('placeSearch').value.trim();
  if(!term) return alert("Type a place to search.");

  const center = map.getCenter();
  const query = `
    [out:json];
    (
      node["amenity"="${term}"](around:2000,${center.lat},${center.lng});
      way["amenity"="${term}"](around:2000,${center.lat},${center.lng});
      rel["amenity"="${term}"](around:2000,${center.lat},${center.lng});
    );
    out center;
  `;

  clearMarkers();
  fetch('https://overpass-api.de/api/interpreter', {
    method:'POST', body:query,
    headers:{ 'Content-Type':'application/json',
      'User-Agent':'ØrbitApp/1.0 (your-email@example.com)'
    }
  })
  .then(res=>res.json())
  .then(data=>{
    const list = document.getElementById('results');
    list.innerHTML = '';
    data.elements.forEach(el=>{
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const name = el.tags?.name || term;
      const li = document.createElement('li');
      li.textContent = name;
      li.onclick = ()=>map.setView([lat,lon],16);
      list.appendChild(li);
      
      const marker = L.marker([lat,lon]).addTo(map)
        .bindPopup(name);
      currentMarkers.push(marker);
    });
    if(data.elements.length===0){
      alert("No places found nearby.");
    }
  })
  .catch(err=>{
    console.error("Overpass error:",err);
    alert("Error fetching data.");
  });
}