const mapElement = document.getElementById("map");

let coordinates;

if (mapElement.dataset.coordinates) {
    coordinates = JSON.parse(mapElement.dataset.coordinates);
} else {
    // Default: Nagpur
    coordinates = [77.4085, 12.6576];
}

const listingLocation = mapElement.dataset.location || "Location not available";
const country = mapElement.dataset.country || "";
const title = mapElement.dataset.title
const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    13
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`<b>location here</b>`)
    .openPopup();