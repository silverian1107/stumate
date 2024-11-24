'use client';

import { forwardRef, useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { tools } from '../../../(actions)/_components/tools'; // Đảm bảo đường dẫn đúng

interface EditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void; // Callback khi có thay đổi
}

const Editor = forwardRef<EditorJS | null, EditorProps>(function Editor(
  { data, onChange }, // Props: dữ liệu khởi tạo và callback
  ref,
) {
  // console.log('data: ', data);
  console.log('editor value: ', data);
  const isInitialized = useRef(false); // Theo dõi trạng thái khởi tạo EditorJS
  const editorRef = useRef<EditorJS | null>(null); // Lưu trữ instance của EditorJS

  useEffect(() => {
    if (isInitialized.current) return;
    console.log('isInitialized.current: ', isInitialized.current); // Nếu đã khởi tạo thì không làm gì thêm

    console.log(data);
    console.log('------------');

    if (editorRef.current && data) {
      console.log('dataaaa: ', editorRef.current);

      editorRef.current.render(data);
    }

    try {
      if (!isInitialized.current) {
        const editor = new EditorJS({
          holder: 'editor',
          placeholder: 'Type something...',
          autofocus: false,
          tools,
          data: data || { blocks: [] },
          onChange: async () => {
            if (onChange && editorRef.current) {
              const newData = await editorRef.current.save();
              onChange(newData);
            }
          },
        });

        editorRef.current = editor;
        isInitialized.current = true;

        // Truyền instance ra ngoài thông qua forwardRef
        if (ref && typeof ref === 'object' && ref !== null) {
          ref.current = editor;
        }
      }

      // Cleanup khi component bị unmount
      return () => {
        if (
          editorRef.current &&
          typeof editorRef.current.destroy === 'function'
        ) {
          editorRef.current.destroy(); // Hủy editor nếu nó tồn tại
        }
      };
    } catch (error) {
      console.error('EditorJS initialization failed:', error); // Xử lý lỗi khởi tạo
    }
  }, [data, onChange, ref]); // Chỉ chạy lại khi data hoặc onChange thay đổi

  return <div id="editor" className="h-full overflow-auto" />; // Element chứa editor
});

export default Editor;
