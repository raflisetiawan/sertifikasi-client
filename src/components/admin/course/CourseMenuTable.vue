<template>
  <q-menu anchor="center right" self="center left" :touch-position="props.touchPosition"
    :context-menu="props.contextMenu">
    <q-item clickable v-ripple :to="{ name: 'CourseBenefitIndexPage', params: { courseId: props.propsData.row.id } }">
      <q-item-section avatar>
        <q-icon name="loyalty" color="blue"></q-icon>
      </q-item-section>
      <q-item-section>Lihat Benefit</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="showAddModuleDialog(props.propsData.row.id)">
      <q-item-section avatar>
        <q-icon name="fa solid fa-square-plus" color="blue"></q-icon>
      </q-item-section>
      <q-item-section>Tambah Module</q-item-section>
    </q-item>
    <q-item clickable v-ripple :to="{ name: 'ModuleAdminIndexPage', params: { id: props.propsData.row.id } }">
      <q-item-section avatar>
        <q-icon name="fa solid fa-list" color="blue"></q-icon>
      </q-item-section>
      <q-item-section>Lihat Module</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="$emit('handleRowClick', props.propsData.row.id)">
      <q-item-section avatar>
        <q-icon name="info" color="blue"></q-icon>
      </q-item-section>
      <q-item-section>Detail Kelas</q-item-section>
    </q-item>
    <q-separator></q-separator>
    <q-item clickable v-ripple
      @click="courseState.showEditStatusDialog = true; courseState.editedStatusDialog = props.propsData.row.id">
      <q-item-section avatar>
        <q-icon name="edit_note" color="green"></q-icon>
      </q-item-section>
      <q-item-section>Ubah Status</q-item-section>
    </q-item>
    <q-item clickable v-ripple
      @click="courseState.showUploadCertificateTemplateDialog = true; courseState.uploadedCerticiateTemplateDialogId = props.propsData.row.id">
      <q-item-section avatar>
        <q-icon name="upload" color="primary"></q-icon>
      </q-item-section>
      <q-item-section>Upload Template Sertifikat</q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-menu>
</template>

<script setup lang="ts">
import { useCourseStore } from 'src/stores/course';
import { useModuleStore } from 'src/stores/module';

const props = defineProps(['propsData', 'touchPosition', 'contextMenu'])
const { $state: courseState } = useCourseStore();
const { $state: moduleStore } = useModuleStore()

const showAddModuleDialog = (courseId: number) => {
  moduleStore.addModuleDialog = true;
  moduleStore.courseId = courseId;
}


</script>

<style scoped></style>
