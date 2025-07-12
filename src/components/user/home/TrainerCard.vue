<template>
  <div>
    <div class="q-pa-md" id="trainer" style="height: 700px;">
      <div class="row justify-center q-mt-lg">
        <div class="col-4">
          <div class="text-center">
            <div class="text-h4">Trainer</div>
            <q-separator color="grey"></q-separator>
          </div>
        </div>
      </div>
      <q-carousel v-show="$q.screen.gt.sm" height="70vh" autoplay v-model="slide" infinite transition-prev="slide-right"
        transition-next="slide-left" swipeable animated control-color="primary" navigation arrows>
        <!-- Loop through the computed property `groupedTrainers` -->
        <q-carousel-slide :name="index + 1" :key="index" v-for="(group, index) in groupedTrainers"
          class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <!-- Loop through the trainers in the current group -->
            <q-card v-for="trainer in group" :key="trainer.id" class="my-card col-4 text-center" flat
              @click="$router.push({ name: 'trainers.show', params: { id: trainer.id } })">
              <div class="row justify-center">
                <q-img :src="storageBaseUrl + trainer.image" width="250px" />

              </div>
              <q-card-section>
                <div class="text-h5 q-mt-sm q-mb-xs">{{ trainer.name }}</div>
                <div class=" text-overline text-orange-9">{{ trainer.qualification }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useTrainerStore } from 'src/stores/trainer';
import { computed, ref } from 'vue';

const { getStarredTrainer } = useTrainerStore()

const slide = ref(1)
const trainers = await getStarredTrainer();
const groupedTrainers = computed(() => {
  const result = [];
  for (let i = 0; i < trainers.length; i += 3) {
    result.push(trainers.slice(i, i + 3));
  }
  return result;
});

</script>

<style scoped></style>
