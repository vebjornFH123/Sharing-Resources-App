import { getData } from "../../modules/methods.mjs";
const accessToken =
  "pk.eyJ1IjoidmhhdWdob2x0OTkiLCJhIjoiY2xyNmNwcnVvMGZqMjJucGFrd2tiOXFpZiJ9.Jc-HFhZbZ7lhQZQblRsPUw";

mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [8.468946, 51.507351], // starting position [lng, lat]
  zoom: 0,
});

async function addMarkers(resource) {
  try {
    const addressPosition = `https://api.mapbox.com/geocoding/v5/mapbox.places/${resource.country} ${resource.address} ${resource.zipcode}.json?access_token=${accessToken}`;
    const response = await getData(addressPosition);

    if (response.ok) {
      const data = await response.json();
      const markerPosition = data.features[0].center;
      console.log(markerPosition);
      const marker = new mapboxgl.Marker().setLngLat(markerPosition).addTo(map);
    }
  } catch (err) {
    console.log(err);
  }
}

getData("/resource/userId/233")
  .then((respon) => {
    if (respon.ok) {
      return respon.json();
    }
  })
  .then(async (data) => {
    const resources = JSON.parse(data);
    await Promise.all(
      resources.map(async (resource) => {
        await addMarkers(resource);
      })
    );
  })
  .catch((err) => {
    console.log(err);
  });
