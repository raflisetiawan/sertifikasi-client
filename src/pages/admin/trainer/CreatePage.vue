<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Tambah Trainer Baru</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input v-model="trainer.name" label="Nama" :rules="[val => !!val || 'Nama tidak boleh kosong']" />
          <q-input v-model="trainer.email" label="Email" type="email" :rules="[val => !!val || 'Email tidak boleh kosong']" />
          <q-input v-model="trainer.password" label="Password" type="password" :rules="[val => !!val || 'Password tidak boleh kosong']" />
          <q-input v-model="trainer.qualification" label="Kualifikasi" :rules="[val => !!val || 'Kualifikasi tidak boleh kosong']" />
          <q-editor v-model="trainer.description" label="Deskripsi" />
          <q-file v-model="trainer.image" label="Gambar">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-checkbox v-model="trainer.starred" label="Starred" />

          <div class="q-mt-md">
            <q-btn label="Simpan" type="submit" color="primary" />
            <q-btn label="Batal" color="grey" :to="{ name: 'TrainerAdminIndexPage' }" class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTrainerStore } from 'src/stores/trainer';
import { useRouter } from 'vue-router';
import { Trainer } from 'src/models/trainer';

// Define a type for the form data, including the password
// and ensuring image is of a type compatible with q-file
type TrainerFormData = Omit<Trainer, 'id' | 'created_at' | 'updated_at' | 'image'> & {
  password?: string;
  image: File | null;
};

const trainerStore = useTrainerStore();
const router = useRouter();

// Initialize the ref with the new type and default values
const trainer = ref<TrainerFormData>({
  name: '',
  email: '',
  password: '',
  qualification: '',
  description: '',
  image: null,
  starred: false,
});

const onSubmit = async () => {
  try {
    // The store's addTrainer method will handle the data
    await trainerStore.addTrainer(trainer.value);
    router.push({ name: 'TrainerAdminIndexPage' });
  } catch (error) {
    console.error(error);
  }
};
</script>