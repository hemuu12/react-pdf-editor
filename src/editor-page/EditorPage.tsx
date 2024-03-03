import { useState } from "react";
import { PdfHandle } from "../read-pdf";
import DownloadButton from "./DownloadButton";

import logo from "./logo.svg";
import "./EditorPage.css";
import Header from "./Header";
import EditorStateProvider from "./EditorStateProvider";
import Toolbar, { Tool } from "./Toolbar";
import InteractivePdfViewer from "./viewer/InteractivePdfViewer";

function EditorPage() {
  const [pdfHandle, setPdfHandle] = useState<PdfHandle | null>(null);

  const [selectedTool, setSelectedTool] = useState<Tool>("move");

  async function onFileChange(files: FileList | null) {
    if (files === null || files.length === 0) return;

    const buffer = await files[0].arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const newPdfHandle = await PdfHandle.create(bytes);
    setPdfHandle(newPdfHandle);
  }

  return (
    // TODO: State must be linked to a particular pdf.
    <EditorStateProvider>
      <div className="editor-page">
        <Header>
          <h1>PdF Editor</h1>

          <Toolbar selectedTool={selectedTool} onChanged={setSelectedTool} />

          <div>
            <input
              type="file"
              name="pdf-input"
              accept=".pdf"
              onChange={(e) => onFileChange(e.target.files)}
            />
            {pdfHandle && <DownloadButton pdfBytes={pdfHandle.bytes} />}
          </div>
        </Header>

        <section className="editor-body">
          <section className="left-sidebar"></section>

          <section className="content">
            {pdfHandle && (
              <InteractivePdfViewer
                key={pdfHandle.id}
                pdfHandle={pdfHandle}
                tool={selectedTool}
              />
            )}
          </section>

          <section className="right-sidebar"></section>
        </section>
      </div>
    </EditorStateProvider>
  );
}

export default EditorPage;
