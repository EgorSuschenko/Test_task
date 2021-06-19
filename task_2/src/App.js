import React, { useState } from 'react';
import axios from 'axios';
import Table from './table/Table'
import './App.css';

function App() {

  const [file, setFile] = useState('');
  const [table, setTable] = useState([]);

  let uploadHandler = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);
    axios.post('http://localhost:3000/upload', formData);
  }

  let clickHandler = (e) => {
    axios.get('http://localhost:3000/table').then(res => setTable(res))
    //  console.log(table);

  }

  return (
    <div className="App">
      <form method="post" encType="multipart/form-data" onSubmit = {e => uploadHandler(e)}>
        <div className = 'flex'>
          <input id="file" className = "input__file" type="file" name="testFile" onChange = {(e) => setFile(e.target.files[0])}></input>
        </div>
        <div className = 'flex'>
          <button className="btn" type="submit">Отправить файл</button>
        </div>
      </form>
      <button className="btn" onClick = {e => clickHandler(e)}>Load table</button>
      <Table table = {table ? table : null}/>
    </div>
  );
}

export default App;
