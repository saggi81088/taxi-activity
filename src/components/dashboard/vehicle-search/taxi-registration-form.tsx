"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  driverName: zod.string().min(1, { message: 'Driver name is required' }),
  mobileNumber: zod
    .string()
    .min(1, { message: 'Mobile number is required' })
    .regex(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' }),
  taxiNumber: zod.string().min(1, { message: 'Taxi number is required' }),
  ownerName: zod.string().optional(),
  location: zod.string().min(1, { message: 'Location is required' }),
  airFreshenerInstalled: zod.boolean(),
  dateTime: zod.string().optional(),
  promoterId: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  driverName: '',
  mobileNumber: '',
  taxiNumber: '',
  ownerName: '',
  location: '',
  airFreshenerInstalled: true,
  dateTime: '',
  promoterId: '',
};

export type TaxiRegistrationFormProps = {
  defaultTaxiNumber?: string;
  onSubmit?: (values: Values & { dateTime: string; promoterId?: string }) => void | Promise<void>;
  onRegistrationSuccess?: (driverName: string) => void;
};

export function TaxiRegistrationForm({ defaultTaxiNumber = '', onSubmit, onRegistrationSuccess }: TaxiRegistrationFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { user } = useUser();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    defaultValues: {
      ...defaultValues,
      taxiNumber: defaultTaxiNumber,
    },
    resolver: zodResolver(schema),
  });

  const handle = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      // Map form values to API payload format
      const payload = {
        taxi_number: values.taxiNumber,
        driver_name: values.driverName,
        mobile: values.mobileNumber,
        owner_name: values.ownerName,
        air_freshener_installed: values.airFreshenerInstalled ? 'yes' : 'no',
        promoter_id: user?.email ?? values.promoterId,
        location: values.location,
      };

      try {
        // Make API call to local proxy route
        await axiosInstance.post('/taxi', payload);

        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Taxi Registered Successfully!',
        });

        reset(); // Reset form after successful submission

        // Callback to parent with driver name
        if (onRegistrationSuccess) {
          onRegistrationSuccess(values.driverName);
        }
      } catch (error_: unknown) {
        let errorMsg = 'Taxi registration failed';
        if (error_ instanceof Error) {
          errorMsg = error_.message;
        }
        
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
        });
      } finally {
        setIsPending(false);
      }
    },
    [onSubmit, user, reset, onRegistrationSuccess]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h6">Taxi Registration</Typography>
        <Typography color="text.secondary" variant="body2">
          Register taxi details and owner information (owner optional)
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(handle)}>
        <Stack spacing={2}>

          <Controller
            control={control}
            name="taxiNumber"
            render={({ field }) => (
              <FormControl error={Boolean(errors.taxiNumber)}>
                <InputLabel>Taxi / Vehicle registration number</InputLabel>
                <OutlinedInput {...field} label="Taxi / Vehicle registration number" />
                {errors.taxiNumber ? <FormHelperText>{errors.taxiNumber.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="driverName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.driverName)}>
                <InputLabel>Driver name</InputLabel>
                <OutlinedInput {...field} label="Driver name" />
                {errors.driverName ? <FormHelperText>{errors.driverName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="mobileNumber"
            render={({ field }) => (
              <FormControl error={Boolean(errors.mobileNumber)}>
                <InputLabel>Mobile number</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Mobile number"
                  type="text"
                  inputProps={{ 
                    inputMode: 'numeric',
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replaceAll(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                  onKeyDown={(e) => {
                    // Allow only numeric keys, backspace, delete, and arrow keys
                    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                    const isNumeric = /^[0-9]$/.test(e.key);
                    
                    if (!isNumeric && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.mobileNumber ? (
                  <FormHelperText>{errors.mobileNumber.message}</FormHelperText>
                ) : (
                  <FormHelperText>10 digit mobile number (numbers only)</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="ownerName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.ownerName)}>
                <InputLabel>Owner name (optional)</InputLabel>
                <OutlinedInput {...field} label="Owner name (optional)" />
                {errors.ownerName ? <FormHelperText>{errors.ownerName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <FormControl error={Boolean(errors.location)}>
                <InputLabel>Location</InputLabel>
                <Select {...field} label="Location">
                  <MenuItem value="Panaji">Panaji</MenuItem>
                  <MenuItem value="Margao">Margao</MenuItem>
                  <MenuItem value="Vasco da Gama">Vasco da Gama</MenuItem>
                  <MenuItem value="Mapusa">Mapusa</MenuItem>
                  <MenuItem value="Ponda">Ponda</MenuItem>
                </Select>
                {errors.location ? <FormHelperText>{errors.location.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="airFreshenerInstalled"
            render={({ field }) => (
              <FormControl error={Boolean(errors.airFreshenerInstalled)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Air freshener installed"
                />
                {errors.airFreshenerInstalled ? (
                  <FormHelperText>{errors.airFreshenerInstalled.message as string}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Button 
            disabled={isPending} 
            type="submit" 
            variant="contained"
          >
            {isPending ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Registering...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default TaxiRegistrationForm;
