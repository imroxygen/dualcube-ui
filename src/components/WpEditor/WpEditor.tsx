import { FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorState, LexicalEditor } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import Toolbar from "./Toolbar";
import ErrorBoundary from "./ErrorBoundary";

interface WpEditorProps {
  value: string;
  onEditorChange: (value: string) => void;
}

const WpEditor: FC<WpEditorProps> = ({ value, onEditorChange }) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError(error: Error) {
      console.error("Lexical Editor Error:", error);
    },
  };

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const html = editor.getEditorState().toJSON();
      onEditorChange(JSON.stringify(html));
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div className="editor-placeholder">Start typing...</div>}
          ErrorBoundary={(props) => <ErrorBoundary {...props} onError={initialConfig.onError} />}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
};

export default WpEditor;
