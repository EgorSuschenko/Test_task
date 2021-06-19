const fs = require('fs')
const mysql = require('mysql2')
const express = require('express')  // Библиотека с инструментами для работы с сервером
const loadToDB = require('./task_2.js');
const multer = require('multer');   // Библиотека для работы с файлами
const cors = require('cors')


const app = express();

// разворачивание сервера

app.use(express.static(`${__dirname.replace('server', '')}build/`));

app.use(cors())

// Создания multer для загрузки файла на сервер
const upload = multer();
app.post('/upload', upload.single('file'), (req, resp) => {
  const { file } = req;
  // Функция загрузки файла в бд
  loadToDB.uploadFileToDB(file.buffer.toString());
  resp.send('table loaded')
})

// Обработка запроса GET для отправки данных из бд
app.get('/table', (req, resp) => {
  // Настройка пула подключений к бд
  const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '2001sql2015243',
    database: 'test2'
  }).promise();

  // sql- запрос в бд к 3м таблицам, для создания структуры документа
  const sql = `select i.id, i.balance as 'Б/сч', i.active as 'входящее сальдо актив', i.passive as 'входящее сальдо пассив',
               t.debit as 'оборот дебет', t.credit as 'оборот кредит', o.active as 'исходящее сальдо актив', o.passive as 'исходящее сальдо пассив'
               from income as i join transaction as t on i.id = t.id join outcome as o on i.id = o.id;`
  pool.query(sql)
  .then((res) => {
    // Отправка строк документа на сайт
    resp.send(res);
  })
  .then(() => {
    console.log('table sent');
  })
  .catch((err) => {
    console.log(err);
  })
})


app.listen(3000)
console.log('listening on 3000');
