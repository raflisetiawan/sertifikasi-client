<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">No</th>
          <th class="text-left">Pertanyaan</th>
          <th class="text-left">Email</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(trainer, index) in $state.trainers" :key="trainer.id">
          <tr>
            <td class="text-left">{{ index + 1 }}</td>
            <td class="text-left">{{ trainer.name }}</td>
            <td class="text-left">{{ trainer.email }}</td>
            <td class="text-left">
              <q-checkbox color="yellow" v-model="trainer.starred"
                @update:model-value="toggleStarredTrainer(trainer.id, trainer)" checked-icon="star"
                unchecked-icon="star_border" indeterminate-icon="help" />

              <q-btn icon="info" flat color="blue"
                :to="{ name: 'TrainerIndexPage', params: { id: trainer.id } }"><q-tooltip>Detail</q-tooltip></q-btn>
              <q-btn icon="edit" flat color="green"
                @click="actionClick(trainer, true)"><q-tooltip>Edit</q-tooltip></q-btn>
              <q-btn icon="delete" flat color="red"
                @click="actionClick(trainer, false)"><q-tooltip>Hapus</q-tooltip></q-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" @click="$state.addDialog = true">
      <q-btn fab icon="add" color="primary" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts" async>
import { Trainer } from 'src/models/trainer'
import { useTrainerStore } from 'src/stores/trainer';

const { getTrainers, $state, toggleStarredTrainer } = useTrainerStore();

await getTrainers()


const actionClick = (data: Trainer, isUpdate: boolean) => {
  isUpdate ? $state.updateDialog = true : $state.deleteDialog = true;
  $state.trainer = data
}

</script>

<style scoped></style>
