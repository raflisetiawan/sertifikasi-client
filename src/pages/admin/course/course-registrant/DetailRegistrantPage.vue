<template>
  <q-page padding>
    <div>
      <div class="row q-mb-sm">
        <div class="col-2 text-body1">Email </div>
        <div class="col-10 text-body1">: {{ registrant?.email }}</div>
      </div>
      <div class="row q-mb-sm">
        <div class="col-2 text-body1">Nama </div>
        <div class="col-10 text-body1">: {{ registrant?.name }}</div>
      </div>
      <div class="row q-mb-sm items-center ">
        <div class="col-2 text-body1">Nomor Whatsapp</div>
        <div class="col-10 text-body1">
          <div :class="$q.screen.lt.sm ? 'q-ml-md' : ''">: {{ registrant?.phone_number }}</div>
        </div>
      </div>
      <div class="row q-mb-sm items-center ">
        <div class="col-2 text-body1">Tanggal Mendaftar</div>
        <div class="col-10 text-body1" v-if="registrant">
          <div :class="$q.screen.lt.sm ? 'q-ml-md' : ''">: {{ useDateFormat(registrant?.registration_date) }}</div>
        </div>
      </div>
      <q-separator></q-separator>
      <div class="row q-my-sm items-center ">
        <div class="col-2 text-body1">Nama Kelas</div>
        <div class="col-10 text-body1">
          <div :class="$q.screen.lt.sm ? 'q-ml-md' : ''">: {{ registrant?.course_name }}</div>
        </div>
      </div>
      <div class="row q-my-sm items-center ">
        <div class="col-2 text-body1">Harga Kelas</div>
        <div class="col-10 text-body1" v-if="registrant">
          <div :class="$q.screen.lt.sm ? 'q-ml-md' : ''">: {{ toRupiah(registrant?.course_price) }}</div>
        </div>
      </div>
      <div class="row q-my-sm items-center ">
        <div class="col-2 text-body1">Bukti Pembayaran</div>
        <div class="col-10 text-body1" v-if="registrant">
          <div :class="$q.screen.lt.sm ? 'q-ml-md' : ''">: <q-btn @click="showSingle(registrant.payment_proof_url)"
              color="blue">Lihat bukti pembayaran</q-btn>
          </div>
        </div>
      </div>
      <div class="row q-my-sm items-center q-mt-md">
        <div class="q-col">
          <q-btn @click="submitRegistration" color="primary" :loading="loading">
            {{ registrant.verification === 1 ? 'Batalkan Pendaftaran' : 'Setujui Pendaftaran' }}</q-btn>
        </div>
      </div>
      <vue-easy-lightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" @hide="onHide" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';
import { useCourseRegistrantStore } from 'src/stores/course-registrant';
import { DetailRegistration } from 'src/models/course-registrant';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDateFormat } from 'src/composables/format';
import toRupiah from '@develoka/angka-rupiah-js'
const VueEasyLightbox = defineAsyncComponent(() => import('vue-easy-lightbox/dist/external-css/vue-easy-lightbox.esm.min.js'));
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useNotify } from 'src/composables/notifications';

const route = useRoute()
const { getCourseRegistrant } = useCourseRegistrantStore()
const registrant = ref<DetailRegistration>({
  course_name: '',
  course_price: '',
  email: '',
  name: '',
  phone_number: 0,
  registration_date: '',
  payment_proof_url: '',
  verification: 0
})
const router = useRouter();
const loading = ref(false);

useMetaTitle('Detail Pendaftar Kelas - Admin')

const visibleRef = ref(false)
const indexRef = ref(0) // default 0
const imgsRef = ref('')

const onShow = () => {
  visibleRef.value = true
}
const showSingle = (imageUrl: string) => {
  imgsRef.value = imageUrl
  onShow()
}

const onHide = () => {
  visibleRef.value = false;

}

const submitRegistration = async () => {
  try {
    loading.value = true;
    await api.post(`course-registrant/approve/${route.params.id}`, {}, {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      }
    })
    useNotify('Berhasil menyetujui pendaftaran', 'positive');
    router.push({ name: 'CourseRegistrantIndexPage' })
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }

}

onMounted(async () => {
  try {
    const data = await getCourseRegistrant(route.params.id);
    registrant.value = data;
  } catch (error) {
    throw error;
  }
})

</script>

<style scoped></style>
