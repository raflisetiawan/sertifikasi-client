<template>
  <q-dialog v-model="liveSessionStore.formDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">{{ formTitle }}</div>
      </q-card-section>

      <q-form @submit.prevent="onSubmit">
        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="formData.course_id"
            :options="courseOptions"
            label="Pilih Kursus"
            emit-value
            map-options
            :rules="[val => !!val || 'Kursus tidak boleh kosong']"
          />
          <q-input
            v-model="formData.title"
            label="Judul Sesi"
            class="q-mt-md"
            :rules="[val => !!val || 'Judul tidak boleh kosong']"
          />
          <q-editor
            v-model="formData.description"
            class="q-mt-md"
            min-height="5rem"
            placeholder="Deskripsi Sesi"
          />
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-6">
              <q-input filled v-model="formData.start_time" label="Waktu Mulai">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.start_time" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formData.start_time" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input filled v-model="formData.end_time" label="Waktu Selesai">
                 <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.end_time" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formData.end_time" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <q-input
            v-model="formData.meeting_link"
            label="Link Meeting (e.g., Zoom, Google Meet)"
            class="q-mt-md"
            :rules="[val => !!val || 'Link meeting tidak boleh kosong']"
          />
          <q-input
            v-model="formData.meeting_password"
            label="Password Meeting (Opsional)"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn type="submit" :label="submitButtonLabel" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useLiveSessionStore } from 'src/stores/live-session';
import { useCourseStore } from 'src/stores/course';
import { LiveSessionForm } from 'src/models/live-session';
import { CourseIdAndNameOptions } from 'src/models/course';

const liveSessionStore = useLiveSessionStore();
const courseStore = useCourseStore();

const formData = ref<LiveSessionForm>({ ...getInitialFormData() });
const courseOptions = ref<CourseIdAndNameOptions[]>([]);

const isEditMode = computed(() => !!liveSessionStore.editedLiveSession);
const formTitle = computed(() => isEditMode.value ? 'Edit Sesi Langsung' : 'Buat Sesi Langsung Baru');
const submitButtonLabel = computed(() => isEditMode.value ? 'Simpan Perubahan' : 'Simpan');

function getInitialFormData(): LiveSessionForm {
  return {
    course_id: null,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    meeting_link: '',
    meeting_password: ''
  };
}

async function fetchCourses() {
  try {
    const courses = await courseStore.getCourseIdAndNames();
    courseOptions.value = courses.map(course => ({
      label: course.name,
      value: course.id
    }));
  } catch (error) {
    console.error('Failed to fetch courses for select', error);
  }
}

watch(() => liveSessionStore.formDialog, (newValue) => {
  if (newValue) {
    if (isEditMode.value && liveSessionStore.editedLiveSession) {
      const session = liveSessionStore.editedLiveSession;
      formData.value = {
        course_id: session.course_id,
        title: session.title,
        description: session.description,
        start_time: session.start_time.slice(0, 16),
        end_time: session.end_time.slice(0, 16),
        meeting_link: session.meeting_link,
        meeting_password: session.meeting_password
      };
    } else {
      formData.value = { ...getInitialFormData() };
    }
  } else {
    liveSessionStore.editedLiveSession = null;
  }
});

async function onSubmit() {
  if (isEditMode.value && liveSessionStore.editedLiveSession) {
    await liveSessionStore.updateLiveSession(liveSessionStore.editedLiveSession.id, formData.value);
  } else {
    await liveSessionStore.createLiveSession(formData.value);
  }
}

onMounted(() => {
  fetchCourses();
});
</script>
