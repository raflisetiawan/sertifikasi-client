<template>
  <div class="assignment-details q-pa-md">
    <!-- Instructions -->
    <div class="text-subtitle1 q-mb-md">Instructions:</div>
    <div class="instructions q-mb-lg" v-html="sanitizedInstructions"></div>

    <!-- Submission Requirements -->
    <div class="text-subtitle1 q-mb-sm">Submission Requirements:</div>
    <q-list dense padding class="rounded-borders bg-grey-1 q-mb-lg">
      <q-item v-for="(req, index) in content.submission_requirements" :key="index" class="text-body2">
        <q-item-section avatar>
          <q-icon name="check_circle_outline" color="primary" />
        </q-item-section>
        <q-item-section>{{ req }}</q-item-section>
      </q-item>
    </q-list>

    <!-- Submission Info -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="text-caption">Deadline</div>
            <div class="text-subtitle2">
              {{ formattedDueDate }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="text-caption">Maximum File Size</div>
            <div class="text-subtitle2">
              {{ content.max_file_size_mb }} MB
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- File Upload -->
    <div class="upload-section">
      <q-file v-model="assignmentFile" label="Upload Your Assignment" filled bottom-slots counter
        :max-file-size="content.max_file_size_mb * 1024 * 1024" @rejected="onFileRejected">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:hint>
          Max file size: {{ content.max_file_size_mb }}MB
        </template>
      </q-file>

      <div class="row justify-end q-mt-md">
        <q-btn color="primary" :loading="loading" :disable="!assignmentFile" @click="submitAssignment" icon-right="send"
          label="Submit Assignment" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date, useQuasar } from 'quasar';
import DOMPurify from 'dompurify';
import { AssignmentContent } from 'src/models/module-learning';
import { useModuleContentStore } from 'src/stores/module-content';
import { useRoute } from 'vue-router';

const props = defineProps<{
  content: AssignmentContent;
  contentId: number;
}>();

const emit = defineEmits<{
  (e: 'submit-success'): void;
}>();

const $q = useQuasar();
const loading = ref(false);
const assignmentFile = ref<File | null>(null);

const sanitizedInstructions = computed(() => {
  return DOMPurify.sanitize(props.content.instructions);
});

const formattedDueDate = computed(() => {
  return date.formatDate(props.content.due_date, 'D MMMM YYYY');
});

interface RejectedEntry {
  failedPropValidation: string;
}

const onFileRejected = (rejectedEntries: RejectedEntry[]) => {
  $q.notify({
    type: 'negative',
    message: `File rejected: ${rejectedEntries[0].failedPropValidation}`
  });
};

const moduleContentStore = useModuleContentStore();
const route = useRoute();

const submitAssignment = async () => {
  if (!assignmentFile.value || loading.value) return;

  try {
    loading.value = true;
    const enrollmentId = Number(route.params.enrollmentId);
    const moduleId = Number(route.params.moduleId);

    await moduleContentStore.submitAssignment(
      enrollmentId,
      moduleId,
      props.contentId,
      assignmentFile.value
    );

    emit('submit-success');
    assignmentFile.value = null;

    $q.notify({
      type: 'positive',
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    let errorMessage = 'Failed to submit assignment';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    $q.notify({
      type: 'negative',
      message: errorMessage
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.assignment-details {
  .instructions {
    border-left: 4px solid $primary;
    padding-left: 16px;
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 4px;
  }

  .upload-section {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 16px;
    margin-top: 16px;
  }

  :deep(ol) {
    padding-left: 20px;
  }

  :deep(li) {
    margin-bottom: 8px;
  }
}
</style>
