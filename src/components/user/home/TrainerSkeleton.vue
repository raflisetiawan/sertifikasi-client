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
    <div class="row">
      <div class="col-md-4 col-sm-6 col-xs-12">
        <q-card class="my-card" flat>
          <q-card-section class=" flex-center row">
            <q-skeleton height="100px" width="100px" class="justify-center" />
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '100px' : '50px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '150px' : '70px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '200px' : '100px'"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-6 col-xs-12">
        <q-card class="my-card" flat>
          <q-card-section class=" flex-center row">
            <q-skeleton height="100px" width="100px" class="justify-center" />
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '100px' : '50px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '150px' : '70px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '200px' : '100px'"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-6 col-xs-12">
        <q-card class="my-card" flat>
          <q-card-section class=" flex-center row">
            <q-skeleton height="100px" width="100px" class="justify-center" />
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '100px' : '50px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '150px' : '70px'"></q-skeleton>
            </div>
            <div class="row justify-center">
              <q-skeleton type="text" :width="$q.screen.gt.sm ? '200px' : '100px'"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
