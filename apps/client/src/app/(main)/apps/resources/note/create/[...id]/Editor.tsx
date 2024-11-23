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
  const editorRef = useRef<EditorJS | null>(null); // Lưu trữ instance của EditorJS
  const isInitialized = useRef(false); // Theo dõi trạng thái khởi tạo EditorJS

  useEffect(() => {
    if (isInitialized.current) return; // Nếu đã khởi tạo thì không làm gì thêm
    isInitialized.current = true; // Đánh dấu editor đã được khởi tạo

    try {
      const editor = new EditorJS({
        holder: 'editor', // ID của element chứa editor
        placeholder: 'Type something!',
        autofocus: true,
        tools: tools, // Các công cụ editor
        data: data || undefined, // Dữ liệu khởi tạo
        onChange: async () => {
          if (onChange && editorRef.current) {
            const savedData = await editorRef.current.save(); // Lấy dữ liệu từ editor
            onChange(savedData); // Gọi callback với dữ liệu mới
          }
        },
      });

      editorRef.current = editor; // Lưu instance vào ref

      // Truyền instance ra ngoài thông qua forwardRef
      if (ref && typeof ref === 'object' && ref !== null) {
        ref.current = editor;
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
      console.error('EditorJS initialization failed:', error);
    }
  }, [data, onChange, ref]); // Chỉ chạy lại khi data hoặc onChange thay đổi

  return <div id="editor" className="h-full overflow-auto" />; // Element chứa editor
});

export default Editor;
