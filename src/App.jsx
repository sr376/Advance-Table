import React from 'react';
import TableComponent from './components/TableComponent';
import data from './data';

const App = () => (
  <div>
    <h1>Data Table</h1>
    <TableComponent data={data} />
  </div>
);

export default App;



