//./components/EditorTools.js
import Code from "@editorjs/code";
// import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Link from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import Raw from "@editorjs/raw";
import Image from "@editorjs/image";

{
  /*
TODO make image modifications options in image tool show up as a list
TODO add inline editor, inline code
TODO (FUTURE) Create an editor plugin for adding 3D Models, Videos.*/
}

const Header = require("@editorjs/header");
const API = "http://localhost:8001/uploadFile";
export const EDITOR_TOOLS = {
  code: Code,
  header: Header,
  paragraph: Paragraph,
  list: List,
  checklist: Checklist,
  delimiter: Delimiter,
  link: Link,
  table: Table,
  raw: Raw,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile(file) {
          const fileURL =
            typeof file === "string" ? file : URL.createObjectURL(file);

          console.log(fileURL);
          // get the uploaded image path, pushing image path to image array
          return {
            success: 1,
            file: {
              url: fileURL,
              // any other image data you want to store, such as width, height, color, extension, etc
            },
          };
        },
      },
    },
  },
};
