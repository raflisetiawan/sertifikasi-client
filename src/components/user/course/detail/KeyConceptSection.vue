<template>
  <div>
    <!-- Key Concepts Section -->
    <section id="key-concept">
      <div class="row q-mt-lg justify-center">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6 text-center">Konsep Utama</div>
        </div>
      </div>
      <div class="row justify-center q-mt-md q-mb-md">
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1" v-html="props.course?.key_concepts"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['course']);
</script>

<style scoped></style>
