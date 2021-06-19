const fs = require('fs');
const Sequelize = require('sequelize')

const sequelize = new Sequelize('test2', 'root', '2001sql2015243', {
  logging: false,
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
  define: {
    timestamps: false,
    freezeTableName: true,
  }
})

// Создание прототипов таблиц для исходного документа
// Таблица, содержащая данные входящего сальдо
const Income = sequelize.define('income', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  balance: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  active: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  passive: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

// Таблица, содержащая данные оборота
const Transactions = sequelize.define('transaction', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  balance: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  debit: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  credit: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

// Таблица, содержащая данны исходящего сальдо
const Outcome = sequelize.define('outcome', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  balance: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  active: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  passive: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

// Функция загрузки данных из файла в бд
module.exports.uploadFileToDB = (rawString) => {
  // Обработка данных из файла. Разбиваем на строки, при этом первые строки с названием удаляем
  let loadedString = rawString;
  loadedString = loadedString.split('\r\n');
  loadedString = loadedString.slice(6);

  // Массивы, содержащие данные из файла разбитые на 3 категории
  // Массив данных входящего сальдо
  let income = [loadedString[0].split(';')[1]];
  // Массив данных оборота
  let transactions = [loadedString[0].split(';')[3]];
  // Массив данных исходящего сальдо
  let outcome = [loadedString[0].split(';')[5]];

  income.push([loadedString[0].split(';')[0], loadedString[1].split(';')[1],loadedString[1].split(';')[2]].join(';'));
  for(let i = 2; i < loadedString.length; i++) {
    income.push([loadedString[i].split(';')[0], loadedString[i].split(';')[1],loadedString[i].split(';')[2]].join(';'));
  }

  transactions.push([loadedString[0].split(';')[0], loadedString[1].split(';')[3],loadedString[1].split(';')[4]].join(';'));
  for(let i = 2; i < loadedString.length; i++) {
    transactions.push([loadedString[i].split(';')[0], loadedString[i].split(';')[3],loadedString[i].split(';')[4]].join(';'));
  }

  outcome.push([loadedString[0].split(';')[0], loadedString[1].split(';')[5],loadedString[1].split(';')[6]].join(';'));
  for(let i = 2; i < loadedString.length; i++) {
    outcome.push([loadedString[i].split(';')[0], loadedString[i].split(';')[5],loadedString[i].split(';')[6]].join(';'));
  }



  // Загрузка в бд данных входящего сальдо
  Income.sync()
  .then(res => {
    console.log('Synced with income table');
  })
  .then(() => {
    let tempIncome = [];
    // Преобразование массива данных в массив объектов по полям таблицы
    for(let i = 3; i < income.length - 1; i++){
      if(income[i].includes('ПО КЛАССУ')) {
        tempIncome.push({
          balance: income[i].split(';')[0],
          active:  parseFloat(income[i].split(';')[1]
            .replace(/\s/g, '').replace(',', '.')),
          passive: parseFloat(income[i].split(';')[2]
            .replace(/\s/g, '').replace(',', '.'))
        })
      }
      if(!income[i].includes('КЛАСС')) {
        tempIncome.push({
          balance: income[i].split(';')[0],
          active:  parseFloat(income[i].split(';')[1]
            .replace(/\s/g, '').replace(',', '.')),
          passive: parseFloat(income[i].split(';')[2]
            .replace(/\s/g, '').replace(',', '.'))
        })
      }
    }
    // Загрузка данных в бд
    Income.bulkCreate(tempIncome)
    .finally((res) => {
      console.log(`income insertion completed\n`);
    })
    .catch((err) => {
      console.log(err);
    })

  })
  .catch((err) => {
    console.log(err);
  })


  // Загрузка в бд данных оборота
  Transactions.sync()
    .then(res => {
      console.log('Synced with transaction table');
    })
    .then(() => {
      let tempTransactions = [];
      for(let i = 3; i < transactions.length - 1; i++){
        if(transactions[i].includes('ПО КЛАССУ')) {
          tempTransactions.push({
            balance: transactions[i].split(';')[0],
            debit:  parseFloat(transactions[i].split(';')[1]
              .replace(/\s/g, '').replace(',', '.')),
            credit: parseFloat(transactions[i].split(';')[2]
              .replace(/\s/g, '').replace(',', '.'))
          })
        }
        if(!transactions[i].includes('КЛАСС')) {
          tempTransactions.push({
            balance: transactions[i].split(';')[0],
            debit:  parseFloat(transactions[i].split(';')[1]
              .replace(/\s/g, '').replace(',', '.')),
            credit: parseFloat(transactions[i].split(';')[2]
              .replace(/\s/g, '').replace(',', '.'))
          })
        }
      }
      Transactions.bulkCreate(tempTransactions)
      .finally((res) => {
        console.log(`transaction insertion completed\n`);
      })
      .catch((err) => {
        console.log(err);
      })

    })
    .catch((err) => {
      console.log(err);
    })

  // Загрузка в бд данных исходящего сальдо
  Outcome.sync()
    .then(res => {
      console.log('Synced with outcome table');
    })
    .then(() => {
      let tempOutcome = [];
      for(let i = 3; i < outcome.length - 1; i++){
        if(outcome[i].includes('ПО КЛАССУ')) {
          tempOutcome.push({
            balance: outcome[i].split(';')[0],
            active:  parseFloat(outcome[i].split(';')[1]
              .replace(/\s/g, '').replace(',', '.')),
            passive: parseFloat(outcome[i].split(';')[2]
              .replace(/\s/g, '').replace(',', '.'))
            })
        }
        if(!outcome[i].includes('КЛАСС')) {
          tempOutcome.push({
            balance: outcome[i].split(';')[0],
            active:  parseFloat(outcome[i].split(';')[1]
              .replace(/\s/g, '').replace(',', '.')),
            passive: parseFloat(outcome[i].split(';')[2]
              .replace(/\s/g, '').replace(',', '.'))
          })
        }
      }
      Outcome.bulkCreate(tempOutcome)
      .finally((res) => {
        console.log(`outcome insertion completed\n`);
      })
      .catch((err) => {
        console.log(err);
      })

    })
    .catch((err) => {
      console.log(err);
    })
}



// console.log(income);
