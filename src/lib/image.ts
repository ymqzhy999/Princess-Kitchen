/**
 * Reads a picked image and compresses it to a small JPEG data URL, so diary
 * photos and avatars fit comfortably inside localStorage.
 *
 * Uses FileReader + canvas, both available in modern mobile browsers and in a
 * future Capacitor WebView. No server or native plugin required.
 */

const MAX_INPUT_BYTES = 8 * 1024 * 1024;

export const IMAGE_ACCEPT = 'image/*';

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('图片读取失败，请换一张试试'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('这个图片格式暂时无法读取'));
    image.src = src;
  });
}

export interface CompressOptions {
  maxSize?: number;
  quality?: number;
}

export async function compressImageFile(
  file: File,
  { maxSize = 1200, quality = 0.82 }: CompressOptions = {},
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('图片太大了，请选择 8MB 以内的图片');
  }

  const original = await readAsDataURL(file);

  // GIF / SVG or environments without canvas: keep the original if it is small.
  if (file.type === 'image/gif' || typeof document === 'undefined') {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('这张动图太大了，请换一张小于 2MB 的图片');
    }
    return original;
  }

  try {
    const image = await loadImage(original);
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return original;

    // White base keeps transparent PNGs from turning black in JPEG.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    console.warn('[PrincessKitchen] 图片压缩失败，使用原图', error);
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('图片压缩失败，请换一张更小的图片');
    }
    return original;
  }
}
