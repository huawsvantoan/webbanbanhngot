import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  isExcerpt?: boolean;
}

const CKEditorComponent: React.FC<CKEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = '300px',
  isExcerpt = false
}) => {
  const editorConfig = {
    placeholder: placeholder,
    toolbar: isExcerpt ? [
      'bold', 'italic', 'underline',
      'link',
      'bulletedList', 'numberedList',
      '|',
      'undo', 'redo'
    ] : [
      'heading',
      '|',
      'bold', 'italic', 'underline', 'strikethrough',
      '|',
      'link', 'image',
      '|',
      'bulletedList', 'numberedList',
      '|',
      'indent', 'outdent',
      '|',
      'fontColor', 'fontBackgroundColor',
      '|',
      'alignment',
      '|',
      'blockQuote', 'codeBlock',
      '|',
      'undo', 'redo'
    ],
    language: 'vi',
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'webp']
      }
    },
    link: {
      defaultProtocol: 'https://'
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500">
      <CKEditor
        editor={ClassicEditor as any}
        config={editorConfig}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor) => {
          // Tùy chỉnh editor khi sẵn sàng
          editor.editing.view.change((writer) => {
            const rootElement = editor.editing.view.document.getRoot();
            if (rootElement) {
              writer.setStyle('height', height, rootElement);
            }
          });
        }}
      />
    </div>
  );
};

export default CKEditorComponent; 