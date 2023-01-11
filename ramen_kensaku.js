import fs from 'fs';
import fetch from 'node-fetch';
const API_KEY = 'af5fcb6200416309';
//const KEYWORD = 'おじんじょ';
const KEYWORD = 'らんまん食堂 恵比寿';

// https://webservice.recruit.co.jp/doc/hotpepper/reference.html
const URL = 'http://webservice.recruit.co.jp/hotpepper/shop/v1/?key=' + API_KEY + '&keyword=' + encodeURIComponent(KEYWORD) + '&format=json';
// console.log(URL);

async function main() {
  try {
    const res = await fetch(URL);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.text();
    console.log(data)
    const obj = JSON.parse(data)
    console.log('店名:' +obj.results.shop[0].name)
    console.log('住所:' +obj.results.shop[0].address)
    console.log('URL ' +obj.results.shop[0].urls.pc)
  } catch (err) {
    console.error(err);
  }
}

main();