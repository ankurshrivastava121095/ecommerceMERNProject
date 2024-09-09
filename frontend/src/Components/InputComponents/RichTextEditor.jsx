/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const RichTextEditor = ({ data, onChange }) => {
  console.log(data);
  
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          toolbar: [
            'bold', 'italic', 'underline', 'strikethrough',
            '|', 'heading', '|', 'link', 'bulletedList', 'numberedList',
            '|', 'blockQuote', 'insertTable', 'undo', 'redo'
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          }
        }}
      />
    </div>
  );
};
export default RichTextEditor;