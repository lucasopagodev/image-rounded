import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Controls from "./Controls";
import Dropzone from "./Dropzone";
import {
  drawRoundedImageToCanvas,
  exportCanvasToFile,
  getExportExtension,
} from "../utils/canvas";
import type { ExportFormat } from "../utils/canvas";
import type { EditorCopy } from "../utils/i18n";

const DEFAULT_RADIUS = 32;
const DEFAULT_QUALITY = 0.92;
const DEFAULT_SCALE = 1;

export type EditorHandle = {
  openFileDialog: () => void;
};

type EditorProps = {
  copy: EditorCopy;
};

type ErrorKey = keyof EditorCopy["errors"];

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor({ copy }, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => inputRef.current?.click(),
  }));

  useEffect(() => {
    if (!file) {
      setImage(null);
      return;
    }

    setErrorKey(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setErrorKey("load");
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    drawRoundedImageToCanvas(canvasRef.current, image, {
      radius,
      scale,
      background: format === "jpeg" ? "#ffffff" : null,
    });
  }, [image, radius, scale, format]);

  function handlePickFile(selected: File | null) {
    setErrorKey(null);
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setErrorKey("invalidFile");
      return;
    }

    setFile(selected);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    handlePickFile(selected);
  }

  async function handleExport() {
    setErrorKey(null);
    if (!canvasRef.current || !image) {
      setErrorKey("noImage");
      return;
    }

    drawRoundedImageToCanvas(canvasRef.current, image, {
      radius,
      scale,
      background: format === "jpeg" ? "#ffffff" : null,
    });

    const baseName = (file?.name ?? copy.fileNameFallback).replace(/\.[^/.]+$/, "");
    const extension = getExportExtension(format);
    const fileName = `${baseName}-${copy.fileSuffix}.${extension}`;

    try {
      await exportCanvasToFile(canvasRef.current, {
        format,
        quality,
        fileName,
      });
    } catch (exportError) {
      setErrorKey("exportFail");
    }
  }

  function handleClear() {
    setFile(null);
    setImage(null);
    setRadius(DEFAULT_RADIUS);
    setFormat("png");
    setQuality(DEFAULT_QUALITY);
    setScale(DEFAULT_SCALE);
    setErrorKey(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const errorMessage = errorKey ? copy.errors[errorKey] : null;

  return (
    <div className="editor-shell">
      <div className="panel">
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
        <Dropzone
          copy={copy.dropzone}
          hasImage={Boolean(image)}
          fileName={file?.name}
          onPickFile={handlePickFile}
          onOpenPicker={() => inputRef.current?.click()}
          canvasRef={canvasRef}
        />
      </div>

      <Controls
        copy={copy.controls}
        radius={radius}
        format={format}
        quality={quality}
        scale={scale}
        hasImage={Boolean(image)}
        error={errorMessage}
        onRadiusChange={setRadius}
        onFormatChange={setFormat}
        onQualityChange={setQuality}
        onScaleChange={setScale}
        onExport={handleExport}
        onClear={handleClear}
      />
    </div>
  );
});

export default Editor;
