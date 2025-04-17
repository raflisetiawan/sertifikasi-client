<template>
  <div id="detail-course-user" class="q-pa-md">
    <div class="course-banner q-py-xl">
      <div class="container">
        <div class="row items-center q-col-gutter-lg">
          <!-- Course Image -->
          <div class="col-12 col-md-5">
            <q-card flat bordered class="course-image-card">
              <q-img :src="`${storageBaseUrl}courses/${course?.image}`" :ratio="16 / 9" class="rounded-borders">
                <div class="absolute-bottom text-subtitle2 bg-transparent">
                  <q-chip color="primary" text-color="white" icon="event" class="q-ml-sm">
                    {{ useFormatDateRange(props.course?.operational_start, props.course?.operational_end) }}
                  </q-chip>
                </div>
              </q-img>
            </q-card>
          </div>

          <!-- Course Info -->
          <div class="col-12 col-md-7">
            <div class="course-info q-pa-md">
              <div class="text-h4 text-weight-bold text-primary q-mb-md">
                {{ props.course.name }}
              </div>

              <div class="row items-center q-gutter-sm q-mb-md">
                <q-chip icon="place" outline>
                  {{ props.course.place }}
                </q-chip>
                <q-chip icon="school" outline color="positive">
                  Online Course
                </q-chip>
                <q-chip icon="payments" color="secondary" text-color="white">
                  {{ toRupiah(props.course.price) }}
                </q-chip>
              </div>

              <div class="text-body1 q-mb-lg description-box">
                {{ props.course.description }}
              </div>

              <div class="row justify-between items-center">
                <div class="column">
                  <div class="text-h6 text-secondary">
                    Mulai Belajar Sekarang
                  </div>
                  <div class="text-caption text-grey-7">
                    Daftar untuk mengakses materi pembelajaran
                  </div>
                </div>
                <q-btn color="primary" :to="{ name: 'courses.register', params: { id: props.course.id } }"
                  class="q-px-xl" size="lg" icon-right="arrow_forward" unelevated>
                  Daftar
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatDateRange } from 'src/composables/format';
import toRupiah from '@develoka/angka-rupiah-js';

const props = defineProps(['course']);
</script>

<style scoped>
.course-banner {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.course-image-card {
  transition: transform 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.course-image-card:hover {
  transform: translateY(-5px);
}

.course-info {
  background: white;
  border-radius: 12px;
}

.description-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .course-banner {
    padding: 16px;
  }

  .course-info {
    margin-top: 16px;
  }
}
</style>
