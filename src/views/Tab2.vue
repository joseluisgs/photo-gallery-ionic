<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// Iconos
import { camera, trash, close } from 'ionicons/icons';
// Elementos a usar
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

export default {
  name: 'Tab2',
  // Mis componentes
  components: {
    IonPage,
    IonHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonContent,
    // IonGrid,
    // IonRow,
    // IonCol,
    // IonImg,
  },

  // Mis setup
  setup() {
    // Mis datos
    // Mis funciones
    const { takePhoto } = usePhotoGallery();
    // Lo que le devulevo
    return {
      takePhoto,
      camera,
      trash,
      close,
    };
  },
};
</script>
