const fs = require('fs');

// Генерация случайной даты за последние 5 лет
let setDate = () => {
  let date;
  let res;
  date = new Date(Date.now() - Math.random()*157700000000)
  res = `${date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()}.${date.getMonth() + 1 <= 9 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`;
  return res;
}

// Генерация случайной последовательности английских букв
let setEnLetter = () => {
  let en = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let res = '';
  for(let i = 0; i < 10; i++) {
    res += en[Math.floor(Math.random()*en.length)];
  }
  return res;
}

// Генерация случайно последовательности русских букв
let setRuLetter = () => {
  let rus = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  let res = '';
  for(let i = 0; i < 10; i++) {
    res += rus[Math.floor(Math.random()*rus.length)];
  }
  return res;
}


// Создание файла с необходимой последовательностью строк
let createFile = (name) => {
  let num = 100000000;
  let res = '';
  for(let i = 0; i < 100000; i++){
    res += `${setDate()}||${setEnLetter()}||${setRuLetter()}||${Math.floor(Math.random()*num)}||${((Math.random()*20).toFixed(8))/*.toString().replace('.', ',')*/}||\n`;
  }
  fs.writeFileSync(`${name}.txt`, res);
}

for (let i = 0; i < 100; i++) {
  createFile(`file_${i}`);
  console.log(`Created file_${i}.txt`);
}
