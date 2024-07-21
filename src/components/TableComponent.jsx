import React, { useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useGroupBy,
  useColumnOrder,
  useColumnVisibility,
} from '@tanstack/react-table';
import {
  TextField,
  Slider,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Button,
  IconButton,
  Drawer,
  FormControl,
  InputLabel,
  FormControlLabel,
} from '@mui/material';
import { format } from 'date-fns';
import { FaFilter, FaSort, FaColumns, FaEye } from 'react-icons/fa';

const TableComponent = ({ data }) => {
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isColumnPanelOpen, setColumnPanelOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const columns = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
      Filter: GlobalFilter,
    },
    {
      Header: 'Category',
      accessor: 'category',
      Filter: FacetFilter,
    },
    {
      Header: 'Subcategory',
      accessor: 'subcategory',
      Filter: FacetFilter,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Filter: RangeFilter,
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ value }) => format(new Date(value), 'dd-MMM-yyyy HH:mm'),
      Filter: DateRangeFilter,
    },
    {
      Header: 'Updated At',
      accessor: 'updatedAt',
      Cell: ({ value }) => format(new Date(value), 'dd-MMM-yyyy HH:mm'),
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter: setGlobalFilterTanstack,
    setColumnOrder,
    setColumnVisibility,
    state: { globalFilter: globalFilterState, columnVisibility },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: ['id'],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useGroupBy,
    useColumnOrder,
    useColumnVisibility,
  );

  const uniqueCategories = useMemo(() => [...new Set(data.map(item => item.category))], [data]);
  const uniqueSubcategories = useMemo(() => [...new Set(data.map(item => item.subcategory))], [data]);

  const handleFilterPanelToggle = () => setFilterPanelOpen(!isFilterPanelOpen);
  const handleColumnPanelToggle = () => setColumnPanelOpen(!isColumnPanelOpen);

  const FacetFilter = ({ column: { filterValue, setFilter, id } }) => (
    <Select
      multiple
      value={filterValue || []}
      onChange={(e) => setFilter(e.target.value || undefined)}
      renderValue={(selected) => selected.join(', ')}
    >
      {(id === 'category' ? uniqueCategories : uniqueSubcategories).map(value => (
        <MenuItem key={value} value={value}>
          <Checkbox checked={filterValue?.includes(value) || false} />
          <ListItemText primary={value} />
        </MenuItem>
      ))}
    </Select>
  );

  const RangeFilter = ({ column: { filterValue, setFilter } }) => (
    <Slider
      value={filterValue || [0, 1000]}
      onChange={(e, newValue) => setFilter(newValue)}
      valueLabelDisplay="auto"
      min={0}
      max={1000}
    />
  );

  const DateRangeFilter = ({ column: { filterValue, setFilter } }) => (
    <TextField
      type="date"
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
    />
  );

  const GlobalFilter = ({ filterValue, setFilter }) => (
    <TextField
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Search all columns"
    />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <IconButton onClick={handleFilterPanelToggle}>
            <FaFilter />
          </IconButton>
          <IconButton onClick={handleColumnPanelToggle}>
            <FaColumns />
          </IconButton>
        </div>
        <GlobalFilter filterValue={globalFilterState} setFilter={setGlobalFilterTanstack} />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem' }}>
        <Button onClick={() => setColumnOrder(['name', 'category', 'subcategory', 'price', 'createdAt', 'updatedAt'])}>
          Reorder Columns
        </Button>
      </div>
      <Drawer anchor="right" open={isFilterPanelOpen} onClose={handleFilterPanelToggle}>
        <div style={{ width: 300, padding: '1rem' }}>
          <h3>Filters</h3>
          <FormControl>
            <InputLabel>Category</InputLabel>
            <FacetFilter column={{ filterValue: selectedCategories, setFilter: setSelectedCategories, id: 'category' }} />
          </FormControl>
          <FormControl>
            <InputLabel>Subcategory</InputLabel>
            <FacetFilter column={{ filterValue: selectedSubcategories, setFilter: setSelectedSubcategories, id: 'subcategory' }} />
          </FormControl>
          <FormControl>
            <InputLabel>Price Range</InputLabel>
            <RangeFilter column={{ filterValue: priceRange, setFilter: setPriceRange }} />
          </FormControl>
          <FormControl>
            <InputLabel>Date Range</InputLabel>
            <DateRangeFilter column={{ filterValue: dateRange, setFilter: setDateRange }} />
          </FormControl>
        </div>
      </Drawer>
      <Drawer anchor="right" open={isColumnPanelOpen} onClose={handleColumnPanelToggle}>
        <div style={{ width: 300, padding: '1rem' }}>
          <h3>Column Visibility</h3>
          {columns.map(column => (
            <FormControlLabel
              key={column.accessor}
              control={
                <Checkbox
                  checked={!columnVisibility[column.accessor]}
                  onChange={() => setColumnVisibility({ ...columnVisibility, [column.accessor]: !columnVisibility[column.accessor] })}
                />
              }
              label={column.Header}
            />
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default TableComponent;
