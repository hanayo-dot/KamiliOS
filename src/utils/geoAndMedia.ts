export interface GPSResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  formatted: string;
  isMocked?: boolean;
}

export function getCurrentGPSLocation(): Promise<GPSResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      // Default to Nairobi City Centre coordinates
      resolve({
        latitude: -1.286389,
        longitude: 36.817223,
        accuracy: 15,
        formatted: "-1.2864, 36.8172 (±15m)",
        isMocked: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          formatted: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`,
          isMocked: false,
        });
      },
      (error) => {
        console.warn('Geolocation failed or permission denied, using standard regional coordinate fallback', error.message);
        // Fallback to Nairobi GPS
        resolve({
          latitude: -1.286389,
          longitude: 36.817223,
          accuracy: 25,
          formatted: "-1.2864, 36.8172 (GPS Fallback)",
          isMocked: true,
        });
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
    );
  });
}

export interface CompressedImageResult {
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  savedPercentage: number;
}

export function compressFieldPhoto(
  file: File,
  maxWidth = 1024,
  quality = 0.72
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const originalSizeKB = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Approximate base64 size to KB
        const compressedSizeKB = Math.round((dataUrl.length * (3 / 4)) / 1024);
        const savedPercentage = Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100));

        resolve({
          dataUrl,
          originalSizeKB,
          compressedSizeKB,
          savedPercentage,
        });
      };

      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
