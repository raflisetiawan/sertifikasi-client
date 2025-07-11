<template>
  <q-page padding>
    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12">
        <q-skeleton type="text" class="text-h4" />
        <q-skeleton type="text" class="q-mt-sm" width="60%" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-md">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-h6 q-mt-md">{{ error }}</div>
      <q-btn color="primary" label="Coba Lagi" @click="fetchCourseDetail" class="q-mt-sm" />
    </div>

    <template v-else-if="courseDetail">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <h1 class="text-h4 q-mb-md">{{ courseDetail.course.name }}</h1>
          <p class="text-grey-8">{{ courseDetail.course.description }}</p>

          <q-btn
            v-if="courseDetail.course.id"
            label="Go to Forum"
            color="primary"
            icon="forum"
            :to="{ name: 'course.forum', params: { courseId: courseDetail.course.id } }"
            class="q-mb-md"
          />

          <KeyConceptSection v-if="courseDetail.course.key_concepts" :concepts="courseDetail.course.key_concepts" />
          <FacilitySection v-if="courseDetail.course.facility" :facilities="courseDetail.course.facility" />
        </div>

        <div class="col-12 col-md-4">
          <CourseTimelineCard :start-date="courseDetail.course.start_date" :end-date="courseDetail.course.end_date" />
          <RegistrationInfoCard :registered-at="courseDetail.registered_at" :verification="courseDetail.verification"
            :verified-at="courseDetail.verified_at" />
          <PaymentInfoCard v-if="courseDetail.payment" :payment-status="courseDetail.payment.status"
            :payment-amount="courseDetail.payment.amount" :payment-date="courseDetail.payment.date" />
          <ProgressInfoCard v-if="courseDetail.enrollment"
            :progress-percentage="courseDetail.enrollment.progress_percentage"
            :progress-status="courseDetail.enrollment.status" />
        </div>
      </div>

      <div class="q-mt-xl">
        <LiveSessionList :course-id="courseDetail.course.id" />
      </div>

      <div class="q-mt-xl">
        <div class="text-h5 q-mb-md">Modul Pembelajaran</div>
        <div class="row q-col-gutter-md">
          <div v-for="module in courseDetail.modules" :key="module.id" class="col-12">
            <ModuleCard :module="module" :course-detail="courseDetail" />
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { useCourseDetail } from 'src/composables/useCourseDetail';
import KeyConceptSection from 'src/components/user/course/dashboard/KeyConceptSection.vue';
import FacilitySection from 'src/components/user/course/dashboard/FacilitySection.vue';
import CourseTimelineCard from 'src/components/user/course/detail/CourseTimelineCard.vue';
import RegistrationInfoCard from 'src/components/user/course/detail/RegistrationInfoCard.vue';
import PaymentInfoCard from 'src/components/user/course/detail/PaymentInfoCard.vue';
import ProgressInfoCard from 'src/components/user/course/detail/ProgressInfoCard.vue';
import ModuleCard from 'src/components/user/course/detail/ModuleCard.vue';
import LiveSessionList from 'src/components/user/course/LiveSessionList.vue';

const { courseDetail, loading, error, fetchCourseDetail } = useCourseDetail();
console.log(courseDetail, loading, error);
</script>

<style lang="scss" scoped>
.q-item {
  min-height: 40px;
}

.progress-label {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: white;
}
</style>
