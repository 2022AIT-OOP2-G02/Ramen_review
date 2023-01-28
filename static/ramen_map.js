const DEFAULT_LATLNG = [35.176370507601106, 137.10632646220583];

const main = async () => {
    const map = L.map('map').setView(DEFAULT_LATLNG, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markers = new Set();
    map.on('moveend', displayRamenShop.bind(null, map, markers));
    map.on('popupclose', movePrev);

    document.getElementById('prev').onclick = movePrev;
    document.getElementById('search-wrapper').onsubmit = searchShop;
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

    displayShopList(ramenShopsData.results.shop, '周辺の店');
};

const getProperRange = (zoom) => {
    if (zoom >= 18) return { level: 1, meter: 300 };
    if (zoom >= 17) return { level: 2, meter: 500 };
    if (zoom >= 16) return { level: 3, meter: 1000 };
    if (zoom >= 15) return { level: 4, meter: 2000 };
    return { level: 5, meter: 3000 };
};

const displayRamenShopDetail = (shopInfo, e) => {
    displayShopInfo(shopInfo);
};

// ハリボテ
const displayRanking = () => {
    displayShopList([], 'ランキング');
    return;
};

const movePrev = () => {
    document.getElementById('ranking').dataset.show = 'list';
};

const displayShopInfo = async (shop) => {
    document.getElementById('ranking').dataset.show = 'page';
    document.getElementById('status').textContent = 'レビュー';

    const reviewData = await fetchWithParams('/review_get', { id: shop.id }) ?? [];

    const reviewItemTem = document.getElementById('review-item-tem');
    const reviewDoms = reviewData.map(v => {
        const reviewDataDom = reviewItemTem.content.cloneNode(true);
        reviewDataDom.querySelector('.write-name').innerText = v.write_name ?? "No Name";
        reviewDataDom.querySelector('.review-point').innerText = v.review_point ?? 0;
        reviewDataDom.querySelector('.review').innerText = v.review ?? "レビューはありません";
        return reviewDataDom;
    });

    const shopDom = createShopInfoDom(shop);
    shopDom.querySelector(".shop-review").replaceChildren(...reviewDoms);

    document.querySelector("#shop-page").replaceChildren(shopDom);
};

const searchShop = async (e) => {
    e.preventDefault();
    const ramenShopsData = await fetchWithParams("/api/ramen-shop", {
        large_area: "Z033",
        genre: "G013",
        format: "json",
        keyword: e.target.text.value,
        count: 100
    });

    displayShopList(ramenShopsData.results.shop, `${e.target.text.value}の検索結果`);
};

const displayShopList = (shopList, status) => {
    document.getElementById('ranking').dataset.show = 'list';
    document.getElementById('status').textContent = status;

    const shopDoms = shopList.map(createShopInfoDom);
    document.getElementById('shop-list').replaceChildren(...shopDoms);
};

const createShopInfoDom = (shop) => {
    const shopDom = document.getElementById('shop-item-tem').content.cloneNode(true);
    shopDom.querySelector('.shop-logo-image').src = shop.logo_image;
    shopDom.querySelector('.shop-name-kana').textContent = shop.name_kana;
    shopDom.querySelector('.shop-name').textContent = shop.name;
    return shopDom;
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
