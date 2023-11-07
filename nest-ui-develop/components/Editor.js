//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./EditorTools";
//props

const EditorBlock = ({ show, data, onChange, holder }) => {
  //add a reference to editor
  const ref = useRef();
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    console.log("show", show, "data in editor ", data, "editor", ref);
    if (show && !ref.current) {
      console.log("yes editor");
      const editor = new EditorJS({
        holder: holder,
        minHeight: 0,
        tools: {},
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
        inlineToolbar: true,
      });
      ref.current = editor;
    }
    console.log("no editor");
    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, [show]);
  return <div id={holder} className="bg-white px-2" />;
};
export default memo(EditorBlock);
