import { Capacitor } from "@capacitor/core";

export const IS_NATIVE = Capacitor.isNativePlatform();
export const PLATFORM = Capacitor.getPlatform(); // "ios" | "android" | "web"

// Lazy import wrappers — fall back to web behavior when not native.

export async function takePhotoAsDataUrl(): Promise<string | null> {
  if (!IS_NATIVE) return null;
  try {
    const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // ask camera or gallery
    });
    return photo.dataUrl || null;
  } catch (err) {
    console.warn("Camera failed", err);
    return null;
  }
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  try {
    if (IS_NATIVE) {
      const { Geolocation } = await import("@capacitor/geolocation");
      const perm = await Geolocation.requestPermissions();
      if (perm.location !== "granted") return null;
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } else {
      return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }
  } catch {
    return null;
  }
}

export async function nativeShare(text: string, url: string, title: string) {
  if (IS_NATIVE) {
    const { Share } = await import("@capacitor/share");
    await Share.share({ title, text, url });
    return true;
  }
  if (navigator.share) {
    await navigator.share({ title, text, url });
    return true;
  }
  return false;
}

export async function buzz() {
  try {
    if (IS_NATIVE) {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {}
}

export async function setupStatusBar() {
  if (!IS_NATIVE) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    if (PLATFORM === "android") {
      await StatusBar.setBackgroundColor({ color: "#0a0e22" });
    }
  } catch {}
}
