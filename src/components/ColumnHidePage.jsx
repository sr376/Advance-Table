import React from 'react';
import { Button } from '@mui/material';

export const ColumnHidePage = ({ setHiddenColumns }) => {
  const handleToggleColumns = () => {
    setHiddenColumns((prevHiddenColumns) =>
      prevHiddenColumns.length ? [] : ['id', 'updatedAt']
    );
  };

  return <Button onClick={handleToggleColumns}>Toggle Columns</Button>;
};
