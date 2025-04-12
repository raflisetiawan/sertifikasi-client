<template>
  <div id="key-concept-skeleton">
    <section id="key-concept">
      <div class="row q-mt-lg justify-center">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <q-skeleton type="text" width="100px" />
        </div>
      </div>
      <div class="row justify-center q-mt-md q-mb-md">
        <div class="col-md-10 col-sm-9 col-xs-8">
          <q-skeleton type="text" width="90%" class="q-mb-sm" />
          <q-skeleton type="text" width="85%" class="q-mb-sm" />
          <q-skeleton type="text" width="80%" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#key-concept-skeleton {
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 16px;
}
</style>
