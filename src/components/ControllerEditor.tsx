import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Typography from '@mui/material/Typography';

type ControllerEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
};

export const module = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['blockquote', 'code-block'],
    ['bold', 'italic', 'underline', 'strike'],
    ['link'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ align: [] }],
    ['clean'],
  ],
};

const ControllerEditor = <T extends FieldValues>({
  control,
  name,
  placeholder,
}: ControllerEditorProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <>
          <ReactQuill
            {...field}
            id={name}
            placeholder={placeholder}
            theme="snow"
            modules={module}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};

export default ControllerEditor;
