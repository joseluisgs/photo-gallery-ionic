import { ref, onMounted, watch } from 'vue';
import {
  Plugins, CameraResultType, CameraSource, CameraPhoto,
  Capacitor, FilesystemDirectory,
} from '@capacitor/core';
import { isPlatform } from '@ionic/vue';

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

    // si se ejecuta en la web
    if (!isPlatform('hybrid')) {
      // eslint-disable-next-line no-restricted-syntax
      for (const photo of photosInStorage) {
        // eslint-disable-next-line no-await-in-loop
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data,
        });
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    photos.value = photosInStorage;
  };

  // Salva una imagen
  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    let base64Data: string;
    // Si estamos en Android o iOS
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    // Si estamos en la web
    } else {
      // Tomamos cada foto, como blob y la convertimos en Base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = await convertBlobToBase64(blob) as string;
    }
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    if (isPlatform('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }

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
