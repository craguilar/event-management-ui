import * as React from "react";
import DataTable from 'react-data-table-component';
import Button from "react-bootstrap/Button"

// Properties 
export interface GuestListProps {
  eventId?: string
}


export class GuestList extends React.Component<GuestListProps> {


  columns = [
    {
      name: 'First Name',
      selector: (row: any) => row.firstName,
      sortable: true
    },
    {
      name: 'Last Name',
      selector: (row: any) => row.lastName,
      sortable: true
    },
    {
      name: 'Guest of',
      selector: (row: any) => row.guestOf,
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
    },
    {
      name: 'Phone',
      selector: (row: any) => row.phone,
    },
    {
      name: 'Tentative',
      selector: (row: any) => row.isTentative,
    },
    {
      name: 'Country',
      selector: (row: any) => row.country,
      sortable: true
    },
    {
      name: 'State',
      selector: (row: any) => row.state,
    },
    {
      name: 'No. Of seats',
      selector: (row: any) => row.numberOfSeats,
    }

  ];

  data = [
    {
      "firstName": "John",
      "lastName": "Doe",
      "guestOf": "Bride",
      "numberOfSeats": 1
    },
    {
      "firstName": "Elon",
      "lastName": "Musk",
      "guestOf": "Bride",
      "numberOfSeats": 1
    }
  ]
  convertArrayOfObjectsToCSV(array: any[]) {
    let result: string;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(this.data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  downloadCSV(array: any[]) {
    const link = document.createElement('a');
    let csv = this.convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  render() {
    return (<div>
      <DataTable
        columns={this.columns}
        data={this.data}
        actions={<Button onClick={() => { this.downloadCSV(this.data) }} as="input" type="button" value="Export" />}
        selectableRows
        pagination
        highlightOnHover
      />
    </div>)
  }
}