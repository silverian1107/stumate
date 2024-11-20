/* eslint-disable @typescript-eslint/no-explicit-any */
// import Embed from "@editorjs/embed";
import CodeTool from '@editorjs/code';
import Header from '@editorjs/header';
// import Image from "@editorjs/image";
import InlineCode from '@editorjs/inline-code';
// import Link from "@editorjs/link";
import List from '@editorjs/list';
// import Marker from "@editorjs/marker";
import Quote from '@editorjs/quote';

export const tools: Record<
  string,
  | {
      class: any;
      config?: Record<string, any>;
      inlineToolBar?: boolean;
    }
  | any
> = {
  //   embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: 'Type Heading...',
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  inlineCode: InlineCode,
  // link: Link,
  list: {
    class: List,
    inlineToolBar: true
  },
  //   marker: Marker,
  quote: {
    class: Quote,
    inlineToolBar: true
  },
  code: CodeTool
};
