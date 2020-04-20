'use strict';
const fs = require('fs') //使いたいライブラリ名を指定する、ファイル読み込み・書き出し
const readline = require('readline') //どのように読んでいくか、1行ずつ読む
const rs = fs.createReadStream('./popu-pref.csv'); //streamにする
const rl = readline.createInterface({'input': rs, 'output': {}}); //1行ずつ読み込み発動
const prefectureDateMap = new Map(); //key：都道府県　value：集計データのオブジェクト
rl.on('line', (lineString) => { //1行読めたら
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDateMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDateMap) { //2つの変数に同時に代入
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    })
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}： ${value.popu10} -> ${value.popu15}　変化率： ${value.change}`
    })
    console.log(rankingStrings);
});