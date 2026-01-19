'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

export interface Filters {
  location: string;
  status: string;
  searchTerm: string;
  fromDate: string;
  toDate: string;
}

export interface TaxisFiltersProps {
  onFiltersChange?: (filters: Filters) => void;
}

export function TaxisFilters({ onFiltersChange }: TaxisFiltersProps): React.JSX.Element {
  const [filters, setFilters] = React.useState({
    location: '',
    status: '',
    searchTerm: '',
    fromDate: '',
    toDate: '',
  });

  const handleChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      status: '',
      searchTerm: '',
      fromDate: '',
      toDate: '',
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  React.useEffect(() => {
    // Update filters when values change
  }, [filters]);

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
          <OutlinedInput
            placeholder="Search taxi number, driver name..."
            startAdornment={<MagnifyingGlassIcon style={{ marginRight: '8px' }} />}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            value={filters.searchTerm}
            sx={{ flex: { sm: 1 }, minWidth: { xs: '100%', sm: '200px' } }}
          />
          <FormControl sx={{ minWidth: '180px', flex: { xs: 1 } }}>
            <InputLabel>Location</InputLabel>
            <Select
              label="Location"
              name="location"
              onChange={(e) => handleChange('location', e.target.value)}
              value={filters.location}
            >
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="Panaji">Panaji</MenuItem>
              <MenuItem value="Margao">Margao</MenuItem>
              <MenuItem value="Vasco da Gama">Vasco da Gama</MenuItem>
              <MenuItem value="Mapusa">Mapusa</MenuItem>
              <MenuItem value="Ponda">Ponda</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: '180px', flex: { xs: 1 } }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              onChange={(e) => handleChange('status', e.target.value)}
              value={filters.status}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Sampling Completed">Sampling Completed</MenuItem>
              <MenuItem value="Sampling Pending">Sampling Pending</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            value={filters.fromDate}
            sx={{ minWidth: '160px', flex: { xs: 1 } }}
          />
          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange('toDate', e.target.value)}
            value={filters.toDate}
            sx={{ minWidth: '160px', flex: { xs: 1 } }}
          />
          <Button variant="outlined" onClick={handleReset} sx={{ minWidth: '120px', height: '56px' }}>
            Reset
          </Button>
        </Stack>
      </CardContent>
      <Divider />
    </Card>
  );
}
