import React from 'react';
import Row from './Row'
import './Table.css'

function Table (props) {
  console.log(props.table);
  return (
    <div className="table__holder">
      <div className="table__header">
        <p>Оборотная ведомость по балансовым счетам</p>
        <p>за период с 01.01.2016 по 31.12.2016</p>
        <p>по банку</p>
        <div className="column__names">
          <div className="balance">Б/сч</div>
          <div className="in">Входящее сальдо</div>
          <div className="transact">Оборот</div>
          <div className="out">Исходящее сальдо</div>
          <div className="active">Актив</div>
          <div className="passive">Пассив</div>
          <div className="debit">Дебет</div>
          <div className='credit'>Кредит</div>
          <div className="active__t">Актив</div>
          <div className="passive__t">Пассив</div>
        </div>
      </div>
      {props.table.data ? props.table.data[0].map(rowItems => <Row items = {rowItems} />) : null}
    </div>
  )
}

export default Table;
