import { useState, type DragEvent, type KeyboardEvent, type RefObject } from "react";
import type { DropzoneCopy } from "../utils/i18n";

type DropzoneProps = {
  copy: DropzoneCopy;
  hasImage: boolean;
  fileName?: string;
  onPickFile: (file: File | null) => void;
  onOpenPicker: () => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function Dropzone({
  copy,
  hasImage,
  fileName,
  onPickFile,
  onOpenPicker,
  canvasRef,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    onPickFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenPicker();
    }
  }

  return (
    <div
      className={`dropzone${isDragging ? " is-active" : ""}`}
      onClick={onOpenPicker}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={copy.ariaLabel}
    >
      {!hasImage ? (
        <div className="dropzone-content">
          <div className="dropzone-title">{copy.title}</div>
          <p className="dropzone-subtitle">{copy.subtitle}</p>
          <div className="dropzone-actions">
            <button
              className="btn secondary"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenPicker();
              }}
            >
              {copy.choose}
            </button>
          </div>
          <div className="dropzone-meta">{copy.localNote}</div>
        </div>
      ) : (
        <div className="canvas-wrap">
          <canvas ref={canvasRef} className="canvas-preview" />
          <div className="dropzone-meta">
            <span className="file-name">{fileName ?? copy.loadedFallback}</span>
            <span className="file-hint">{copy.replaceHint}</span>
          </div>
        </div>
      )}
    </div>
  );
}
