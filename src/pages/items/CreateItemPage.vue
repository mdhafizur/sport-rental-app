<!-- eslint-disable no-await-in-loop -->
<!-- eslint-disable no-plusplus -->
<!-- eslint-disable object-shorthand -->
<!-- eslint-disable max-len -->
<!-- https://forum.quasar-framework.org/topic/3956/a-working-qfirebaseuploader-component -->
<template>
  <div class="q-pa-md row justify-center">
    <div class="col-10 col-sm-6 col-md-6 col-lg-4">

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <!-- <div>
        <div v-for="image in item.images" :key="image._key">

        </div>
      </div> -->
        <div>
          <q-uploader class="w-100" style="width:100%" url="http://localhost:4444/upload" label="Upload Images" multiple
            batch accept=".jpg, image/*" max-files="3" max-file-size="200480" :auto-upload="false"
            :hide-upload-btn="true" @added="factoryFn" />
        </div>

        <q-input filled v-model="item.title" label="Item Name *" hint="Name of the item" lazy-rules
          :rules="[val => val && val.length > 0 || 'Please type something']" />

        <q-input filled type="number" v-model="item.price" label="Item Price *" step="any" lazy-rules :rules="[
          val => val !== null && val !== '' || 'Please type your price',
          // val => val > 0 && val < 100 || 'Please type a real price'
        ]" />

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { reactive, ref as REF } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from 'src/firebase';
import {
  ref, uploadBytesResumable, getDownloadURL,
} from 'firebase/storage';

import { useItemsStore } from 'src/stores/items.store';

const $q = useQuasar();
const itemsStore = useItemsStore();

const item = reactive({
  id: '' || null,
  title: '',
  price: '' || null,
  images: [],
});

const accept = REF(false);

// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: 'image/jpeg',
};

const handleFileUploadOnFirebaseStorage = async (bucketName: string, file: any) => {
  const storageRef = ref(storage, `/${bucketName}/${file[0].name}`);
  const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);
  return getDownloadURL(uploadTask.snapshot.ref);
};

const handleFilesUploadOnFirebaseStorage = async (bucketName: string, files: any) => {
  //  If no file, return
  if (files.length === 0) return [];

  // Create an array to store all download URLs
  const fileUrls = [];

  // Loop over all the files
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    // Get a file to upload
    const file = files[i];

    // handleFileUploadOnFirebaseStorage function is in above section
    // eslint-disable-next-line no-await-in-loop
    const downloadFileResponse = await handleFileUploadOnFirebaseStorage(bucketName, file);

    // Push the download url to URLs array
    fileUrls.push(downloadFileResponse);
  }

  return fileUrls;
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
    const fileUrls = await handleFilesUploadOnFirebaseStorage('images', item.images);
    // item.images.forEach((file) => {
    //   const datetime = new Date().toISOString().split('.')[0];
    //   const storageRef = ref(storage, `images/${file[0].name}`);

    //   const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

    //   // Listen for state changes, errors, and completion of the upload.
    //   uploadTask.on(
    //     'state_changed',
    //     (snapshot) => {
    //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log(`Upload is ${progress}% done`);
    //     },
    //     (error) => {
    //       // A full list of error codes is available at
    //       // https://firebase.google.com/docs/storage/web/handle-errors

    //       console.log(error);
    //     },
    //     () => {
    //       // Upload completed successfully, now we can get the download URL
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         console.log('File available at', downloadURL);
    //         uploadedImagesURL.push(downloadURL);
    //       });
    //     },
    //   );
    // });

    const data = {
      title: item.title,
      price: Number(item.price),
      images: fileUrls,
    };

    try {
      const docRef = await addDoc(collection(firestore, 'items'), {
        ...data,
      });
      itemsStore.setItems([...itemsStore.items, ...[{ ...data, id: docRef.id }]]);
      console.log('Document written with ID: ', docRef.id);

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted',
      });
    } catch (error) {
      console.log('Error adding document: ', error);
    }
  }
};

const onReset = () => {
  item.title = '';
  item.price = null;
  accept.value = false;
};

function factoryFn(file: any) {
  // returning a Promise
  console.log('file: ', file);
  item.images.push(file);
  console.log('images', item.images);
}

</script>
