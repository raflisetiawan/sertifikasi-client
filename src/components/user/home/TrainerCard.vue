<template>
  <div class="q-pa-md" id="trainer" style="height: 700px;">
    <div class="row justify-center q-mt-lg">
      <div class="col-4">
        <div class="text-center">
          <div class="text-h4">Trainer</div>
          <q-separator color="grey"></q-separator>
        </div>
      </div>
    </div>
    <q-carousel v-if="$q.screen.gt.sm" height="70vh" autoplay v-model="slide" infinite transition-prev="slide-right"
      transition-next="slide-left" swipeable animated control-color="primary" navigation arrows>
      <q-carousel-slide :name="1" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-03.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-01.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-02.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-04.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-05.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-06.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-03.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-03.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-4 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-01.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <q-carousel v-else height="93vh" v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable
      animated control-color="primary" navigation arrows>
      <q-carousel-slide :name="1" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-02.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-04.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-05.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-06.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-03.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card col-6 text-center" flat>
            <div class="row justify-center">
              <q-img src="~/assets/team-03.jpg" width="250px" />

            </div>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">John Doe</div>
              <div class=" text-overline text-orange-9">Software Engineer
              </div>
              <div class="text-caption text-grey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>

    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const slide = ref(1)
</script>

<style scoped></style>
