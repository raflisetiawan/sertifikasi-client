<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit Trainer</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input v-model="trainer.name" label="Nama" :rules="[val => !!val || 'Nama tidak boleh kosong']" />
          <q-input v-model="trainer.email" label="Email" type="email" :rules="[val => !!val || 'Email tidak boleh kosong']" />
          <q-input v-model="trainer.qualification" label="Kualifikasi" :rules="[val => !!val || 'Kualifikasi tidak boleh kosong']" />
          <q-editor v-model="trainer.description" label="Deskripsi" />

          <!-- Display current image -->
          <div v-if="trainer.image && typeof trainer.image === 'string'" class="q-mt-md">
            <p>Gambar Saat Ini:</p>
            <q-img :src="`http://localhost:8000/storage/${trainer.image}`" style="max-width: 200px" />
          </div>

          <!-- Upload new image -->
          <q-file v-model="newImage" label="Ganti Gambar (opsional)">
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
import { ref, onMounted } from 'vue';
import { useTrainerStore } from 'src/stores/trainer';
import { useRouter, useRoute } from 'vue-router';
import { Trainer } from 'src/models/trainer';

// Create a specific type for the form to ensure required fields are strings
interface TrainerEditForm {
  id?: number;
  name: string;
  email: string;
  qualification: string;
  description: string;
  image: string | File | null;
  starred: boolean;
}

const trainerStore = useTrainerStore();
const router = useRouter();
const route = useRoute();

// Use the specific form type for the ref
const trainer = ref<TrainerEditForm>({
  name: '',
  email: '',
  qualification: '',
  description: '',
  image: null,
  starred: false,
});

const newImage = ref<File | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  const existingTrainer = await trainerStore.getTrainer(id);
  // Populate the form, ensuring description is a string
  trainer.value = {
    ...existingTrainer,
    description: existingTrainer.description || '',
  };
});

const onSubmit = async () => {
  try {
    const id = parseInt(route.params.id as string);
    const formData = new FormData();

    formData.append('name', trainer.value.name);
    formData.append('email', trainer.value.email);
    formData.append('qualification', trainer.value.qualification);
    formData.append('description', trainer.value.description);
    formData.append('starred', trainer.value.starred ? '1' : '0');
    if (newImage.value) {
      formData.append('image', newImage.value);
    }
    formData.append('_method', 'PUT');

    await trainerStore.updateTrainer(id, formData);
    router.push({ name: 'TrainerAdminIndexPage' });
  } catch (error) {
    console.error(error);
  }
};
</script>
