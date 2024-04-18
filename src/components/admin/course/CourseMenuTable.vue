<template>
  <q-menu anchor="center right" self="center left" :touch-position="props.touchPosition"
    :context-menu="props.contextMenu">
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
import { useZoomLinkStore } from 'src/stores/zoomLink';

const props = defineProps(['propsData', 'touchPosition', 'contextMenu'])
const { $state: zoomLinkState } = useZoomLinkStore()


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


</script>

<style scoped></style>
