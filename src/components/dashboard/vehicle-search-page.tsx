import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function VehicleSearchPage() {
  const [carNumber, setCarNumber] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    alert(`Searching for vehicle: ${carNumber}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Search Vehicle
      </Typography>
      <form onSubmit={handleSearch} style={{ width: '100%' }}>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 600 } }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Car Number"
            value={carNumber}
            onChange={e => setCarNumber(e.target.value)}
            InputProps={{
              sx: { fontSize: 28, height: 70, background: '#fff', borderRadius: 2 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ fontSize: 22, px: 4, borderRadius: 2 }}
            disabled={!carNumber.trim()}
          >
            Search Vehicle
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
