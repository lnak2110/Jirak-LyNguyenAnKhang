import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import Slider from '@mui/material/Slider';

type ControllerSliderProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  min: number;
  max: number;
  sliderKey?: number;
};

const ControllerSlider = <T extends FieldValues>({
  control,
  name,
  min,
  max,
  sliderKey,
}: ControllerSliderProps<T>) => {
  return (
    <Controller
      key={sliderKey}
      control={control}
      name={name}
      render={({ field: { value } }) => (
        <Slider
          id={name}
          value={max - value}
          valueLabelDisplay="auto"
          min={min}
          max={max}
        />
      )}
    />
  );
};

export default ControllerSlider;
