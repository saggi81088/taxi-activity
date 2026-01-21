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

export interface Feedback {
  id: string;
  taxiNumber: string;
  driverName: string;
  fragrance: string;
  email: string;
  isLiked: string;
  hasPassengerLiked: string;
  willUseAgain: string;
  comments: string;
  createdAt: Date;
}

interface FeedbackTableProps {
  count?: number;
  page?: number;
  rows?: Feedback[];
  rowsPerPage?: number;
}

export function FeedbackTable({
  count: _count = 0,
  rows = [],
  page: _page = 0,
  rowsPerPage: _rowsPerPage = 0,
}: FeedbackTableProps): React.JSX.Element {
  
  const rowIds = React.useMemo(() => {
    return rows.map((feedback) => feedback.id);
  }, [rows]);

  const { selected, selectAll, deselectAll, selectOne, deselectOne } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page_, setPage_] = React.useState(0);
  const [rowsPerPage_, setRowsPerPage_] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage_(newPage);
    window.scrollTo(0, 0);
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
              No feedback found
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
                    <TableCell>Fragrance</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Liked</TableCell>
                    <TableCell>Passenger Liked</TableCell>
                    <TableCell>Will Use Again</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Submitted</TableCell>
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
                          <Typography variant="subtitle2">{row.fragrance || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.email || '-'}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              backgroundColor: row.isLiked === '1' ? '#c8e6c9' : '#ffccbc',
                              color: row.isLiked === '1' ? '#2e7d32' : '#e64a19',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 0.5,
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.isLiked === '1' ? '✓ Yes' : '✗ No'}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              backgroundColor: row.hasPassengerLiked === '1' ? '#c8e6c9' : '#ffccbc',
                              color: row.hasPassengerLiked === '1' ? '#2e7d32' : '#e64a19',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 0.5,
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.hasPassengerLiked === '1' ? '✓ Yes' : '✗ No'}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              backgroundColor: row.willUseAgain === '1' ? '#c8e6c9' : '#ffccbc',
                              color: row.willUseAgain === '1' ? '#2e7d32' : '#e64a19',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 0.5,
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.willUseAgain === '1' ? '✓ Yes' : '✗ No'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.comments || '-'}
                          </Typography>
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
                        <Typography variant="subtitle1" fontWeight="bold">
                          {row.taxiNumber}
                        </Typography>
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
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Driver Name:
                          </Typography>
                          <Typography variant="body2">{row.driverName}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Fragrance:
                          </Typography>
                          <Typography variant="body2">{row.fragrance || '-'}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Email:
                          </Typography>
                          <Typography variant="body2">{row.email || '-'}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Liked:
                          </Typography>
                          <Typography variant="body2">{row.isLiked === '1' ? '✓ Yes' : '✗ No'}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Passenger Liked:
                          </Typography>
                          <Typography variant="body2">{row.hasPassengerLiked === '1' ? '✓ Yes' : '✗ No'}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Will Use Again:
                          </Typography>
                          <Typography variant="body2">{row.willUseAgain === '1' ? '✓ Yes' : '✗ No'}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Comments:
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '150px' }}>
                            {row.comments || '-'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Submitted:
                          </Typography>
                          <Typography variant="body2">{dayjs(row.createdAt).format('MMM D, YYYY')}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}
