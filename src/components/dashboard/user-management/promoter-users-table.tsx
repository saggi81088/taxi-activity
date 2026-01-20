'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

export interface PromoterUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface PromoterUsersTableProps {
  rows: PromoterUser[];
  count: number;
}

export function PromoterUsersTable({ rows, count }: PromoterUsersTableProps): React.JSX.Element {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgb(33, 43, 54)' : 'rgb(244, 246, 248)' }}>
              <TableCell>Sr No</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row: PromoterUser, index: number) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{dayjs(row.createdAt).format('MMM DD, YYYY')}</TableCell>
                <TableCell>{row.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
