"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  driverName: zod.string().min(1, { message: 'Driver name is required' }),
  likedFragrance: zod.enum(['yes', 'no'], { required_error: 'Please select an option' }),
  favoriteFlavor: zod.string().min(1, { message: 'Please select a fragrance' }),
  passengersLike: zod.enum(['yes', 'no', 'not-sure'], { required_error: 'Please select an option' }),
  wouldUseAgain: zod.enum(['yes', 'no'], { required_error: 'Please select an option' }),
  additionalComments: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  driverName: '',
  likedFragrance: 'yes',
  favoriteFlavor: '',
  passengersLike: 'yes',
  wouldUseAgain: 'yes',
  additionalComments: '',
};

export type DriverFeedbackFormProps = {
  driverName?: string;
  taxiNumber?: string;
  onSubmit?: (values: Values) => void | Promise<void>;
};

export function DriverFeedbackForm({ driverName, taxiNumber, onSubmit }: DriverFeedbackFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { user } = useUser();

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<Values>({
    defaultValues: {
      ...defaultValues,
      driverName: driverName || '',
    },
    resolver: zodResolver(schema),
  });

  const handle = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      const token = localStorage.getItem('custom-auth-token');

      if (!token) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Authentication token not found. Please login again.',
        });
        setIsPending(false);
        return;
      }

      // Map form values to API payload format
      const payload = {
        taxi_number: taxiNumber,
        driver_name: values.driverName,
        is_liked: values.likedFragrance === 'yes' ? 1 : 0,
        fragrance: values.favoriteFlavor,
        has_passenger_liked: values.passengersLike === 'yes' ? 1 : (values.passengersLike === 'no' ? 0 : 2),
        will_use_again: values.wouldUseAgain === 'yes' ? 1 : 0,
        promotor_id: user?.email,
        comments: values.additionalComments || '',
      };

      try {
        await axiosInstance.post('/feedback', payload);

        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Taxi Registration Completed!',
        });
        reset();
        
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error_: unknown) {
        const err = error_ as Record<string, unknown>;
        const errorMsg = (err as Record<string, unknown>).response && typeof (err as Record<string, unknown>).response === 'object' ? ((err as Record<string, unknown>).response as Record<string, unknown>).data : ((err as Record<string, unknown>) as Record<string, unknown>).message || 'Feedback submission failed';
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: String(errorMsg),
        });
      } finally {
        setIsPending(false);
      }
    },
    [onSubmit, setError, reset, user, taxiNumber]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h6">Driver Feedback Form</Typography>
        <Typography color="text.secondary" variant="body2">
          Please provide feedback about the air freshener installation
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(handle)}>
        <Stack spacing={3}>

          <Controller
            control={control}
            name="driverName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.driverName)}>
                <InputLabel>Driver name</InputLabel>
                <OutlinedInput {...field} label="Driver name" disabled />
                {errors.driverName ? <FormHelperText>{errors.driverName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="likedFragrance"
            render={({ field }) => (
              <FormControl error={Boolean(errors.likedFragrance)}>
                <FormLabel>1. Did you like the fragrance smell?</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {errors.likedFragrance ? <FormHelperText>{errors.likedFragrance.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="favoriteFlavor"
            render={({ field }) => (
              <FormControl error={Boolean(errors.favoriteFlavor)} fullWidth>
                <FormLabel>2. Which fragrance did you like the most?</FormLabel>
                <Select {...field} displayEmpty>
                  <MenuItem value="">
                    <em>Select a fragrance</em>
                  </MenuItem>
                  <MenuItem value="flavor-a">Flavor A</MenuItem>
                  <MenuItem value="flavor-b">Flavor B</MenuItem>
                  <MenuItem value="flavor-c">Flavor C</MenuItem>
                  <MenuItem value="flavor-d">Flavor D</MenuItem>
                </Select>
                {errors.favoriteFlavor ? <FormHelperText>{errors.favoriteFlavor.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="passengersLike"
            render={({ field }) => (
              <FormControl error={Boolean(errors.passengersLike)}>
                <FormLabel>3. Do your passengers like this fragrance?</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel value="not-sure" control={<Radio />} label="Not sure" />
                </RadioGroup>
                {errors.passengersLike ? <FormHelperText>{errors.passengersLike.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="wouldUseAgain"
            render={({ field }) => (
              <FormControl error={Boolean(errors.wouldUseAgain)}>
                <FormLabel>4. Would you use this air freshener again?</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {errors.wouldUseAgain ? <FormHelperText>{errors.wouldUseAgain.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="additionalComments"
            render={({ field }) => (
              <FormControl error={Boolean(errors.additionalComments)} fullWidth>
                <FormLabel>5. Any additional comments (Optional)</FormLabel>
                <TextField
                  {...field}
                  multiline
                  rows={4}
                  placeholder="Enter any additional feedback..."
                />
                {errors.additionalComments ? (
                  <FormHelperText>{errors.additionalComments.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Button disabled={isPending} type="submit" variant="contained" sx={{ position: 'relative' }}>
            {isPending && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px',
                }}
              />
            )}
            <span style={{ opacity: isPending ? 0 : 1 }}>Submit Feedback</span>
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default DriverFeedbackForm;