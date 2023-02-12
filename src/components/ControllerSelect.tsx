import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

type ControllerSelectProps<T extends FieldValues, OptionType> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  labelId: string;
  options: OptionType[];
  optionValue: keyof OptionType;
  optionLabel: keyof OptionType;
};

const ControllerSelect = <T extends FieldValues, OptionType>({
  control,
  name,
  label,
  labelId,
  options,
  optionValue,
  optionLabel,
}: ControllerSelectProps<T, OptionType>) => {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select {...field} labelId={labelId} label={label}>
            {options.map((option) => (
              <MenuItem
                key={option?.[optionValue] as string}
                value={option?.[optionValue] as string}
              >
                {option?.[optionLabel] as string}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default ControllerSelect;
