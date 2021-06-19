import React from 'react';
import  './Row.css'

function Row(props) {
  return(
    <div className="row__holder">
      <div className="column balance">{props.items['Б/сч']}</div>
      <div className="column income_active">{props.items['входящее сальдо актив']}</div>
      <div className="column income_passive">{props.items['входящее сальдо пассив']}</div>
      <div className="column transaction_debit">{props.items['оборот дебет']}</div>
      <div className="column transaction_credit">{props.items['оборот кредит']}</div>
      <div className="column outcome_active">{props.items['исходящее сальдо актив']}</div>
      <div className="column outcome_passive">{props.items['исходящее сальдо пассив']}</div>
    </div>
  )
}

export default Row;
