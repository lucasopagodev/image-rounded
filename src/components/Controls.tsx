import type { ExportFormat } from "../utils/canvas";

type ControlsProps = {
  radius: number;
  format: ExportFormat;
  quality: number;
  scale: number;
  hasImage: boolean;
  error: string | null;
  onRadiusChange: (value: number) => void;
  onFormatChange: (value: ExportFormat) => void;
  onQualityChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onExport: () => void;
  onClear: () => void;
};

export default function Controls({
  radius,
  format,
  quality,
  scale,
  hasImage,
  error,
  onRadiusChange,
  onFormatChange,
  onQualityChange,
  onScaleChange,
  onExport,
  onClear,
}: ControlsProps) {
  const qualityLabel = format === "png" ? "N/A" : `${Math.round(quality * 100)}%`;

  return (
    <div className="controls panel">
      <div className="control-row">
        <label className="control-label" htmlFor="radius-range">
          Raio (px)
        </label>
        <div className="control-value">{radius}</div>
      </div>
      <input
        id="radius-range"
        type="range"
        min={0}
        max={200}
        value={radius}
        onChange={(event) => onRadiusChange(Number(event.target.value))}
        className="range"
        disabled={!hasImage}
      />

      <div className="control-grid">
        <div className="control-field">
          <label className="control-label" htmlFor="format-select">
            Formato
          </label>
          <select
            id="format-select"
            value={format}
            onChange={(event) => onFormatChange(event.target.value as ExportFormat)}
            className="select"
            disabled={!hasImage}
          >
            <option value="png">PNG (transparência)</option>
            <option value="jpeg">JPG (fundo branco)</option>
            <option value="webp">WebP</option>
          </select>
          <p className="control-hint">PNG recomendado para transparência.</p>
        </div>

        <div className="control-field">
          <label className="control-label" htmlFor="scale-select">
            Escala
          </label>
          <select
            id="scale-select"
            value={String(scale)}
            onChange={(event) => onScaleChange(Number(event.target.value))}
            className="select"
            disabled={!hasImage}
          >
            <option value="1">100% (original)</option>
            <option value="0.75">75%</option>
            <option value="0.5">50%</option>
            <option value="0.25">25%</option>
          </select>
          <p className="control-hint">Reduza peso sem perder o raio.</p>
        </div>

        <div className="control-field">
          <label className="control-label" htmlFor="quality-range">
            Qualidade ({qualityLabel})
          </label>
          <input
            id="quality-range"
            type="range"
            min={0.4}
            max={1}
            step={0.01}
            value={quality}
            onChange={(event) => onQualityChange(Number(event.target.value))}
            className="range"
            disabled={!hasImage || format === "png"}
          />
          <p className="control-hint">Disponível para JPG e WebP.</p>
        </div>
      </div>

      {error ? (
        <div className="alert" role="status">
          {error}
        </div>
      ) : null}

      <div className="controls-footer">
        <button className="btn primary" type="button" onClick={onExport} disabled={!hasImage}>
          Exportar
        </button>
        <button className="btn ghost" type="button" onClick={onClear} disabled={!hasImage}>
          Limpar
        </button>
      </div>
    </div>
  );
}
