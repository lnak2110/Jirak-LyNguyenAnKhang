import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

type ControllerAutocompleteProps<T extends FieldValues, OptionType> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  options: OptionType[];
  optionLabel: keyof OptionType;
  equalField: keyof OptionType;
  isRequired?: boolean;
  isMultiple?: true;
};

const ControllerAutocomplete = <T extends FieldValues, OptionType>({
  control,
  name,
  label,
  placeholder,
  options,
  optionLabel,
  equalField,
  isRequired,
  isMultiple,
}: ControllerAutocompleteProps<T, OptionType>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          disablePortal
          multiple={isMultiple}
          filterSelectedOptions={isMultiple}
          id={name}
          value={value}
          options={options}
          getOptionLabel={(option) => option?.[optionLabel] as string}
          isOptionEqualToValue={(option, value) =>
            option[equalField] === value[equalField]
          }
          onChange={(_event, newValue) => onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              required={isRequired}
              margin="dense"
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message}
              {...(isRequired &&
                isMultiple && {
                  inputProps: {
                    ...params.inputProps,
                    required: value?.length === 0,
                  },
                })}
            />
          )}
        />
      )}
    />
  );
};

export default ControllerAutocomplete;
