import { Pagination } from '@mui/material';
import React from 'react';

const Panigation = ({
  count,
  page,
  setCurrent
}: {
  count: number;
  page: number;
  setCurrent: (page: number) => void;
}) => {
  return (
    <Pagination
      count={count || 1}
      page={page}
      onChange={(e, value) => {
        setCurrent(value);
      }}
      style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center'
      }}
    />
  );
};

export default Panigation;
