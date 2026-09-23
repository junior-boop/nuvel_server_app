import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon/workerd";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 80;

// photon-rs (moteur WASM) ne sait décoder que jpeg/png/webp ; tout autre
// format (heic, gif, bmp, svg...) fait planter le WASM avec un trap
// "unreachable" au lieu d'une erreur JS propre.
const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type CompressedImage = {
  bytes: Uint8Array;
  contentType: string;
  originalSize: number;
  compressedSize: number;
};

export async function compressImage(file: File): Promise<CompressedImage> {
  if (!SUPPORTED_MIME_TYPES.has(file.type)) {
    throw new Error(
      `format ${file.type || "inconnu"} non supporté pour la compression (jpeg/png/webp uniquement)`,
    );
  }

  const inputBytes = new Uint8Array(await file.arrayBuffer());
  const originalSize = inputBytes.byteLength;

  const inputImage = PhotonImage.new_from_byteslice(inputBytes);
  let resizedImage: PhotonImage | null = null;

  try {
    const width = inputImage.get_width();
    const height = inputImage.get_height();
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

    const targetImage =
      scale < 1
        ? (resizedImage = resize(
            inputImage,
            Math.round(width * scale),
            Math.round(height * scale),
            SamplingFilter.Lanczos3,
          ))
        : inputImage;

    const outputBytes = targetImage.get_bytes_jpeg(JPEG_QUALITY);

    return {
      bytes: outputBytes,
      contentType: "image/jpeg",
      originalSize,
      compressedSize: outputBytes.byteLength,
    };
  } finally {
    inputImage.free();
    resizedImage?.free();
  }
}
