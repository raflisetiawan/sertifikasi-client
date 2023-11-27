<template>
  <div id="admin-page">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-card class="my-card q-mx-sm">
            <q-card-section>
              <div class="text-h6">Manage Kelas</div>
            </q-card-section>

            <q-card-actions>
              <q-btn color="primary" :to="{ name: 'AdminCoursePage' }">Manage</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-card class="my-card q-mx-sm">
            <q-card-section>
              <div class="text-h6">Manage FAQ</div>
            </q-card-section>

            <q-card-actions>
              <q-btn color="primary" :to="{ name: 'FaqAdminIndexPage' }">Manage</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Dashboard - Admin');
</script>

<style scoped></style>
