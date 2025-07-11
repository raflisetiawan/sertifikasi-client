<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">No</th>
          <th class="text-left">Nama</th>
          <th class="text-left">Email</th>
          <th class="text-left">Starred</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(trainer, index) in trainerStore.trainers" :key="trainer.id">
          <tr>
            <td class="text-left">{{ index + 1 }}</td>
            <td class="text-left">{{ trainer.name }}</td>
            <td class="text-left">{{ trainer.email }}</td>
            <td class="text-left">
              <q-checkbox color="yellow" v-model="trainer.starred"
                @update:model-value="toggleStarred(trainer)" checked-icon="star"
                unchecked-icon="star_border" indeterminate-icon="help">
                <q-tooltip>Letakkan trainer pada halaman utama</q-tooltip>
              </q-checkbox>
            </td>
            <td class="text-left">
              <q-btn icon="edit" flat color="green" :to="{ name: 'TrainerAdminUpdatePage', params: { id: trainer.id } }"><q-tooltip>Edit</q-tooltip></q-btn>
              <q-btn icon="delete" flat color="red" @click="deleteTrainer(trainer.id)"><q-tooltip>Hapus</q-tooltip></q-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'TrainerAdminCreatePage' }" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { useTrainerStore } from 'src/stores/trainer';
import { onMounted } from 'vue';
import { Trainer } from 'src/models/trainer';

const trainerStore = useTrainerStore();

onMounted(async () => {
  await trainerStore.getTrainers();
});

const toggleStarred = async (trainer: Trainer) => {
  await trainerStore.toggleStarredTrainer(trainer.id, trainer);
  await trainerStore.getTrainers();
};

const deleteTrainer = async (id: number) => {
  try {
    await trainerStore.deleteTrainer(id);
    await trainerStore.getTrainers();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped></style>
