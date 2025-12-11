import { MarkdownEditor, Image, Inject, Link, RichTextEditorComponent, Toolbar, Table, MarkdownFormatter, IFormatter } from '@syncfusion/ej2-react-richtexteditor';
import { SplitterComponent, PanesDirective, PaneDirective } from '@syncfusion/ej2-react-layouts';
import { useState, useRef, useEffect } from 'react';
import * as Marked from 'marked';
import './App.css';

function App() {
  const [markDownValue, setMarkDownValue] = useState<string>(`In Rich Text Editor, you click the toolbar buttons to format the words and the changes are visible immediately. Markdown is not like that. When you format the word in Markdown format, you need to add Markdown syntax to the word to indicate which words and phrases should look different from each other. Rich Text Editor supports markdown editing when the editorMode set as **markdown** and using both *keyboard interaction* and *toolbar action*, you can apply the formatting to text. We can add our own custom formation syntax for the Markdown formation, sample link. The third-party library <b>Marked</b> is used in this sample to convert markdown into HTML content.`);
  const [previewValue, setPreviewValue] = useState<string>('');
  const rteRef = useRef<RichTextEditorComponent>(null);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const html = await Marked.parse(markDownValue);
      if (isMounted) setPreviewValue(html);
    })();
    return () => { isMounted = false; };
  }, [markDownValue]);

  const onChange = () => {
    const editorPanel = rteRef.current?.contentModule?.getEditPanel?.() as HTMLTextAreaElement | null;
    if (!editorPanel) return;
    setMarkDownValue(editorPanel.value);
  };

  const customFormatter: MarkdownFormatter = new MarkdownFormatter({
    listTags: { 'OL': '1., 2., 3.', 'UL': '+ ' },
  });
  return (
    <div className="App">
      <SplitterComponent height="450px" width="100%">
        <PanesDirective>
          <PaneDirective
            size="50%"
            resizable={true}
            content={() => (
              <div>
                <RichTextEditorComponent
                  ref={rteRef}
                  value={markDownValue}
                  saveInterval={1}
                  height="448px"
                  editorMode="Markdown"
                  change={onChange}
                  formatter={customFormatter as IFormatter}
                  toolbarSettings={{
                    items: [
                      'Bold', 'Italic', 'StrikeThrough', '|',
                      'Formats', 'OrderedList', 'UnorderedList', '|',
                      'CreateLink', 'Image', 'Undo', 'Redo', 'CreateTable'
                    ]
                  }}
                >
                  <Inject services={[Toolbar, MarkdownEditor, Link, Image, Table]} />
                </RichTextEditorComponent>
              </div>
            )}
          />
          <PaneDirective
            content={() => (
              <div>
                <div className="title"><b>Markdown Preview</b></div>
                <div
                  className="preview"
                  style={{ fontSize: '14px', padding: '20px' }}
                  dangerouslySetInnerHTML={{ __html: previewValue }}
                />
              </div>
            )}
          />
        </PanesDirective>
      </SplitterComponent>
    </div>
  );
}

export default App;
