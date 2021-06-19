const fs = require('fs');
let file = 'file_'; //начало названия файла
let deletedStrings = 0;

// Чтение строк из файлов в 1 общую и загрузка в файл. Аргумент - последовательность для удаления
let uniteFiles = (delCombination) => {
  let res = '';
  for(let i = 0; i < 100; i++){
    if(i === 50) {
      fs.writeFileSync('UnitedFile.txt', res)
      res = '';
    }
    console.log(`read file_${i}.txt`);
    res += readFile(`${file}${i}.txt`, delCombination);
  }
  fs.appendFileSync('UnitedFile.txt', res);
  console.log(`Удалено ${deletedStrings} строк содержащих символы ${delCombination}`)
}

// Чтение файла по имени, при необходимости удаления строк строк, содержащих комбинацию символов delCombination
let readFile = (fileName, delCombination) => {
  let string = '';
  string = fs.readFileSync(fileName, 'utf-8');
  let length = 0;
  if (string.includes(delCombination)) {
    string = string.split('\n');
    length = string.length;
    string = string.filter((item => !(item.includes(delCombination))));
    deletedStrings += length - string.length;
    string = string.join('\n');
  }
  return string;
}

uniteFiles('IA');
