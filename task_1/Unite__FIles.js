const fs = require('fs');
let file = 'file_'; //начало названия файла

// Чтение строк из файлов в 1 общую и загрузка в файл
let uniteFiles = (delCombination) => {
  let res = '';
  for(let i = 0; i < 100; i++){
    res += readFile(`${file}${i}.txt`, delCombination);
  }
  fs.writeFileSync('UnitedFile.txt', res)
}

// Чтение файла по имени, при необходимости удаления строк строк, содержащих комбинацию символов delCombination
let readFile = (fileName, delCombination) => {
  let string = '';
  string = fs.readFileSync(fileName, 'utf-8');
  if (string.includes(delCombination)) {
    string = string.split('\n');
    string = string.filter((item => !(item.includes(delCombination))));
    string = string.join('\n');
  }
  return string;
}

uniteFiles('IA');
