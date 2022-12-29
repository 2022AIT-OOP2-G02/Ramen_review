const RANGE_PATTERN = { 1: 300, 2: 500, 3: 1000, 4: 2000, 5: 3000 };
const RANGE_VALUE = 5;

const DEFAULT_LATLNG = [35.176370507601106, 137.10632646220583];

const main = async () => {
    const map = L.map('map').setView(DEFAULT_LATLNG, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    const markers = new Set();
    let circle;
    map.on('moveend', async (e) => {
        const center = map.getCenter();
        const json = await fetchRamenShop({
            lat: center.lat,
            lng: center.lng,
            range: RANGE_VALUE,
        });

        for (const marker of markers) {
            map.removeLayer(marker);
            markers.delete(marker);
        }

        if (circle) {
            map.removeLayer(circle);
            circle = undefined;
        }

        circle = L.circle(center, {
            radius: RANGE_PATTERN[RANGE_VALUE],
            color: 'blue',
            fillColor: '#399ade',
            fillOpacity: 0.5
        }).addTo(map);

        for (const shop of json.shop) {
            const marker = L.marker([shop.lat, shop.lng]);
            marker.bindPopup(shop.name);
            marker.addTo(map);
            markers.add(marker);
        }
    });
};

const fetchRamenShop = async (serchParam) => {
    const url = new URL("/api/ramen-shop", window.location);
    url.search = new URLSearchParams({
        ...serchParam,
        genre: "G013",
        format: "json",
    });
    const response = await fetch(url);
    if (!response.ok) {
        console.error(response);
        return;
    };
    const json = await response.json();
    return json.results;
};

window.onload = main;
