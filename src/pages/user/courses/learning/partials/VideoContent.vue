<template>
  <div>
    <div class="video-wrapper">
      <q-video :src="videoEmbedUrl" :ratio="16 / 9" />
    </div>
    <div v-if="content.is_downloadable" class="q-mt-md">
      <q-btn color="primary" icon="download" :href="content.video_url" target="_blank" label="Download Video" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VideoContent } from 'src/models/module-learning';

const props = defineProps<{
  content: VideoContent;
}>();

const videoEmbedUrl = computed(() => {
  const url = props.content.video_url;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=')
      ? url.split('v=')[1]?.split('&')[0]
      : url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  return url;
});
</script>

<style lang="scss" scoped>
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 */
  height: 0;

  :deep(iframe) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
