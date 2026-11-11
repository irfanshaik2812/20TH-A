import { supabase, isSupabaseConfigured } from './supabase';

export type BucketType = 'anniversary-photos' | 'anniversary-audio' | 'anniversary-videos';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  filePath?: string;
  fileName?: string;
  error?: string;
  isCloudStored: boolean;
}

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export function validateMediaFile(file: File, bucket: BucketType): { valid: boolean; error?: string } {
  if (bucket === 'anniversary-photos') {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid photo format. Please upload JPG, PNG, or WebP.' };
    }
    if (file.size > 15 * 1024 * 1024) {
      return { valid: false, error: 'Photo must be smaller than 15MB.' };
    }
  } else if (bucket === 'anniversary-audio') {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid audio format. Please upload MP3, WAV, OGG, or M4A.' };
    }
    if (file.size > 30 * 1024 * 1024) {
      return { valid: false, error: 'Audio file must be smaller than 30MB.' };
    }
  } else if (bucket === 'anniversary-videos') {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid video format. Please upload MP4 or WebM.' };
    }
    if (file.size > 100 * 1024 * 1024) {
      return { valid: false, error: 'Video file must be smaller than 100MB.' };
    }
  }

  return { valid: true };
}

/**
 * Uploads a file directly to Supabase Cloud Storage.
 * Falls back to server uploads if Supabase is being configured.
 */
export async function uploadMediaFile(
  file: File,
  bucket: BucketType,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const validation = validateMediaFile(file, bucket);
  if (!validation.valid) {
    return { success: false, error: validation.error, isCloudStored: false };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${Date.now()}_${cleanName}`;

  if (isSupabaseConfigured() && supabase) {
    try {
      if (onProgress) onProgress(20);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      if (onProgress) onProgress(80);

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      if (onProgress) onProgress(100);

      return {
        success: true,
        fileUrl: publicUrlData.publicUrl,
        filePath: data.path,
        fileName: uniqueFileName,
        isCloudStored: true
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload to Supabase Storage failed';
      console.warn('Supabase storage upload error, attempting server fallback:', errorMsg);
      // continue to server fallback
    }
  }

  // Server storage fallback mode: upload file to backend server
  return new Promise((resolve) => {
    if (onProgress) onProgress(20);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (onProgress) onProgress(50);
        const base64Data = reader.result as string;

        const response = await fetch('/api/anniversary/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: cleanName,
            filetype: file.type,
            base64Data
          })
        });

        if (onProgress) onProgress(90);
        const result = await response.json();

        if (result.success && result.fileUrl) {
          if (onProgress) onProgress(100);
          resolve({
            success: true,
            fileUrl: result.fileUrl,
            filePath: result.fileName,
            fileName: result.fileName,
            isCloudStored: false
          });
          return;
        }

        // Fallback to local Data URL
        if (onProgress) onProgress(100);
        resolve({
          success: true,
          fileUrl: base64Data,
          filePath: uniqueFileName,
          fileName: uniqueFileName,
          isCloudStored: false
        });
      } catch {
        if (onProgress) onProgress(100);
        resolve({
          success: true,
          fileUrl: reader.result as string,
          filePath: uniqueFileName,
          fileName: uniqueFileName,
          isCloudStored: false
        });
      }
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file locally.',
        isCloudStored: false
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteMediaFile(bucket: BucketType, filePath: string): Promise<boolean> {
  if (!filePath) return false;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.warn('Failed to delete file from Supabase Storage:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error deleting from storage:', err);
      return false;
    }
  }
  return false;
}
