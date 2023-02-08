import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type ControllerTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: 'text' | 'number' | 'email';
  readonly?: true;
};

const ControllerTextField = <T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  readonly,
}: ControllerTextFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          required
          fullWidth
          id={name}
          label={label}
          autoComplete={name}
          error={!!error}
          helperText={error?.message}
          inputProps={
            type === 'number'
              ? { inputMode: 'numeric', pattern: '[0-9]*' }
              : undefined
          }
          InputProps={{ readOnly: readonly }}
        />
      )}
    />
  );
};

export default ControllerTextField;
