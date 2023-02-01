const DEFAULT_LATLNG = [35.176370507601106, 137.10632646220583];
const global = {};

const main = async () => {
    const map = L.map('map').setView(DEFAULT_LATLNG, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markers = new Map();
    Object.assign(global, { map, markers, mapmode: 'near' });

    map.on('moveend', displayNearShop);
    map.on('popupclose', movePrev);

    document.getElementById('prev').onclick = movePrev;
    document.getElementById('clear-search').onclick = clearSearch;
    document.getElementById('search-wrapper').onsubmit = searchShop;

    displayNearShop();
};

const displayNearShop = async () => {
    const { map, markers, mapmode } = global;
    if (mapmode !== 'near') return;
    const center = map.getCenter();
    const range = getProperRange(map.getZoom());
    const shopList = await fetchShopData({
        lat: center.lat,
        lng: center.lng,
        range: range.level
    });
    console.log(shopList);
    setShopMarkers(shopList);

    const circle = L.circle(center, {
        radius: range.meter,
        color: 'blue',
        fillColor: '#399ade',
        fillOpacity: 0.5
    });
    circle.addTo(map);
    markers.set('marker', circle);

    displayShopList(shopList, '周辺の店');
};

const setShopMarkers = (shopList) => {
    const { markers, map } = global;

    for (const [key, marker] of markers) {
        if (shopList.some(v => v.id === key)) continue;
        map.removeLayer(marker);
        markers.delete(key);
    }

    for (const shop of shopList) {
        if (markers.has(shop.id)) continue;
        const marker = L.marker([shop.lat, shop.lng]);
        marker.bindPopup(shop.name);
        marker.addTo(map);
        marker.on('click', displayRamenShopDetail.bind(null, shop));
        markers.set(shop.id, marker);
    }
};

const getProperRange = (zoom) => {
    if (zoom >= 18) return { level: 1, meter: 300 };
    if (zoom >= 17) return { level: 2, meter: 500 };
    if (zoom >= 16) return { level: 3, meter: 1000 };
    if (zoom >= 15) return { level: 4, meter: 2000 };
    return { level: 5, meter: 3000 };
};

const movePrev = (e) => {
    const { map } = global;
    document.getElementById('ranking').dataset.show = 'list';
    if (e.type !== 'popupclose') map.closePopup();
};

const displayRamenShopDetail = (shop) => {
    document.getElementById('ranking').dataset.show = 'page';

    const reviewAddTem = document.getElementById('review-add-tem');
    const jumpReviewPage = reviewAddTem.content.cloneNode(true);
    jumpReviewPage.querySelector('a.review-item').href = `/review_get?id=${shop.id}`;

    const reviewItemTem = document.getElementById('review-item-tem');
    const reviewDoms = shop.review.map(v => {
        const reviewDataDom = reviewItemTem.content.cloneNode(true);
        reviewDataDom.querySelector('.write-name').innerText = v.write_name ?? "No Name";
        reviewDataDom.querySelector('.review-point').innerText = v.review_point ?? 0;
        reviewDataDom.querySelector('.review').innerText = v.review ?? "レビューはありません";
        return reviewDataDom;
    });

    const shopDom = createShopInfoDom(shop);
    shopDom.querySelector(".shop-review").replaceChildren(jumpReviewPage, ...reviewDoms);

    document.querySelector("#shop-page").replaceChildren(shopDom);
};

const searchShop = async (e) => {
    e.preventDefault();
    const shopList = await fetchShopData({
        large_area: "Z033",
        keyword: e.target.text.value
    });

    document.getElementById('ranking').dataset.show = 'list';
    global.mapmode = 'search';
    setShopMarkers(shopList);
    displayShopList(shopList, `${e.target.text.value}の検索結果`);
};

const clearSearch = () => {
    document.getElementById('search-text').value = '';
    global.mapmode = 'near';
    displayNearShop();
};

const displayShopList = (shopList, status) => {
    document.getElementById('status').textContent = status;
    shopList.sort((a, b) => a.point_average - b.point_average);

    const shopDoms = shopList.map(createShopInfoDom);
    document.getElementById('shop-list').replaceChildren(...shopDoms);
};

const createShopInfoDom = (shop) => {
    const shopDom = document.getElementById('shop-item-tem').content.cloneNode(true);
    shopDom.querySelector('.shop-logo-image').src = getPhotoUrl(shop);
    shopDom.querySelector('.shop-name-kana').textContent = shop.catch || shop.genre.catch;
    shopDom.querySelector('.shop-name').textContent = shop.name;
    shopDom.querySelector('.shop-point').textContent = shop.point_average;
    shopDom.querySelector('.shop-info').onclick = () => {
        const { map, markers } = global;
        const marker = markers.get(shop.id);
        displayRamenShopDetail(shop);
        if (marker === undefined) return;
        marker.openPopup();
        map.setView(marker.getLatLng());
    };
    return shopDom;
};

const getPhotoUrl = (shop) =>
    shop.photo.pc.l ?? shop.photo.pc.m ?? shop.photo.pc.s
    ?? shop.mobile.pc.l ?? shop.mobile.pc.m ?? shop.mobile.pc.s;

const fetchShopData = async (params) => {
    Object.assign(params, {
        genre: "G013",
        format: "json",
        count: 100
    });

    const res = await fetchWithParams('/api/ramen-shop', params);
    const shopList = res.results.shop;

    for (const shop of shopList) {
        const review = await fetchWithParams('/review_get/json', { id: shop.id });
        shop.review = review;
        shop.point_average = review.length
            ? review.reduce((p, c) => p + c.review_point ?? 0, 0) / review.length | 0
            : undefined;
    }

    return shopList;
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
};

window.onload = main;
