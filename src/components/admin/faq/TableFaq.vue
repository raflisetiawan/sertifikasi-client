<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">No</th>
          <th class="text-left">Pertanyaan</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(faq, index) in $state.faqs" :key="faq.id">
          <tr>
            <td class="text-left">{{ index + 1 }}</td>
            <td class="text-left">{{ faq.question }}</td>
            <td class="text-left">
              <q-btn icon="info" flat color="blue" :to="{ name: 'FaqIndexPage' }"><q-tooltip>Detail</q-tooltip></q-btn>
              <q-btn icon="edit" flat color="green" @click="actionClick(faq, true)"><q-tooltip>Edit</q-tooltip></q-btn>
              <q-btn icon="delete" flat color="red" @click="actionClick(faq, false)"><q-tooltip>Hapus</q-tooltip></q-btn>
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
import { useFaqStore } from 'src/stores/faq';
import { Faqs, } from 'src/models/faq'

const { setFaqs, $state } = useFaqStore()

await setFaqs()

const actionClick = (data: Faqs, isUpdate: boolean) => {
  isUpdate ? $state.updateDialog = true : $state.deleteDialog = true;
  $state.faq.id = data.id
  $state.faq.answer = data.answer
  $state.faq.question = data.question
  $state.faq.created_at = data.created_at
  $state.faq.updated_at = data.updated_at
}

</script>

<style scoped></style>
