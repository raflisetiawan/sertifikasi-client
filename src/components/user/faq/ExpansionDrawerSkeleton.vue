<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-lg">Pertanyaan yang sering di tanyakan (FAQ)</div>
    <q-list bordered class="rounded-borders">
      <q-expansion-item expand-separator group="faq" default-opened>
        <template v-slot:header>
          <q-skeleton type="text" class="full-width"></q-skeleton>
        </template>
        <q-card>
          <q-card-section>
            <div class="text-body1">
              <q-skeleton type="text" class="full-width"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator group="faq">
        <template v-slot:header>
          <q-skeleton type="text" class="full-width"></q-skeleton>
        </template>
        <q-card>
          <q-card-section>
            <div class="text-body1">
              <q-skeleton type="text" class="full-width"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator group="faq">
        <template v-slot:header>
          <q-skeleton type="text" class="full-width"></q-skeleton>
        </template>
        <q-card>
          <q-card-section>
            <div class="text-body1">
              <q-skeleton type="text"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator group="faq">
        <template v-slot:header>
          <q-skeleton type="text" class="full-width"></q-skeleton>
        </template>
        <q-card>
          <q-card-section>
            <div class="text-body1">
              <q-skeleton type="text"></q-skeleton>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
