import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type EditorProps = {
  id: string;
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

const Editor = ({ id, placeholder, ...field }: EditorProps) => {
  return (
    <ReactQuill
      {...field}
      id={id}
      placeholder={placeholder}
      theme="snow"
      modules={module}
    />
  );
};

export default Editor;
