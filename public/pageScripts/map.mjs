mapboxgl.accessToken =
  "pk.eyJ1IjoidmhhdWdob2x0OTkiLCJhIjoiY2xyNmNwcnVvMGZqMjJucGFrd2tiOXFpZiJ9.Jc-HFhZbZ7lhQZQblRsPUw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
// Create a DOM element for the custom marker
const customMarkerElement = document.createElement("div");
customMarkerElement.className = "custom-marker"; // Assign a class name for styling

// Create an img element
const imgElement = document.createElement("img");
imgElement.src = "../Assets/img/icons/Logo.svg"; // Set the source of the image
imgElement.classList = "custom-marker-img";

// Append the img element to the customMarkerElement
customMarkerElement.appendChild(imgElement);

const marker2 = new mapboxgl.Marker({
  element: customMarkerElement,
  rotation: -45,
})
  .setLngLat([12.65147, 55.608166])
  .addTo(map);
