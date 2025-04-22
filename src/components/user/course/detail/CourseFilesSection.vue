<template>
  <div>
    <!-- Course Files Section -->
    <div class="row q-mt-lg justify-around">
      <div class="col-12">
        <div class="row q-gutter-md justify-center">
          <q-btn v-if="props.course?.syllabus_path" color="primary" icon="picture_as_pdf"
            :href="`${storageBaseUrl}courses/syllabus/${props.course?.syllabus_path}`" target="_blank">
            Download Syllabus PDF
          </q-btn>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { storageBaseUrl } from 'src/boot/axios';
const props = defineProps(['course']);
</script>
