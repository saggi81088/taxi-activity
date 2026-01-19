'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import axiosInstance from '@/lib/axios';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { TaxisFilters } from '@/components/dashboard/taxi/taxi-filters';
import { TaxisTable } from '@/components/dashboard/taxi/taxi-table';
import type { Taxi } from '@/components/dashboard/taxi/taxi-table';

export default function Page(): React.JSX.Element {
  const [filters, setFilters] = React.useState({
    location: '',
    status: '',
    searchTerm: '',
    fromDate: '',
    toDate: '',
  });
  const [taxis, setTaxis] = React.useState<Taxi[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch taxis from API
  React.useEffect(() => {
    const fetchTaxis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('custom-auth-token');

        if (!token) {
          setError('Authentication token not found. Please login again.');
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get('/taxi');

        // Map API response to Taxi interface
        if (response.data.clients && Array.isArray(response.data.clients)) {
          const mappedTaxis: Taxi[] = response.data.clients.map((client: Record<string, unknown>) => {
            const taxi: Taxi = {
              id: String(client.id || ''),
              taxiNumber: String(client.taxi_number || ''),
              driverName: String(client.driver_name || ''),
              driverEmail: String(client.promoter_id || ''),
              phone: String(client.mobile || ''),
              ownerName: client.owner_name ? String(client.owner_name) : '-',
              location: String(client.location || '-'),
              status: client.air_freshener_installed === '1' ? 'Sampling Completed' : 'Sampling Pending',
              createdAt: new Date(String(client.created_at || new Date().toISOString())),
            };
            return taxi;
          });
          setTaxis(mappedTaxis);
        } else {
          setTaxis([]);
        }
      } catch (error_: unknown) {
        let errorMsg = 'Failed to fetch taxis';
        if (error_ instanceof Error) {
          errorMsg = error_.message;
        } else if (typeof error_ === 'object' && error_ !== null) {
          const err = error_ as Record<string, unknown>;
          if (err.response && typeof err.response === 'object' && err.response !== null) {
            const response = err.response as Record<string, unknown>;
            if (response.data && typeof response.data === 'object' && response.data !== null) {
              const data = response.data as Record<string, unknown>;
              errorMsg = String(data.message || errorMsg);
            }
          } else if (typeof err.message === 'string') {
            errorMsg = err.message;
          }
        }
        setError(errorMsg);
        setTaxis([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxis();
  }, []);

  const handleExport = () => {
    if (filteredTaxis.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for Excel
    const excelData = filteredTaxis.map((taxi) => ({
      'Taxi Number': taxi.taxiNumber,
      'Driver Name': taxi.driverName,
      'Phone': taxi.phone,
      'Owner Name': taxi.ownerName || '-',
      'Location': taxi.location,
      'Status': taxi.status,
      'Registered Date': dayjs(taxi.createdAt).format('MMM DD, YYYY'),
      'Promoter Email': taxi.driverEmail,
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Taxis');

    // Set column widths
    const maxWidth = 20;
    const columnWidths = Object.keys(excelData[0] || {}).map(() => maxWidth);
    worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }));

    // Generate file name with timestamp
    const fileName = `taxis_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, fileName);
  };

  const filteredTaxis = React.useMemo(() => {
    const filtered = taxis.filter((taxi) => {
      let matches = true;

      if (filters.location && taxi.location !== filters.location) {
        matches = false;
      }

      if (filters.status && taxi.status !== filters.status) {
        matches = false;
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          taxi.taxiNumber.toLowerCase().includes(searchLower) ||
          taxi.driverName.toLowerCase().includes(searchLower) ||
          taxi.phone.includes(filters.searchTerm);
        matches = matches && matchesSearch;
      }

      // Date range filtering
      if (filters.fromDate) {
        const fromDate = dayjs(filters.fromDate).startOf('day');
        if (dayjs(taxi.createdAt).isBefore(fromDate)) {
          matches = false;
        }
      }

      if (filters.toDate) {
        const toDate = dayjs(filters.toDate).endOf('day');
        if (dayjs(taxi.createdAt).isAfter(toDate)) {
          matches = false;
        }
      }

      return matches;
    });

    // Sort by createdAt in descending order (latest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filters, taxis]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Taxis</Typography>
          <Typography color="text.secondary" variant="body2">
            Manage registered taxis and drivers
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ display: 'flex' }}>
          <Button
            startIcon={<DownloadIcon fontSize="var(--icon-fontSize-lg)" />}
            variant="contained"
            onClick={handleExport}
            disabled={isLoading || taxis.length === 0}
          >
            Download as Excel
          </Button>
        </Stack>
      </Stack>
      <TaxisFilters onFiltersChange={setFilters} />
      {isLoading ? (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            backgroundColor: '#ffebee',
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Stack>
      ) : (
        <TaxisTable count={filteredTaxis.length} rows={filteredTaxis} />
      )}
    </Stack>
  );
}
