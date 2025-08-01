<template>
  <div v-if="course?.live_sessions && course.live_sessions.length > 0" class="q-pa-md">
    <div class="row justify-center">
      <div class="text-h5 q-mt-md text-center">Jadwal Live Session</div>
    </div>
    <div class="q-mt-lg row q-col-gutter-md justify-center">
      <div v-for="session in course.live_sessions" :key="session.id" class="col-12 col-md-8">
        <q-card class="live-session-card q-mb-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ session.title }}</div>
            <div class="text-subtitle2 text-grey-8">{{ session.description }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row items-center no-wrap">
              <q-icon name="event" color="primary" size="24px" class="q-mr-md" />
              <div class="text-body1">
                {{ formatDateTimeRange(session) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QCard, QCardSection, QSeparator, QIcon } from 'quasar';
import { defineProps } from 'vue';
import { date } from 'quasar';
import { Courses } from 'src/models/course';
import { LiveSession } from 'src/models/live-session';

interface Props {
  course: Courses | null;
}

defineProps<Props>();

const formatDateTimeRange = (session: LiveSession): string => {
  const startDateTime = new Date(session.start_time);
  const endDateTime = new Date(session.end_time);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedStartDate = startDateTime.toLocaleDateString('id-ID', options);
  const formattedEndDate = endDateTime.toLocaleDateString('id-ID', options);

  const formattedStartTime = date.formatDate(startDateTime, 'HH:mm');
  const formattedEndTime = date.formatDate(endDateTime, 'HH:mm');

  if (formattedStartDate === formattedEndDate) {
    return `${formattedStartDate}, pukul ${formattedStartTime} - ${formattedEndTime} WIB`;
  } else {
    return `${formattedStartDate}, ${formattedStartTime} WIB - ${formattedEndDate}, ${formattedEndTime} WIB`;
  }
};

const isSessionActive = (session: LiveSession): boolean => {
  const now = new Date();
  const startDateTime = new Date(session.start_time);
  const endDateTime = new Date(session.end_time);

  return date.isBetweenDates(now, startDateTime, endDateTime, {
    inclusive: true,
  });
};
</script>

<style scoped>
.live-session-card {
  border-radius: 12px;
}
</style>
