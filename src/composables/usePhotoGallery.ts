import { ref, onMounted, watch } from 'vue';
import {
  Plugins, CameraResultType, CameraSource, CameraPhoto,
  Capacitor, FilesystemDirectory,
} from '@capacitor/core';

export function usePhotoGallery() {
  const { Camera, Filesystem, Storage } = Plugins;
  // Mi array reactivo
  const photos = ref<Photo[]>([]);
  // Donde almaceno
  const PHOTO_STORAGE = 'photos';

  // Cache de fotos
  const cachePhotos = () => {
    Storage.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  // Convierte a Base64
  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  // De esta manera siempre que hay un cambio actualiza la cache
  watch(photos, cachePhotos);

  // Cargamos todas las fotos
  const loadSaved = async () => {
    const photoList = await Storage.get({ key: PHOTO_STORAGE });
    const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];

    // eslint-disable-next-line no-restricted-syntax
    for (const photo of photosInStorage) {
      // eslint-disable-next-line no-await-in-loop
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: FilesystemDirectory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }

    photos.value = photosInStorage;
  };

  // Salva una imagen
  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    let base64Data = '';

    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    base64Data = await convertBlobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  // Toma una foto
  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = `${new Date().getTime()}.jpeg`;
    const savedFileImage = await savePicture(cameraPhoto, fileName);

    photos.value = [savedFileImage, ...photos.value];
  };

  // Cuando nos montamos leemos lo que tenemos en Storage.
  onMounted(loadSaved);

  // Lo que devolvemos
  return {
    photos,
    takePhoto,
  };
}

export interface Photo {
  filepath: string;
  webviewPath?: string;
}
