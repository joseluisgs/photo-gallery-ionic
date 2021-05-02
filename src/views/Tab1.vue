<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Acerca De</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Desarrollador</ion-card-subtitle>
          <ion-card-title>José Luis González</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-img src="https://i.imgur.com/DkOD8UL.png"> </ion-img>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-item>
          <ion-icon :icon="logoGithub" slot="start"></ion-icon>
          <ion-label>Mi repositorio de GitHub</ion-label>
          <ion-button
            fill="outline"
            slot="end"
            @click="openWebpage('https://github.com/joseluisgs')"
            >Ver
          </ion-button>
        </ion-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// Iconos
import { logoGithub } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/vue';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

export default {
  name: 'Tab1',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonLabel,
  },

  setup() {
    function openWebpage(url: string) {
      const options: InAppBrowserOptions = {
        zoom: 'no',
      };

      // Opening a URL and returning an InAppBrowserObject
      InAppBrowser.create(url, '_self', options);
    }

    return {
      logoGithub,
      openWebpage,
    };
  },
};
</script>

function openWebpage(url: any, string: any) {
  throw new Error('Function not implemented.');
}
