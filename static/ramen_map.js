const API_KEY = "xxx";

const main = async () => {
    const map = L.map('map').setView([35.176370507601106, 137.10632646220583], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const url = new URL("/api/ramen-shop", window.location);
    url.search = new URLSearchParams({
        key: API_KEY,
        keyword: "ラーメン",
        genre: "G013",
        middle_area: "Y200",
        format: "json",
    });
    const response = await fetch(url);
    if (!response.ok) {
        console.error(response);
        return;
    };
    const json = await response.json();
    console.log(json);
};

window.onload = main;
