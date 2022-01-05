import React, { useState, useEffect } from 'react';
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from '../Table';

const txnTypeMap = {
  PRIVI_credit_creation: 'Creation',
  PRIVI_credit_deposit: 'Lent',
  PRIVI_credit_borrowing: 'Borrowed',
  PRIVI_credit_collateral: 'Collateral',
  PRIVI_credit_interest: 'Interest',
  PRIVI_credit_withdraw: 'Withdraw',
  PRIVI_credit_modified: 'Modified',
  PRIVI_risk_taking: 'Assume Risk',

  NFT_Pod_Selling: 'Sell',
  NFT_Pod_Buying: 'Buy',

  POD_Minting: 'Mint',
  POD_Buying: 'Buy',
};

export default function TradingHistory(props) {
  const [datedList, setDatedList] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    const headers: Array<CustomTableHeaderInfo> = [{
        headerName: "TOKEN"
      }, {
        headerName: "TYPE"
      }, {
        headerName: "TOKEN"
      }, {
        headerName: "PRICE"
      }, {
        headerName: "PRICE(USD)"
      }, {
        headerName: "QUANTITY"
      }, {
        headerName: "FROM"
      }, {
        headerName: "TO"
      }
    ];
    if (props.history && props.history.length > 0 && props.history[0].To) {
      headers.push({
        headerName: "ADDRESS"
      });
    }
    headers.push({headerName: "DATE"});
    headers.push({headerName: "TIME"});
    headers.push({headerName: "STATUS"});
    headers.push({headerName: "PRIVISCAN"});

    setTableHeaders(headers);

    if (props.history && props.history.length > 0) {
      const historySorted = [...props.history];
      historySorted.sort((a, b) => b.Date - a.Date);

      const sortedList = [] as any;

      historySorted.forEach((elem) => {
        let time = '';
        if (elem.Date) {
          const date = new Date(elem.Date * 1000);
          const minutes =
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
          const seconds =
            date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
          const day = date.getUTCDate();
          const month = date.getUTCMonth() + 1; //months from 1-12
          const year = date.getUTCFullYear();
          time = `${minutes}:${seconds} - ${day}/${month}/${year}`;
        }

        sortedList.push({
          type: txnTypeMap[elem.Type] ?? elem.Type,
          token: elem.Token || "",
          amount: elem.Amount || "",
          amountUSD: elem.AmountUSD || "",
          quantity: elem.Quantity || "",
          from: elem.From || "",
          to: elem.To || "",
          date: elem.Date || "",
          status: elem.Status || "",
          address: (elem.To = props.address ? elem.To : elem.From),
          time: time || "",
          id: elem.Id,
        });
      });

      setDatedList(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (datedList && datedList.length) {
      data = datedList.map((row) => {
        let oneRow: Array<CustomTableCellInfo> = [
          {
            cell: (
              <div style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '80px',
              }}>
                {row.type}
              </div>
            )
          }, {
            cell: row.token,
          }, {
            cell: row.amount ? row.amount.toFixed(3) : "",
          }, {
            cell: row.amountUSD,
          }, {
            cell: row.quantity,
          }, {
            cell: row.from,
          }, {
            cell: row.to,
          }
        ];
        if (row.address && row.address.length > 0) {
          oneRow.push({
            cell: (
              <p
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '80px',
                  maxWidth: '80px',
                  color: '#656E7E',
                }}
              >
                {row.address}
              </p>
            )
          });
        }
        oneRow.push({ cell: row.date });
        oneRow.push({
          cell: (
            <div style={{color: 'rgba(101, 110, 126, 0.7)'}}>
              {row.time}
            </div>
          )
        });
        oneRow.push({ cell: row.status });
        oneRow.push({
          cell: (
            row.id
            ? <a
                target="_blank"
                rel="noopener noreferrer"
                href={'https://priviscan.io/tx/' + row.id}
              >
                {row.id?.substring(0, 10) + '...'}
              </a>
            : ""
          )
        });

        return oneRow;
      });
    }

    setTableData(data);
  }, [datedList]);

  return (
    <CustomTable
      headers={tableHeaders}
      rows={tableData}
      placeholderText="No trading history to show"
    />
  );
}
