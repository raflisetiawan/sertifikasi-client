<template>
  <div> 
       <!-- Trainers Section -->
      <section id="trainers-section">
        <div class="full-width q-pa-md" style="background-color: rgb(255, 208, 216);">
          <div class="row justify-center">
            <div class="text-h5 q-mt-md text-center">Trainers</div>
          </div>
          <div class="row justify-center">
            <q-separator color="primary" class="text-center" width="300px"></q-separator>
          </div>
          <div class="row q-mt-md justify-center q-gutter-md">
            <div v-for="trainer in props.course.trainers" :key="trainer.id" class="col-md-4 col-sm-6 col-xs-12">
              <div class="text-center">
                <div style="cursor: pointer;">
                  <q-img @click="$router.push({ name: 'TrainerIndexPage', params: { id: trainer.id } })" width="200px"
                    height="200px" style="border-radius: 50%; overflow: hidden; border: solid 1px grey;"
                    :src="trainer.image ? getTrainerImage(trainer.image) : 'path/to/default/image.jpg'">
                  </q-img>
                  <div @click="$router.push({ name: 'TrainerIndexPage', params: { id: trainer.id } })"
                    class="text-h6 text-center">
                    {{ trainer.name }}
                  </div>
                </div>
                <div class="text-overline text-center">
                  {{ trainer.qualification }}
                </div>
                <div v-html="trainer.description">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  </div>
</template>
<script setup lang="ts">
import {storageBaseUrl} from 'src/boot/axios';

const props = defineProps(['course'])

const getTrainerImage = (image: string | File | undefined | null) => {
  return storageBaseUrl + image;
}
</script>