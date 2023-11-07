import HeaderOutput from "./renderers/header";
import ParagraphOutput from "./renderers/paragraph";
import ImageOutput from "./renderers/image";
import VideoOutput from "./renderers/video";
import ListOutput from "./renderers/list";
import QuoteOutput from "./renderers/quote";
import ChecklistOutput from "./renderers/checklist";
import TableOutput from "./renderers/table";
import DelimiterOutput from "./renderers/delimiter";
import CodeOutput from "./renderers/code";
import LinkToolOutput from "./renderers/linkTool";

const EditorViewer = ({ data, style, classNames }) => {
  if (!data || typeof data !== "object") return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  console.log("data.blocks", data.blocks);

  return (
    <>
      {data.blocks.map((block, idx) => {
        const key = block.type.toLowerCase();
        let Renderer = getDefaultRenderer(key);

        if (!Renderer) return <></>;

        return (
          <Renderer
            key={idx}
            data={block.data}
            style={style[key] || {}}
            classNames={classNames[key] || {}}
          />
        );
      })}
    </>
  );
};

const getDefaultRenderer = (key) => {
  switch (key) {
    case "code":
      return CodeOutput;
    case "header":
      return HeaderOutput;
    case "paragraph":
      return ParagraphOutput;
    case "image":
      return ImageOutput;
    case "video":
      return VideoOutput;
    case "table":
      return TableOutput;
    case "list":
      return ListOutput;
    case "checklist":
      return ChecklistOutput;
    case "quote":
      return QuoteOutput;
    case "linktool":
      return LinkToolOutput;
    case "delimiter":
      return DelimiterOutput;
    default:
      return null;
  }
};

export {
  HeaderOutput,
  ParagraphOutput,
  ImageOutput,
  VideoOutput,
  TableOutput,
  CodeOutput,
  ListOutput,
  QuoteOutput,
  ChecklistOutput,
  DelimiterOutput,
  LinkToolOutput,
  EditorViewer as default,
};
