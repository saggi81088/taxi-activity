'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

export interface Taxi {
  id: string;
  taxiNumber: string;
  driverName: string;
  driverEmail?: string;
  phone: string;
  ownerName?: string;
  location: string;
  status: string;
  createdAt: Date;
}

interface TaxisTableProps {
  count?: number;
  page?: number;
  rows?: Taxi[];
  rowsPerPage?: number;
}

export function TaxisTable({
  count: _count = 0,
  rows = [],
  page: _page = 0,
  rowsPerPage: _rowsPerPage = 0,
}: TaxisTableProps): React.JSX.Element {
  
  const rowIds = React.useMemo(() => {
    return rows.map((taxi) => taxi.id);
  }, [rows]);

  const { selected, selectAll, deselectAll, selectOne, deselectOne } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page_, setPage_] = React.useState(0);
  const [rowsPerPage_, setRowsPerPage_] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage_(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newRowsPerPage = Number.parseInt(event.target.value, 10);
    setRowsPerPage_(newRowsPerPage);
    setPage_(0);
  };

  // Calculate paginated rows
  const paginatedRows = React.useMemo(() => {
    const startIndex = page_ * rowsPerPage_;
    const endIndex = startIndex + rowsPerPage_;
    const sliced = rows.slice(startIndex, endIndex);
    return sliced;
  }, [rows, page_, rowsPerPage_]);

  return (
    <Box>
      {rows.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              No taxis found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: '800px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAll}
                        indeterminate={selectedSome}
                        onChange={(event): void => {
                          if (event.target.checked) {
                            selectAll?.();
                          } else {
                            deselectAll?.();
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Taxi Number</TableCell>
                    <TableCell>Driver Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Owner Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Promoter Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Registered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => {
                    const isSelected = selected?.has(row.id);

                    return (
                      <TableRow hover key={row.id} selected={isSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event): void => {
                              if (event.target.checked) {
                                selectOne?.(row.id);
                              } else {
                                deselectOne?.(row.id);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.taxiNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.driverName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.phone}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.ownerName || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.location}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.driverEmail || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: row.status === 'Sampling Completed' ? '#c8e6c9' : '#fff3cd',
                              color: row.status === 'Sampling Completed' ? '#2e7d32' : '#856404',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 0.5,
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              display: 'inline-block',
                            }}
                          >
                            {row.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{dayjs(row.createdAt).format('MMM D, YYYY')}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Divider />
            <TablePagination
              component="div"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page_}
              rowsPerPage={rowsPerPage_}
              rowsPerPageOptions={[5, 10, 25]}
              count={rows.length}
            />
          </Card>

          {/* Mobile Card View */}
          <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
            {paginatedRows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <Card key={row.id} sx={{ backgroundColor: isSelected ? '#f5f5f5' : 'white' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {row.taxiNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Driver: {row.driverName}
                          </Typography>
                        </Stack>
                        <Checkbox
                          checked={isSelected}
                          onChange={(event): void => {
                            if (event.target.checked) {
                              selectOne?.(row.id);
                            } else {
                              deselectOne?.(row.id);
                            }
                          }}
                        />
                      </Stack>

                      <Divider />

                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="caption">{row.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Owner
                          </Typography>
                          <Typography variant="caption">{row.ownerName || '-'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="caption">{row.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Promoter
                          </Typography>
                          <Typography variant="caption">{row.driverEmail || '-'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                          <Box
                            sx={{
                              backgroundColor: row.status === 'Sampling Completed' ? '#c8e6c9' : '#fff3cd',
                              color: row.status === 'Sampling Completed' ? '#2e7d32' : '#856404',
                              px: 1,
                              py: 0.25,
                              borderRadius: 0.5,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          >
                            {row.status}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(row.createdAt).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          {/* Mobile Pagination */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
            <TablePagination
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page_}
              rowsPerPage={rowsPerPage_}
              rowsPerPageOptions={[5, 10, 25]}
              count={rows.length}
              component="div"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
