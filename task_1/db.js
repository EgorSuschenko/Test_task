const mysql = require('mysql2');        //Библиотека для связи с mysql бд
const fs = require('fs');               //Библиотека для работы с файлами
const Sequelize = require('sequelize'); //Библиотека для работы с sql-запросами

//Создание пула подключения к локальной бд
const pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '2001sql2015243',
  database: 'test'
}).promise();


const sequelize = new Sequelize('test', 'root', '2001sql2015243', {
  logging: false,
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
  define: {
    timestamps: false,
    freezeTableName: true,

  }
});

// Определение структуры таблицы, для хранения строк из файла
const String = sequelize.define('tables', {     //создание макета полей таблицы в mysql
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  date: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  eng: {
    type: Sequelize.STRING(10),
    allowNull: false

  },
  rus: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  num: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  part: {
    type: Sequelize.FLOAT(10,8),
    allowNull: false
  },
})

// Функция для заполнения бд. fileName - имя файлов, filesQuantity - их количество.
// К сожалению загрузка получилась довольно долго, а при попытке загрузить более 10 файлов
// Происходит переполнение памяти и программа завершается с ошибкой
let fillDB = (fileName, filesQuantity) => {
  String.sync()         // Синхронизация с таблицей, созданной в бд (если её нету создаётся автоматически)
  .then(res => {
    console.log('synced');
    let string;
    for(let p = 0; p < filesQuantity; p++){
      string = fs.readFileSync(`${fileName}${p}.txt`, 'utf-8'); // Чтение файла
      string = string.split('\n');
      let tempString = [];

      // В цикле идёт создание объекта, который после будет загружен в бд. Загрузка через каждые 5000 строк
      for(let j = 0; j < 100000; j += 5000){
        for(let i = j; i < 100000 && i < j + 5000; i++) {
          tempString.push({
            date: string[i].split('||')[0],
            eng: string[i].split('||')[1],
            rus: string[i].split('||')[2],
            num: string[i].split('||')[3],
            part:string[i].split('||')[4]
          })
        }

        String.bulkCreate(tempString)   // Загрузка в бд
          .then(res => {
            console.log(`--Insertion from file_${p}.txt \nloaded ${j + 5000} strings out of ${string.length - 1}. ${(((j + 5000)/string.length) * 100).toFixed(2)}% --`);
          })
          .catch(err => {
            console.log(err);
          })
        tempString = [];
      }
    }
  })
  .then((res) => {

  })
  .catch(err => {
    console.log(err);
  });
}


// Функция суммы целых чисел через sql-запрос
let integerSum = () => {
  pool.query('select sum(num) from tables')
  .then(( [ res ] ) => {
    console.log(`Сумма целых чисел: ${res[0]['sum(num)']}`);
  })
  .then(() => {
    pool.end();
  })
  .catch(err => {
    console.log(err);
  })
}


// Функция медианы для дробных чисел
let median = () => {
  pool.query('select part from tables')
    .then(res => {
      let median;
      let sortedPart = res[0].map(item => item = item.part).sort((a,b) => a-b);
      let halfLength = (sortedPart.length) / 2 - 1;
      if (sortedPart.length % 2 === 0) {
        median = (sortedPart[halfLength] + sortedPart[halfLength + 1]) / 2;
      } else {
        median = sortedPart[Math.floor(halfLength) + 1]
      }
      console.log(`Медиана дробных чисел: ${median}`);
    })
    .then(() => {
      pool.end();
    })
    .catch(err => {
      console.log(err);
    })
}

// fillDB('file_', 10);
integerSum();
median();
