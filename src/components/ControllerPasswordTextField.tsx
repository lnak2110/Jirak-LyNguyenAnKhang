import { KeyboardEvent, useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';

type ControllerPasswordTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
};

const ControllerPasswordTextField = <T extends FieldValues>({
  control,
  name,
  label,
}: ControllerPasswordTextFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={ref} // To scroll and focus error (RHF: shouldFocusError)
          required
          fullWidth
          margin="dense"
          id={name}
          label={label}
          autoComplete={name}
          error={!!error}
          helperText={error?.message}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
          }}
        />
      )}
    />
  );
};

export default ControllerPasswordTextField;
