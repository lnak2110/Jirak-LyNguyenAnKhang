import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ align: [] }],
    ['link', 'image'],
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
      render={({ field: { ref, ...field } }) => (
        <ReactQuill
          {...field}
          id={name}
          placeholder={placeholder}
          theme="snow"
          modules={module}
        />
      )}
    />
  );
};

export default ControllerEditor;
