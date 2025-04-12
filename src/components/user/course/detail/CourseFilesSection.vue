<template>
  <div>
      <!-- Course Files Section -->
      <div class="row q-mt-lg justify-around">
        <div class="col-12">
          <div class="row q-gutter-md justify-center">
            <q-btn v-if="props.course.guidelines" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/guideline/${props.course.guidelines}`" target="_blank">
              Guidelines
            </q-btn>
            <q-btn v-if="props.course.syllabus_path" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/syllabus/${props.course.syllabus_path}`" target="_blank">
              Syllabus
            </q-btn>
            <q-btn v-if="props.course.schedule_path" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/schedules/${props.course.schedule_path}`" target="_blank">
              Schedule
            </q-btn>
            <q-btn v-if="props.course.certificate_example_path" color="primary" icon="image"
              :href="`${storageBaseUrl}courses/certificates/${props.course.certificate_example_path}`" target="_blank">
              Certificate Example
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