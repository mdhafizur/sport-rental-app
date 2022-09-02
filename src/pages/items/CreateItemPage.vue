<!-- eslint-disable no-await-in-loop -->
<!-- eslint-disable no-plusplus -->
<!-- eslint-disable object-shorthand -->
<!-- eslint-disable max-len -->
<!-- https://forum.quasar-framework.org/topic/3956/a-working-qfirebaseuploader-component -->
<template>
  <div class="q-pa-md row justify-center">
    <div class="col-10 col-sm-6 col-md-6 col-lg-4">
      <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
        <div>
          <q-uploader
            class="w-100"
            style="width: 100%"
            url="http://localhost:4444/upload"
            label="Upload Images"
            multiple
            batch
            accept=".jpg, image/*"
            max-files="3"
            max-file-size="200480"
            :auto-upload="false"
            :hide-upload-btn="true"
            @added="factoryFn"
          />
        </div>

        <q-input
          v-model="item.title"
          filled
          label="Item Name *"
          hint="Name of the item"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          v-model="item.price"
          filled
          type="number"
          label="Item Price *"
          step="any"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type your price',
            // val => val > 0 && val < 100 || 'Please type a real price'
          ]"
        />

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { reactive, ref as REF, toRaw } from 'vue';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from 'src/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useItemsStore } from 'src/stores/items.store';

const $q = useQuasar();
const itemsStore = useItemsStore();

const item = reactive({
  id: '' || null,
  title: '',
  price: '' || null,
  images: [],
  urls: [],
});

const accept = REF(false);
const onReset = () => {
  item.title = '';
  item.price = null;
  item.images = [];
  accept.value = false;
};

// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: 'image/jpeg',
};

const handleSubmission = () => {
  const promises: any[] = [];
  // eslint-disable-next-line array-callback-return
  item.images.map((image) => {
    const timeStamp = new Date().toLocaleDateString('sv').replaceAll('-', '');
    const fileName = `/images/${timeStamp}_${image.name}_original`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    promises.push(uploadTask);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.log(snapshot);
        // const progress = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
        // setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          item.urls.push(downloadURL);
          console.log('File available at', downloadURL);
        });
      },
    );
  });

  Promise.all(promises)
    .then(() => {
      const data = {
        title: item.title,
        price: Number(item.price),
        images: item.urls,
      };

      addDoc(collection(firestore, 'items'), {
        title: item.title,
        price: Number(item.price),
      }).then((docRef) => {
        updateDoc(docRef, {
          images: toRaw(item.urls),
        });
        itemsStore.setItems([
          ...itemsStore.items,
          ...[{ ...data, id: docRef.id }],
        ]);

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted',
        });
        onReset();
      });
    })
    .catch((err) => console.log(err));
};

const onSubmit = async () => {
  if (!accept.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first',
    });
  } else {
    handleSubmission();
  }
};

function factoryFn(files: any) {
  console.log('files: ', files);
  files.forEach((file: any) => item.images.push(file));
  console.log('images', item.images);
}
</script>
