<template>
  <div>
    <div class="row">
      <div class="text-h5 q-mb-md" v-if="$state.followedCourses.length !== 0">Kelas yang anda ikuti:</div>
      <div class="col-10" v-for="course in $state.followedCourses" :key="course.id">
        <q-card class="my-card q-mb-md" flat bordered>
          <q-card-section horizontal>
            <q-img class="col-3" :src="storageBaseUrl + 'courses/' + course.image" />
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">{{ course.name }}</div>
              <div class="text-caption text-grey q-mb-md">
                Online via {{ course.place }}
              </div>
              <div class="row q-mb-md">
                <StatusBadgeComponent :status="course.status" />
              </div>
              <q-btn class="q-mr-md" color="primary" target="_blank"
                :href="storageBaseUrl + 'courses/guideline/' + course.guidelines">Pedoman</q-btn>
              <q-btn color="blue" class="q-mr-md"
                :to="{ name: 'MyProfileDetailCoursePage', params: { id: course.id } }">Detail</q-btn>
            </q-card-section>

          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user';
import { useUserCourse } from 'stores/userCourse';
import StatusBadgeComponent from 'src/components/StatusBadgeComponent.vue';
import { onMounted } from 'vue';
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar'

const { getFollowedCourse, $state } = useUserCourse();
const { $state: userState } = useUserStore();
const { notify } = useQuasar();
const initData = async () => {
  try {
    await getFollowedCourse(userState.id);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status !== 404) {
        notify({
          message: error.message
        })
      }
    }
    return Promise.reject(error);
  }
}

onMounted(async () => {
  await initData();
})

</script>

<style scoped></style>
