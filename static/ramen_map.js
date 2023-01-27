const DEFAULT_LATLNG = [35.176370507601106, 137.10632646220583];

const main = async () => {
    const map = L.map('map').setView(DEFAULT_LATLNG, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markers = new Set();
    map.on('moveend', displayRamenShop.bind(null, map, markers));
    map.on('popupclose', setShopInfo.bind(null, undefined));
};

const displayRamenShop = async (map, markers) => {
    const center = map.getCenter();
    const range = getProperRange(map.getZoom());
    const ramenShopsData = await fetchWithParams("/api/ramen-shop", {
        lat: center.lat,
        lng: center.lng,
        range: range.level,
        genre: "G013",
        format: "json",
        count: 100
    });

    for (const marker of markers) {
        map.removeLayer(marker);
        markers.delete(marker);
    }

    const circle = L.circle(center, {
        radius: range.meter,
        color: 'blue',
        fillColor: '#399ade',
        fillOpacity: 0.5
    });
    circle.addTo(map);
    markers.add(circle);

    console.log(ramenShopsData);
    for (const shop of ramenShopsData.results.shop) {
        const marker = L.marker([shop.lat, shop.lng]);
        marker.bindPopup(shop.name);
        marker.addTo(map);
        marker.on('click', displayRamenShopDetail.bind(null, shop));
        markers.add(marker);
    }
};

const getProperRange = (zoom) => {
    if (zoom >= 18) return { level: 1, meter: 300 };
    if (zoom >= 17) return { level: 2, meter: 500 };
    if (zoom >= 16) return { level: 3, meter: 1000 };
    if (zoom >= 15) return { level: 4, meter: 2000 };
    return { level: 5, meter: 3000 };
};

const displayRamenShopDetail = (shopInfo, e) => {
    setShopInfo(shopInfo);
};

const setShopInfo = async (shopInfo) => {
    const mainDom = document.querySelector("#main");
    if (shopInfo === undefined) {
        mainDom.dataset.show = 'ranking'
        return;
    }

    const reviewData = await fetchWithParams('/review_get', { id: shopInfo.id }) ?? [];
     [];

    const reviewItemTem = document.getElementById('review-item-tem');
    const reviewDoms = reviewData.map(v => {
        const reviewDataDom = reviewItemTem.content.cloneNode(true);
        reviewDataDom.querySelector('.write-name').innerText = v.write_name ?? "No Name";
        reviewDataDom.querySelector('.review-point').innerText = v.review_point ?? 0;
        reviewDataDom.querySelector('.review').innerText = v.review ?? "レビューはありません";
        return reviewDataDom;
    });

    mainDom.dataset.show = 'shop-info'

    mainDom.querySelector("#shop-logo-image").src = shopInfo.logo_image;
    mainDom.querySelector("#shop-name-kana").innerText = shopInfo.name_kana;
    mainDom.querySelector("#shop-name").innerText = shopInfo.name;
    mainDom.querySelector("#shop-review").replaceChildren(...reviewDoms);
};

const fetchWithParams = async (urlStr, params) => {
    const url = urlStr.startsWith("/") ? new URL(urlStr, window.location) : new URL(urlStr);
    url.search = new URLSearchParams(params);
    const response = await fetch(url);
    if (!response.ok) {
        console.error(response);
        return;
    };
    return await response.json();
}

window.onload = main;
