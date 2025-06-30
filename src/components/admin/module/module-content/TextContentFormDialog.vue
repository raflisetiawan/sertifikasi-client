<template>
    <q-dialog v-model="showDialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
        transition-hide="slide-down">
        <q-card>
            <q-bar>
                <q-space />
                <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                    <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                    <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section class="row items-center">
                <div class="text-h6">{{ dialogTitle }}</div>
            </q-card-section>

            <q-form @submit="onSubmit">
                <q-card-section class="q-gutter-md">
                    <!-- Order Input -->
                    <q-input v-model.number="form.order" type="number" label="Urutan *" outlined
                        :error="v$.order.$error" :error-message="v$.order.$errors[0]?.$message?.toString()"
                        @blur="v$.order.$touch" />

                    <!-- Title Input -->
                    <q-input v-model="form.title" label="Judul *" outlined :error="v$.title.$error"
                        :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />

                    <!-- Format Selection -->
                    <q-select v-model="form.format" :options="formatOptions" label="Format *" outlined
                        :error="v$.format.$error" :error-message="v$.format.$errors[0]?.$message?.toString()"
                        @blur="v$.format.$touch" />

                    <!-- Content Editor -->
                    <q-editor v-model="form.content" :toolbar="[
                        ['bold', 'italic', 'strike', 'underline'],
                        ['numerated', 'outdent', 'indent'],
                        ['quote', 'unordered', 'ordered'],
                        ['undo', 'redo'],
                        ['viewsource']
                    ]" min-height="300px" :error="v$.content.$error" :error-message="v$.content.$errors[0]?.$message"
                        @blur="v$.content.$touch" />

                    <!-- Is Required Toggle -->
                    <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Batal" color="grey" v-close-popup />
                    <q-btn type="submit" :label="submitButtonLabel" color="primary" :loading="loading" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import { BaseContent, TextContent } from 'src/models/module-content';
interface TextContentPayload {
    module_id: number;
    title: string;
    content: string;
    format: 'markdown' | 'html';  // Change this to use literal types
    order: number;
    is_required: boolean;
    minimum_duration_seconds?: number;
}

const props = defineProps<{
    moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const maximizedToggle = ref(true)
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);

// Computed properties for dynamic UI
const isEditMode = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditMode.value ? 'Edit Konten Teks' : 'Tambah Konten Teks');
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Simpan');

const formatOptions = [
    { label: 'HTML', value: 'html' as const },
    { label: 'Markdown', value: 'markdown' as const }
];

const initialFormState = {
    module_id: props.moduleId,
    title: '',
    content: '',
    format: 'html' as const,  // Add type assertion
    order: 1,
    is_required: true
};

const form = reactive<TextContentPayload>({ ...initialFormState });

const rules = {
    title: { required: useRequired() },
    content: { required: useRequired() },
    format: { required: useRequired() },
    order: {
        required: useRequired(),
        numeric: useNumeric()
    }
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        useNotify('Mohon periksa form kembali', 'negative');
        return;
    }

    try {
        loading.value = true;
        if (isEditMode.value && contentId.value) {
            // Update existing content
            await moduleContentStore.updateTextContent(contentId.value, form);
            useNotify('Konten teks berhasil diperbarui', 'positive');
        } else {
            // Create new content
            await moduleContentStore.createTextContent(form);
            useNotify('Konten teks berhasil ditambahkan', 'positive');
        }
        emit('refresh');
        showDialog.value = false;
    } catch (error) {
        useNotify(`Gagal ${isEditMode.value ? 'memperbarui' : 'menambahkan'} konten teks`, 'negative');
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    Object.assign(form, initialFormState);
    v$.value.$reset();
}

defineExpose({
    show: (contentToEdit: (BaseContent & { content: TextContent }) | null = null) => {
        if (contentToEdit) {
            // Edit Mode
            mode.value = 'edit';
            contentId.value = contentToEdit.id;
            form.title = contentToEdit.title;
            form.order = contentToEdit.order;
            form.is_required = contentToEdit.is_required;
            form.content = contentToEdit.content.content;
            form.format = contentToEdit.content.format;
        } else {
            // Add Mode
            mode.value = 'add';
            contentId.value = null;
            resetForm();
        }
        showDialog.value = true;
    }
});
</script>
