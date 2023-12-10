<template>
  <div id="trainer-detail" class="q-pa-md">
    <div class="row justify-center">
      <q-avatar size="100px">
        <q-img :src="storageBaseUrl + trainer.image">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Cannot load image
            </div>
          </template>
        </q-img>
      </q-avatar>
    </div>
    <div class="text-h6 text-center q-mt-md">{{ trainer.name }}</div>
    <div class="text-subtitle1 text-center q-mt-md">{{ trainer.qualification }}</div>
    <div class="text-subtitle2 text-center q-mt-md">{{ trainer.email }}</div>
    <div class="text-body1 text-center q-mt-md">{{ trainer.description }}</div>
  </div>
  <Suspense>
    <TrainerList :trainer="theTrainer"></TrainerList>
    <template #fallback>
      <TrainerListSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useMetaTitle } from 'src/composables/meta';
import { useTrainerStore } from 'src/stores/trainer';
import { defineAsyncComponent, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import TrainerListSkeleton from './TrainerListSkeleton.vue'


const { getTrainer } = useTrainerStore()
const route = useRoute();

const trainer = ref()
trainer.value = await getTrainer(route.params.id);
let theTrainer = trainer.value
useMetaTitle(`Trainer - ${trainer.value.name}`)

watchEffect(async () => {
  trainer.value = await getTrainer(route.params.id);
})

const TrainerList = defineAsyncComponent(() => import('components/user/trainer/TrainerList.vue'))

</script>

<style scoped></style>
