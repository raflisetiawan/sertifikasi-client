<template>
  <div>
    <div class="text-h5 q-my-md">Trainer Lainnya</div>
    <div class="row justify-around">
      <div class="col-md-3 col-sm-4 col-xs-10" v-for="trainer in trainers" :key="trainer.id">
        <q-card class="my-card text-center q-mx-md" flat>
          <q-item-section avatar class="flex-center">
            <q-avatar size="100px">
              <q-img :src="storageBaseUrl + trainer.image">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Cannot load image
                  </div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>
          <div class="text-h6 text-center q-mt-md">{{ trainer.name }}</div>
          <div class="text-subtitle1 text-center q-mt-md">{{ trainer.qualification }}</div>
          <q-btn flat color="blue"
            @click="$router.replace({ name: 'TrainerIndexPage', params: { id: trainer.id } })">lihat</q-btn>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useTrainerStore } from 'src/stores/trainer';
import { useRoute } from 'vue-router';

const props = defineProps(['trainer'])

const route = useRoute();
const { getRandomOrSameQualificationTrainer } = useTrainerStore()


const trainers = await getRandomOrSameQualificationTrainer(props.trainer.qualification, route.params.id);

</script>

<style scoped></style>
