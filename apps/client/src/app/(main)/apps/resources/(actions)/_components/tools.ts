import CodeTool from '@editorjs/code';
import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';

export const tools: { [toolName: string]: ToolConstructable | ToolSettings } = {
  header: {
    class: Header as unknown as ToolConstructable, // Cast to ToolConstructable
    config: {
      placeholder: 'Type Heading...',
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  inlineCode: { class: InlineCode as unknown as ToolConstructable },
  list: {
    class: List as unknown as ToolConstructable
    // inlineToolBar: true,
  },
  quote: {
    class: Quote as unknown as ToolConstructable
    // inlineToolBar: true,
  },
  code: { class: CodeTool as unknown as ToolConstructable },
  table: { class: Table as unknown as ToolConstructable }
  // image: { class: Image as unknown as ToolConstructable },
};
