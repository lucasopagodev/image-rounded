export type ExportFormat = "png" | "jpeg" | "webp";

type DrawOptions = {
  radius: number;
  scale: number;
  background?: string | null;
};

type ExportOptions = {
  format: ExportFormat;
  quality: number;
  fileName: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function roundedRectPath(
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

export function drawRoundedImageToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  { radius, scale, background }: DrawOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const outW = Math.max(1, Math.round(image.naturalWidth * scale));
  const outH = Math.max(1, Math.round(image.naturalHeight * scale));

  canvas.width = outW;
  canvas.height = outH;

  ctx.clearRect(0, 0, outW, outH);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, outW, outH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const scaledRadius = radius * scale;
  roundedRectPath(ctx, 0, 0, outW, outH, scaledRadius);
  ctx.save();
  ctx.clip();
  ctx.drawImage(image, 0, 0, outW, outH);
  ctx.restore();
}

export function getExportExtension(format: ExportFormat) {
  return format === "jpeg" ? "jpg" : format;
}

export function getMimeType(format: ExportFormat) {
  if (format === "png") return "image/png";
  if (format === "jpeg") return "image/jpeg";
  return "image/webp";
}

export async function exportCanvasToFile(canvas: HTMLCanvasElement, options: ExportOptions) {
  const { format, quality, fileName } = options;
  const mime = getMimeType(format);

  const blob = await new Promise<Blob | null>((resolve) => {
    if (format === "png") {
      canvas.toBlob((value) => resolve(value), mime);
    } else {
      canvas.toBlob((value) => resolve(value), mime, quality);
    }
  });

  if (!blob) {
    throw new Error("Falha ao gerar a imagem para exportação.");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
