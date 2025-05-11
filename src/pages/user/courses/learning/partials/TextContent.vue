<template>
  <div class="text-content">
    <!-- HTML Content -->
    <div v-if="content.format === 'html'" v-html="sanitizedHtml" class="html-content"></div>

    <!-- Markdown Content -->
    <div v-else class="markdown-content">{{ content.content }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TextContent } from 'src/models/module-learning';
import DOMPurify from 'dompurify';

const props = defineProps<{
  content: TextContent;
}>();

// Sanitize HTML content to prevent XSS
const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(props.content.content);
});
</script>

<style lang="scss" scoped>
.text-content {
  padding: 16px;
  line-height: 1.6;

  .html-content {
    :deep(h1) {
      font-size: 2em;
      margin-bottom: 1em;
    }

    :deep(h2) {
      font-size: 1.5em;
      margin-bottom: 0.8em;
    }

    :deep(h3) {
      font-size: 1.2em;
      margin-bottom: 0.6em;
    }

    :deep(p) {
      margin-bottom: 1em;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: 1em;
      padding-left: 2em;
    }

    :deep(li) {
      margin-bottom: 0.5em;
    }

    :deep(code) {
      background: rgba(0, 0, 0, 0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }

    :deep(pre) {
      background: rgba(0, 0, 0, 0.05);
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 1em;
    }

    :deep(blockquote) {
      border-left: 4px solid $primary;
      padding-left: 1em;
      margin: 1em 0;
      color: rgba(0, 0, 0, 0.7);
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;

      th,
      td {
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 0.5em;
      }

      th {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .markdown-content {
    white-space: pre-wrap;
    font-family: inherit;
  }
}
</style>
