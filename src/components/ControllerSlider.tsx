import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { styled } from '@mui/material';
import MuiSlider from '@mui/material/Slider';

const Slider = styled(MuiSlider)({
  '& .MuiSlider-markLabel[data-index="0"]': {
    transform: 'translateX(0%)',
  },
  '& .MuiSlider-markLabel[data-index="1"]': {
    transform: 'translateX(-100%)',
  },
});

type ControllerSliderProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  min: number;
  max: number;
};

const ControllerSlider = <T extends FieldValues>({
  control,
  name,
  min,
  max,
}: ControllerSliderProps<T>) => {
  return (
    <Controller
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
