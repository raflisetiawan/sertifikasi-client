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
    <q-item clickable v-ripple @click="$emit('showAddDialog', props.propsData.row.id, props.propsData.row.name)">
      <q-item-section avatar>
        <q-icon name="assignment_add" color="primary"></q-icon>
      </q-item-section>
      <q-item-section>Tambah Materi</q-item-section>
    </q-item>
    <q-item clickable v-ripple :to="{ name: 'MaterialAdminIndexPage', params: { id: props.propsData.row.id } }">
      <q-item-section avatar>
        <q-icon name="menu_book" color="blue"></q-icon>
      </q-item-section>
      <q-item-section>Lihat Materi</q-item-section>
    </q-item>
    <!-- :to="{ name: 'MaterialAdminIndexPage', params: { id: props.propsData.row.id } }" -->
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
    <q-item clickable v-if="!props.propsData?.row.zoom_link" v-ripple
      @click="showAddZoomDialog(props.propsData.row.id)">
      <q-item-section avatar>
        <q-icon name="videocam" color="primary"></q-icon>
      </q-item-section>
      <q-item-section>Buat Link Zoom</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="showEditZoomDialog(
      props.propsData.row.id,
      props.propsData.row.zoom_link,
      props.propsData.row.zoom_link_id)" v-else>
      <q-item-section avatar>
        <q-icon name="videocam" color="green"></q-icon>
      </q-item-section>
      <q-item-section>Edit Link Zoom</q-item-section>
    </q-item>
    <q-item clickable v-show="props.propsData?.row.zoom_link" v-ripple @click="showDeleteZoomDialog(
      props.propsData.row.id,
      props.propsData.row.zoom_link,
      props.propsData.row.zoom_link_id)">
      <q-item-section avatar>
        <q-icon name="videocam" color="red">
        </q-icon>
      </q-item-section>
      <q-item-section>Hapus Link Zoom</q-item-section>
    </q-item>
  </q-menu>
</template>

<script setup lang="ts">
import { useCourseStore } from 'src/stores/course';
import { useZoomLinkStore } from 'src/stores/zoomLink';
import { useModuleStore } from 'src/stores/module';

const props = defineProps(['propsData', 'touchPosition', 'contextMenu'])
const { $state: zoomLinkState } = useZoomLinkStore()
const { $state: courseState } = useCourseStore();
const { $state: moduleStore } = useModuleStore()


const showAddZoomDialog = (courseId: number) => {
  zoomLinkState.addZoomDialog = true; zoomLinkState.courseId = courseId;
}

const showEditZoomDialog = (courseId: number, linkName: string, zoomLinkId: number) => {
  zoomLinkState.editZoomDialog = true;
  zoomLinkState.zoomLinkData.link = linkName;
  zoomLinkState.zoomLinkData.id = zoomLinkId;
  zoomLinkState.zoomLinkData.courseId = courseId;
}

const showDeleteZoomDialog = (courseId: number, linkName: string, zoomLinkId: number) => {
  zoomLinkState.deleteZoomDialog = true;
  zoomLinkState.zoomLinkData.link = linkName;
  zoomLinkState.zoomLinkData.id = zoomLinkId;
  zoomLinkState.zoomLinkData.courseId = courseId;
}

const showAddModuleDialog = (courseId: number) => {
  moduleStore.addModuleDialog = true;
  moduleStore.courseId = courseId;
}


</script>

<style scoped></style>
