import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";

const QuillEditor2 = (props) => {
  const quillRef = useRef();
  const [defaultValueSet, setDefaultValueSet] = useState(false);

  Quill.register("modules/imageResize", ImageResize);
  Quill.register("modules/maxlength", function (quill, options) {
    quill.on("text-change", function (e) {
      let size = quill.getText();
      if (size.length > options.value) quill.history.undo();
    });
  });

  /**
   * * We have added useCallback here as there is a circular dependency between imagehnadler and modules
   */
  const imageHandler = useCallback(() => {
    const quill = Quill.find(quillRef.current);
    console.log("quilll inside imageHandler", quill);
    if (quill) {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        var file = input && input.files ? input.files[0] : null;
        var formData = new FormData();
        const range = quill.getSelection();
        if (file) {
          formData.append("file", file);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/picture?source=quilljs`,
              formData,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              console.log("Res", res);
              quill.insertEmbed(range.index, "image", res.data);
              props.onChange(quill.root.innerHTML);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      };
    }
  }, [props.imageSaveUrl]);

  const deleteImageHandler = (imageList) => {
    console.log("imageList", imageList);
    for (let image of imageList) {
      console.log("image", image);
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/picture?image_url=${image}`,
          { withCredentials: true }
        )
        .then((res) => {
          console.log("Res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  /**
   * * The use of history and maxLength modules is to stop user from entering text length greater than the maxLength
   */
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
        modules: ["Resize", "DisplaySize"],
      },
      maxlength: { value: props?.maxLength ? props.maxLength : 1000 },
      history: { delay: 100, userOnly: true },
    }),
    [props.imageHandler, props.container, imageHandler]
  );

  function getImgUrls(delta) {
    return delta.ops
      .filter((i) => i.insert && i.insert.image)
      .map((i) => i.insert.image);
  }

  useEffect(() => {
    console.log("uef1");
    if (quillRef.current !== null) {
      const quillJs = Quill.find(quillRef.current);
      if (!quillJs) {
        console.log("uef11");
        console.log("HADIPAA 2");
        const quill = new Quill(quillRef.current, {
          modules,
          theme: "snow",
        });
        console.log("props content", props);
        quill.on("text-change", (delta, oldDelta, source) => {
          if (source !== "user") return;
          console.log("length", quill.getLength(), "text", quill.getContents());
          const deleted = getImgUrls(quill.getContents().diff(oldDelta));
          if (deleted.length) {
            deleteImageHandler(deleted);
          }
          props.onChange(quill.root.innerHTML);
        });
      }
    }
  }, [modules]);

  useEffect(() => {
    console.log("uef2");
    console.log("props.value", props.value);
    if (quillRef.current) {
      const quill = Quill.find(quillRef.current);
      if (quill && props.value && !defaultValueSet) {
        console.log("uef22");
        console.log("props.value 2", props.value);
        const delta = quill.clipboard.convert(props.value);
        quill.setContents(delta);
        setDefaultValueSet(true);
      }
    }
  }, [props.value]);

  return (
    <div className="h-full w-full break-words">
      <div ref={quillRef}></div>
    </div>
  );
};

export default QuillEditor2;
