import { useState, type DragEvent, type KeyboardEvent, type RefObject } from "react";

type DropzoneProps = {
  hasImage: boolean;
  fileName?: string;
  onPickFile: (file: File | null) => void;
  onOpenPicker: () => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function Dropzone({
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
      aria-label="Enviar imagem"
    >
      {!hasImage ? (
        <div className="dropzone-content">
          <div className="dropzone-title">Arraste e solte sua imagem aqui</div>
          <p className="dropzone-subtitle">
            Ou clique para selecionar. PNG recomendado para transparência.
          </p>
          <div className="dropzone-actions">
            <button
              className="btn secondary"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenPicker();
              }}
            >
              Escolher arquivo
            </button>
          </div>
          <div className="dropzone-meta">Tudo roda localmente no navegador.</div>
        </div>
      ) : (
        <div className="canvas-wrap">
          <canvas ref={canvasRef} className="canvas-preview" />
          <div className="dropzone-meta">
            <span className="file-name">{fileName ?? "Imagem carregada"}</span>
            <span className="file-hint">Clique ou solte outra para substituir.</span>
          </div>
        </div>
      )}
    </div>
  );
}
