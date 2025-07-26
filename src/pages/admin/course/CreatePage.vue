<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Buat Kelas Baru</div>
        <p>Isi semua detail yang diperlukan untuk membuat kelas baru.</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input filled v-model="course.name" label="Nama Kelas *" hint="Contoh: Pelatihan Digital Marketing"
            lazy-rules :rules="[val => val && val.length > 0 || 'Nama kelas tidak boleh kosong']" />

          <div class="text-subtitle1">Deskripsi Kelas</div>
          <q-editor v-model="course.description" min-height="5rem" placeholder="Jelaskan tentang kelas ini..."
            :rules="[(val: string) => val && val.length >= 12 || 'Deskripsi minimal 12 karakter']" />

          <q-select filled v-model="course.key_concepts" use-input use-chips multiple hide-dropdown-icon
            input-debounce="0" new-value-mode="add-unique" label="Konsep Utama *"
            hint="Tekan Enter untuk menambahkan konsep baru"
            :rules="[val => val && val.length > 0 || 'Konsep utama tidak boleh kosong']" />

          <q-select filled v-model="course.facility" use-input use-chips multiple hide-dropdown-icon input-debounce="0"
            new-value-mode="add-unique" label="Fasilitas *" hint="Tekan Enter untuk menambahkan fasilitas"
            :rules="[val => val && val.length > 0 || 'Fasilitas tidak boleh kosong']" />

          <q-input filled v-model.number="course.price" label="Harga (Rp) *" type="number" prefix="Rp" :rules="[
            val => val !== null && val !== '' || 'Harga tidak boleh kosong',
            val => val >= 0 || 'Harga tidak boleh negatif'
          ]" />

          <q-file filled v-model="course.image" label="Gambar Banner Kelas *" accept=".png, .jpg, .jpeg, .webp"
            max-file-size="2048000" @rejected="onFileRejected" hint="Maksimal 2MB">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-file filled v-model="course.syllabus" label="File Silabus (Opsional)" accept=".pdf"
            max-file-size="10240000" @rejected="onFileRejected" hint="Maksimal 10MB, format PDF">
            <template v-slot:prepend>
              <q-icon name="picture_as_pdf" />
            </template>
          </q-file>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input filled v-model="course.operational_start" mask="date" label="Tanggal Mulai Operasional *" :rules="[
                val => !!val || 'Tanggal mulai tidak boleh kosong',
                'date'
              ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="course.operational_start">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input filled v-model="course.operational_end" mask="date" label="Tanggal Selesai Operasional *" :rules="[
                val => !!val || 'Tanggal selesai tidak boleh kosong',
                'date',
                val => !course.operational_start || new Date(val) > new Date(course.operational_start) || 'Tanggal selesai harus setelah tanggal mulai'
              ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="course.operational_end">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <q-select filled v-model="course.place" :options="['Online', 'Offline', 'Hybrid']"
            label="Tempat Pelaksanaan *" :rules="[val => !!val || 'Tempat pelaksanaan tidak boleh kosong']" />

          <q-input filled v-model="course.duration" label="Durasi *" hint="Contoh: 40 Jam atau 5 Sesi"
            :rules="[val => !!val || 'Durasi tidak boleh kosong']" />

          <q-select filled v-model="course.trainer_selected" :options="trainerOptions" label="Pilih Trainer" multiple
            use-chips stack-label emit-value map-options />

          <!-- Live Sessions Section -->
          <q-separator class="q-my-lg" />
          <div class="text-h6">Jadwal Live Session (Opsional)</div>
          <div v-for="(session, index) in course.live_sessions" :key="index" class="q-pa-md q-mb-md"
            style="border: 1px solid #e0e0e0; border-radius: 4px;">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input filled v-model="session.title" label="Judul Sesi"
                  :rules="[val => !!val || 'Judul tidak boleh kosong']" />
              </div>
              <div class="col-12">
                <q-input filled v-model="session.description" label="Deskripsi Sesi" type="textarea" autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="session.start_time" label="Waktu Mulai"
                  :rules="[val => !!val || 'Waktu mulai tidak boleh kosong']">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="session.start_time" mask="YYYY-MM-DD HH:mm">
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
                        <q-time v-model="session.start_time" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="session.end_time" label="Waktu Selesai"
                  :rules="[val => !!val || 'Waktu selesai tidak boleh kosong']">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="session.end_time" mask="YYYY-MM-DD HH:mm">
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
                        <q-time v-model="session.end_time" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="session.meeting_link" label="Link Meeting"
                  :rules="[val => !!val || 'Link meeting tidak boleh kosong']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="session.meeting_password" label="Password Meeting (Opsional)" />
              </div>
            </div>
            <q-btn flat color="negative" @click="removeLiveSession(index)" label="Hapus Sesi Ini" class="q-mt-md" />
          </div>
          <q-btn outline color="primary" @click="addLiveSession" label="Tambah Jadwal Live Session" icon="add" />


          <q-card-actions align="right">
            <q-btn label="Reset" type="reset" color="grey" flat class="q-mr-sm" @click="onReset" />
            <q-btn label="Simpan Kelas" type="submit" color="primary" :loading="isSubmitting" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useCourseStore } from 'src/stores/course';
import { useTrainerStore } from 'src/stores/trainer';
import { CourseForm } from 'src/models/course';
import { useRouter } from 'vue-router';
import { QRejectedEntry, useQuasar } from 'quasar';

const courseStore = useCourseStore();
const trainerStore = useTrainerStore()
const router = useRouter();
const $q = useQuasar();

const isSubmitting = ref(false);

const initialCourseState: CourseForm = {
  name: '',
  description: '',
  key_concepts: [],
  facility: [],
  price: 0,
  image: null,
  syllabus: null,
  operational_start: '',
  operational_end: '',
  place: '',
  duration: '',
  trainer_ids: [],
  trainer_selected: [],
  live_sessions: [],
};

const course = reactive<CourseForm>({ ...initialCourseState });

const trainerOptions = computed(() => {
  if (!trainerStore.trainers) return [];
  return trainerStore.trainers.map(t => ({ label: t.name, value: t.id }));
});

onMounted(() => {
  trainerStore.getTrainers();
});

const addLiveSession = () => {
  course.live_sessions.push({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    meeting_link: '',
    meeting_password: '',
  });
};

const removeLiveSession = (index: number) => {
  course.live_sessions.splice(index, 1);
};

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    course.trainer_ids = course.trainer_selected;

    const result = await courseStore.storeCourse(course);
    console.log('Course created:', result);
    $q.notify({
      color: 'positive',
      message: 'Kelas baru berhasil dibuat!',
      icon: 'check_circle',
    });
    router.push({ name: 'DetailCoursePage', params: { id: result.id } });
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      message: 'Gagal membuat kelas. Periksa kembali data Anda.',
      icon: 'report_problem',
    });
  } finally {
    isSubmitting.value = false;
  }
};

const onReset = () => {
  Object.assign(course, initialCourseState);
  course.key_concepts = [];
  course.facility = [];
  course.trainer_selected = [];
  course.live_sessions = [];
  course.syllabus = null;
};

const onFileRejected = (rejectedEntries: QRejectedEntry[]) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file tidak valid. Pastikan format dan ukuran file sesuai.`
  })
}

</script>

<style scoped>
.q-card-section {
  padding-bottom: 0;
}

.q-gutter-md {
  &>* {
    margin-bottom: 16px;
  }
}
</style>
