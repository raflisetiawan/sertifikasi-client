<template>
  <q-page padding>
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />

    <div v-if="course" class="q-gutter-y-md">
      <!-- Publication Status Card -->
      <PublicationStatus :readiness="course.publication_readiness" />

      <q-card flat bordered>
        <q-card-section horizontal>
          <q-img class="col-3" :src="`${storageBaseUrl}courses/${course.image}`" v-if="course.image" loading="lazy"
            spinner-color="primary" />

          <q-card-section class="col">
            <div class="text-h5 q-mb-sm">{{ course.name }}</div>
            <q-chip :color="course.status === 'draft' ? 'grey' : 'positive'" text-color="white" class="q-mb-md">
              {{ course.status }}
            </q-chip>
            <div class="text-body1" v-html="course.description"></div>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Harga</q-item-label>
                    <q-item-label>{{ formatRupiah(course.price) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Durasi</q-item-label>
                    <q-item-label>{{ course.duration }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Tempat</q-item-label>
                    <q-item-label>{{ course.place }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Jadwal Operasional</q-item-label>
                    <q-item-label>
                      {{ useFormatOperational(course.operational_start) }} -
                      {{ useFormatOperational(course.operational_end) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Silabus</q-item-label>
                    <q-item-label>
                      <q-btn :href="`${storageBaseUrl}syllabuses/${course.syllabus_path}`" label="Download Silabus"
                        color="primary" icon="download" target="_blank" dense flat />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Dibuat Pada</q-item-label>
                    <q-item-label>{{ formatCreatedUpdatedAt(course.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Konsep Kunci</div>
          <div class="q-gutter-sm q-mt-sm">
            <q-chip v-for="(concept, i) in course.key_concepts" :key="i" color="secondary" text-color="white">
              {{ concept }}
            </q-chip>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Fasilitas</div>
          <div class="q-gutter-sm q-mt-sm">
            <q-chip v-for="(facility, i) in course.facility" :key="i" color="accent" text-color="white">
              {{ facility }}
            </q-chip>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Kelola Modul" color="primary" icon="view_module"
            :to="{ name: 'ModuleAdminIndexPage', params: { id: route.params.id } }" />
          <q-btn label="Kelola Benefit" color="primary" icon="card_giftcard"
            :to="{ name: 'CourseBenefitIndexPage', params: { courseId: route.params.id } }" />
        </q-card-actions>
      </q-card>

      <!-- Trainers Section -->
      <div class="text-h6 q-mt-xl">Trainer</div>
      <div class="row q-col-gutter-md">
        <div v-for="trainer in course.trainers" :key="trainer.id" class="col-12 col-md-4 col-sm-6">
          <q-card>
            <q-card-section class="text-center">
              <q-avatar size="100px">
                <img :src="`${storageBaseUrl}${trainer.image}`">
              </q-avatar>
              <div class="text-h6 q-mt-md">{{ trainer.name }}</div>
              <div class="text-subtitle2 text-grey">{{ trainer.qualification }}</div>
            </q-card-section>
            <q-card-section>
              <p class="text-body2">{{ trainer.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Live Sessions Section -->
      <div v-if="course.live_sessions && course.live_sessions.length > 0">
        <div class="text-h6 q-mt-xl">Sesi Live</div>
        <q-list bordered separator>
          <q-item v-for="session in course.live_sessions" :key="session.id">
            <q-item-section>
              <q-item-label>{{ session.title }}</q-item-label>
              <q-item-label caption>{{ session.description }}</q-item-label>
              <q-item-label caption>
                Jadwal: {{ formatCreatedUpdatedAt(session.schedule) }}
              </q-item-label>
              <q-item-label caption>
                <a :href="session.join_url" target="_blank" rel="noopener noreferrer">Link Sesi</a>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

    </div>
    <div v-else class="flex flex-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStore } from 'src/stores/course';
import { useMetaTitle } from 'src/composables/meta';
import { useFormatOperational, formatRupiah } from 'src/composables/format';
import { storageBaseUrl } from 'src/boot/axios';
import { date } from 'quasar';
import PublicationStatus from 'src/components/admin/course/PublicationStatus.vue';

const route = useRoute();
const courseStore = useCourseStore();
const bar = ref<any>(null);

useMetaTitle('Detail Kelas - Admin');

const course = computed(() => courseStore.course);

onMounted(async () => {
  try {
    bar.value?.start();
    await courseStore.showCourseAdmin(route.params.id as string);
  } catch (error) {
    console.error('Error fetching course details:', error);
  } finally {
    bar.value?.stop();
  }
});

const formatCreatedUpdatedAt = (data: Date | string | undefined) => {
  if (!data) return '-';
  return date.formatDate(data, 'dddd, D MMMM YYYY HH:mm');
};
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
