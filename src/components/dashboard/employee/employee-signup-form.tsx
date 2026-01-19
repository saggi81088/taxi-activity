'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useUser } from '@/hooks/use-user';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const getRoleOptions = (userRole?: string) => {
  if (userRole === 'superadmin') {
    return [
      { value: 'admin', label: 'Admin' },
      { value: 'promoter', label: 'Promoter' }
    ];
  }
  if (userRole === 'admin') {
    return [
      { value: 'promoter', label: 'Promoter' }
    ];
  }
  return [];
};

const schema = zod.object({
  name: zod
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must not exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  mobile: zod
    .string()
    .min(1, { message: 'Mobile number is required' })
    .regex(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' }),
  role: zod.string().min(1, { message: 'Role is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  role: '',
};

export type EmployeeSignUpFormProps = {
  onSubmit?: (values: Values) => void | Promise<void>;
  userRole?: string;
};

export function EmployeeSignUpForm({ onSubmit, userRole }: EmployeeSignUpFormProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { user: _user } = useUser();

  const { control, handleSubmit, setError, formState: { errors }, reset } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const handle = React.useCallback(
    async (values: Values) => {
      setIsPending(true);
      setServerError(null);

      try {
        const payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          mobile: values.mobile,
          role: values.role,
          created_by: 'admin',
          updated_by: 'admin',
        };

        // Make API call to register user
        await axiosInstance.post('/user/register', payload);

        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User registered successfully!',
        });

        reset();
        
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error_: unknown) {
        const err = error_ as Record<string, unknown>;
        setServerError((err as Record<string, unknown>).message as string ?? 'Submission failed');
        setError('name', { type: 'server', message: (err as Record<string, unknown>).message as string ?? 'Submission failed' });
      } finally {
        setIsPending(false);
      }
    },
    [onSubmit, setError, reset]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h6">User Sign Up</Typography>
        <Typography color="text.secondary" variant="body2">
          Register a new user in the system
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(handle)}>
        <Stack spacing={3}>
          {serverError ? <Alert color="error">{serverError}</Alert> : null}
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)} fullWidth>
                <InputLabel>Name</InputLabel>
                <OutlinedInput {...field} label="Name" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : (
                  <FormHelperText>Minimum 6 characters</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="mobile"
            render={({ field }) => (
              <FormControl error={Boolean(errors.mobile)} fullWidth>
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
                {errors.mobile ? (
                  <FormHelperText>{errors.mobile.message}</FormHelperText>
                ) : (
                  <FormHelperText>10 digit mobile number (numbers only)</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => {
              const roleOptions = getRoleOptions(userRole);

              return (
                <FormControl error={Boolean(errors.role)} fullWidth>
                  <InputLabel shrink>Role</InputLabel>
                  <Select 
                    {...field}
                    label="Role" 
                    displayEmpty
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    renderValue={(value) => {
                      if (!value) {
                        return <em>Select role</em>;
                      }
                      return value.charAt(0).toUpperCase() + value.slice(1);
                    }}
                  >
                    <MenuItem value="">
                      <em>Select role</em>
                    </MenuItem>
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />

          <Button disabled={isPending} type="submit" variant="contained" sx={{ position: 'relative' }}>
            {isPending ? (
              <Stack direction="row" alignItems="center" gap={1}>
                <CircularProgress size={20} sx={{ color: 'inherit' }} />
                Registering...
              </Stack>
            ) : (
              'Register User'
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default EmployeeSignUpForm;
