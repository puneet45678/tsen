import React, { useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";

const QuillEditorReact = (props) => {
  const quillRef = useRef();
  Quill.register("modules/imageResize", ImageResize);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      var file = input && input.files ? input.files[0] : null;
      var formData = new FormData();
      formData.append("file", file);
      let quillObj = quillRef.current.getEditor();
      const range = quillObj?.getSelection();
      if (file) {
        formData.append("file", file);
        axios
          .post(props.imageSaveUrl, formData, {
            withCredentials: true,
          })
          .then((res) => {
            quillObj.insertEmbed(range.index, "image", res.data);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        handlers: {
          image: props.imageHandler ?? imageHandler,
        },
        container: props.container ?? [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
          [{ align: [] }],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    []
  );

  function getImgUrls(delta) {
    return delta.ops
      .filter((i) => i.insert && i.insert.image)
      .map((i) => i.insert.image);
  }

  return (
    <div className="h-full w-full">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(value, delta, old, source) => {
          console.log(
            "value",
            value,
            "delta",
            delta,
            "old",
            old,
            "souurce",
            source
          );
          if (source === "user") {
            props.onChange(value);
          }
        }}
      ></ReactQuill>
    </div>
  );
};

export default QuillEditorReact;
