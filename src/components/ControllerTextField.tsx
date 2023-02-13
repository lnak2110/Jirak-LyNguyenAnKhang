import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type ControllerTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: 'text' | 'number' | 'email';
  readonly?: true;
  isRequired?: boolean;
};

const ControllerTextField = <T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  readonly,
  isRequired = true,
}: ControllerTextFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={ref} // To scroll and focus error (RHF: shouldFocusError)
          required={isRequired}
          fullWidth
          margin="dense"
          id={name}
          label={label}
          autoComplete={name}
          error={!!error}
          helperText={error?.message}
          type={type}
          inputProps={
            type === 'number'
              ? { inputMode: 'numeric', pattern: '[0-9]*' }
              : undefined
          }
          InputProps={{ readOnly: readonly, inputProps: { min: 0 } }}
          // Disable scrolling on `<input type=number>`
          {...(type === 'number' && {
            onWheel: () => (document.activeElement as HTMLElement).blur(),
          })}
        />
      )}
    />
  );
};

export default ControllerTextField;
