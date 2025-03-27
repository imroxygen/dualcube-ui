import { FC } from "react";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "./WpEditor.scss";

const Toolbar: FC = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <b>B</b>
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <i>I</i>
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <u>U</u>
      </button>
    </div>
  );
};

export default Toolbar;
