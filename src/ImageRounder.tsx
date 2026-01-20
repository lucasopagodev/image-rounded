import React, { useEffect, useMemo, useRef, useState } from "react";

type ExportFormat = "png" | "jpeg" | "webp";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = clamp(r, 0, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function ImageRounder() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [radius, setRadius] = useState<number>(32);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<number>(0.92); // usado para jpeg/webp
  const [scale, setScale] = useState<number>(1); // 1 = original

  const [error, setError] = useState<string | null>(null);

  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Carrega imagem
  useEffect(() => {
    setError(null);
    if (!objectUrl) {
      setImgEl(null);
      return;
    }

    const img = new Image();
    img.onload = () => setImgEl(img);
    img.onerror = () => setError("Não foi possível carregar a imagem.");
    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // Desenha no canvas com recorte arredondado
  useEffect(() => {
    if (!canvasRef.current || !imgEl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outW = Math.max(1, Math.round(imgEl.naturalWidth * scale));
    const outH = Math.max(1, Math.round(imgEl.naturalHeight * scale));

    canvas.width = outW;
    canvas.height = outH;

    // Se o formato for JPEG, o canvas não pode ter transparência no resultado final.
    // Então “pinta” um fundo branco antes.
    ctx.clearRect(0, 0, outW, outH);
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
    }

    // Recorte
    roundedRectPath(ctx, 0, 0, outW, outH, radius);
    ctx.save();
    ctx.clip();

    // Desenha imagem escalada
    ctx.drawImage(imgEl, 0, 0, outW, outH);

    ctx.restore();
  }, [imgEl, radius, scale, format]);

  function onPickFile(f: File | null) {
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem válido (PNG/JPG/WebP).");
      return;
    }
    setFile(f);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onPickFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    onPickFile(f);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  async function exportImage() {
    setError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!imgEl) {
      setError("Envie uma imagem antes de exportar.");
      return;
    }

    const mime =
      format === "png"
        ? "image/png"
        : format === "jpeg"
          ? "image/jpeg"
          : "image/webp";

    const blob: Blob | null = await new Promise((resolve) => {
      if (format === "png") {
        canvas.toBlob((b) => resolve(b), mime);
      } else {
        canvas.toBlob((b) => resolve(b), mime, quality);
      }
    });

    if (!blob) {
      setError("Falha ao gerar a imagem para exportação.");
      return;
    }

    const outNameBase = (file?.name ?? "imagem").replace(/\.[^/.]+$/, "");
    const outExt = format === "jpeg" ? "jpg" : format;
    const outName = `${outNameBase}-rounded.${outExt}`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Image Rounder</div>
            <div style={styles.subtitle}>Upload, arredonde as bordas e exporte.</div>
          </div>
          <button
            style={styles.secondaryBtn}
            onClick={() => inputRef.current?.click()}
          >
            Enviar imagem
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div
          style={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          {!imgEl ? (
            <div style={styles.dropzoneText}>
              Arraste e solte uma imagem aqui, ou clique para selecionar.
            </div>
          ) : (
            <div style={styles.previewWrap}>
              <canvas ref={canvasRef} style={styles.canvas} />
            </div>
          )}
        </div>

        <div style={styles.controls}>
          <div style={styles.controlRow}>
            <label style={styles.label}>
              Raio (px): <strong>{radius}</strong>
            </label>
            <input
              type="range"
              min={0}
              max={200}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={styles.range}
              disabled={!imgEl}
            />
          </div>

          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                style={styles.select}
                disabled={!imgEl}
              >
                <option value="png">PNG (transparência)</option>
                <option value="jpeg">JPG (sem transparência)</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Escala</label>
              <select
                value={String(scale)}
                onChange={(e) => setScale(Number(e.target.value))}
                style={styles.select}
                disabled={!imgEl}
              >
                <option value="1">100% (original)</option>
                <option value="0.75">75%</option>
                <option value="0.5">50%</option>
                <option value="0.25">25%</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Qualidade {format === "png" ? "(N/A)" : `(${quality.toFixed(2)})`}
              </label>
              <input
                type="range"
                min={0.4}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={styles.range}
                disabled={!imgEl || format === "png"}
              />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.footer}>
            <button
              style={styles.primaryBtn}
              onClick={exportImage}
              disabled={!imgEl}
            >
              Exportar
            </button>
            <button
              style={styles.ghostBtn}
              onClick={() => {
                setFile(null);
                setRadius(32);
                setFormat("png");
                setScale(1);
                setQuality(0.92);
                setError(null);
              }}
              disabled={!imgEl}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "#0b0f17",
    color: "#e8eefc",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  card: {
    width: "min(980px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
  },
  header: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 700, letterSpacing: 0.2 },
  subtitle: { fontSize: 13, opacity: 0.75, marginTop: 4 },
  dropzone: {
    border: "1px dashed rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: 16,
    minHeight: 360,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    background: "rgba(0,0,0,0.25)",
  },
  dropzoneText: { opacity: 0.8, textAlign: "center", maxWidth: 420, lineHeight: 1.5 },
  previewWrap: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    overflow: "auto",
  },
  canvas: {
    maxWidth: "100%",
    maxHeight: 420,
    borderRadius: 12,
    background: "transparent",
  },
  controls: { marginTop: 16 },
  controlRow: { display: "flex", gap: 12, alignItems: "center" },
  label: { fontSize: 13, opacity: 0.9 },
  range: { width: "100%" },
  grid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  field: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },
  select: {
    marginTop: 8,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    color: "#e8eefc",
  },
  footer: {
    marginTop: 14,
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#1c3cff",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  ghostBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#e8eefc",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.08)",
    color: "#ffd0d0",
    fontSize: 13,
  },
};
