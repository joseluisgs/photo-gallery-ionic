<template>
  <div id="container">
    <strong>{{ name }}</strong>
    <p>
      Explore
      <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components"
        >UI Components</a
      >
    </p>
    <IonButton color="primary" @click="presentAlert">
      <IonIcon slot="start" :icon="alertCircleOutline" />
      Púlsame
    </IonButton>
  </div>
</template>

<script lang="ts">
import { IonButton, IonIcon, alertController } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';

export default {
  name: 'ExploreContainer',
  props: {
    name: String,
  },
  components: {
    IonButton,
    IonIcon,
  },

  data: () => ({
    alertCircleOutline,
  }),
  methods: {
    async presentAlert() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Prompt!',
          inputs: [
            {
              placeholder: 'Placeholder 1',
            },
            {
              name: 'name2',
              id: 'name2-id',
              value: 'hello',
              placeholder: 'Placeholder 2',
            },
            {
              name: 'name3',
              value: 'http://ionicframework.com',
              type: 'url',
              placeholder: 'Favorite site ever',
            },
            // input date with min & max
            {
              name: 'name4',
              type: 'date',
              min: '2017-03-01',
              max: '2018-01-12',
            },
            // input date without min nor max
            {
              name: 'name5',
              type: 'date',
            },
            {
              name: 'name6',
              type: 'number',
              min: -5,
              max: 10,
            },
            {
              name: 'name7',
              type: 'number',
            },
            {
              name: 'name8',
              type: 'password',
              placeholder: 'Advanced Attributes',
              cssClass: 'specialClass',
              attributes: {
                maxlength: 4,
                inputmode: 'decimal',
              },
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok');
              },
            },
          ],
        });
      return alert.present();
    },
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
