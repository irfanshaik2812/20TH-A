import LZString from 'lz-string';
import {
  SiteSettings,
  TimelineEvent,
  GalleryPhoto,
  Letter,
  LoveReason,
  GuestbookEntry
} from '../types/database';

export interface CelebrationPackage {
  version: number;
  timestamp: string;
  slug?: string;
  site_settings?: SiteSettings;
  timeline_events?: TimelineEvent[];
  gallery_photos?: GalleryPhoto[];
  letters?: Letter[];
  love_reasons?: LoveReason[];
  guestbook?: GuestbookEntry[];
}

const PACKAGE_VERSION = 1;

/**
 * Compresses an entire celebration state into a URL-safe hash string
 */
export function encodeCelebrationPackage(pkg: Omit<CelebrationPackage, 'version' | 'timestamp'>): string {
  const fullPkg: CelebrationPackage = {
    version: PACKAGE_VERSION,
    timestamp: new Date().toISOString(),
    ...pkg
  };

  const jsonStr = JSON.stringify(fullPkg);
  return LZString.compressToEncodedURIComponent(jsonStr);
}

/**
 * Extracts and decodes a celebration package from the current window URL (hash or query param)
 */
export function decodeCelebrationPackageFromUrl(): CelebrationPackage | null {
  if (typeof window === 'undefined') return null;

  try {
    let encodedData: string | null = null;

    // 1. Check window.location.hash (#gift=... or #pkg=...)
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
      const hashParams = new URLSearchParams(cleanHash);
      encodedData = hashParams.get('gift') || hashParams.get('pkg') || hashParams.get('story') || hashParams.get('data');

      // If hash is raw encoded string without key
      if (!encodedData && cleanHash.startsWith('gift=')) {
        encodedData = cleanHash.replace(/^gift=/, '');
      }
    }

    // 2. Fallback to search query params (?gift=... or ?pkg=...)
    if (!encodedData) {
      const searchParams = new URLSearchParams(window.location.search);
      encodedData = searchParams.get('gift') || searchParams.get('pkg');
    }

    if (!encodedData) return null;

    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!decompressed) {
      console.warn('Could not decompress celebration package');
      return null;
    }

    const parsed = JSON.parse(decompressed) as CelebrationPackage;
    return parsed;
  } catch (err) {
    console.warn('Failed to parse celebration package from URL:', err);
    return null;
  }
}

/**
 * Client-side image compression and resizing utility.
 * Transforms multi-megabyte camera photos into crisp, lightweight (~60-120KB) WebP/JPEG data URLs
 * that render instantly on all mobile devices and can be safely shared across links.
 */
export async function optimizeImageFile(file: File, maxDimension = 1100, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        // Draw image with smooth downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, fallback to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          // If browser doesn't support WebP export it returns png which may be larger
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
