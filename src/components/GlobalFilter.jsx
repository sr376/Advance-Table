import React from 'react';
import { TextField } from '@mui/material';

export const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <TextField
    value={globalFilter || ''}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search..."
    variant="outlined"
    size="small"
    margin="normal"
  />
);
