<template>
  <div id="contact-page">
    <div class="container flex ">
      <div class="row justify-center items-center full-width q-pa-md">
        <div class="col-md-5 col-sm-8 col-xs-10">
          <div class="text-h3 text-primary">Contact</div>
          <q-separator color="primary" size="5px" style="width: 200px"></q-separator>
        </div>
        <div class="col-md-6 col-sm-8 col-xs-10">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row">
              <div class="col-md-6 col-sm-10">
                <q-input outlined type="email" class="q-mr-md" v-model="contactForm.email" lazy-rules label="Email *"
                  :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
                  @input="v$.email.$touch" @blur="v$.email.$touch" />
              </div>
              <div class="col-md-6 col-sm-10">
                <q-input outlined type="text" v-model="contactForm.name" lazy-rules label="Nama *" :error="v$.name.$error"
                  :error-message="v$.name.$errors.map((e) => e.$message).join()" @input="v$.name.$touch"
                  @blur="v$.name.$touch" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-8">
                <q-input outlined v-model="contactForm.phone" label="Nomor HP *" lazy-rules type="number"
                  :error="v$.phone.$error" :error-message="v$.phone.$errors.map((e) => e.$message).join()"
                  @input="v$.phone.$touch" @blur="v$.phone.$touch" hint="Contoh 081......" />
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <q-input outlined v-model="contactForm.message" label="Pesan *" lazy-rules type="textarea"
                  :error="v$.message.$error" :error-message="v$.message.$errors.map((e) => e.$message).join()"
                  @input="v$.message.$touch" @blur="v$.message.$touch" />
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <q-btn :loading="sendLoading" type="submit" color="primary">Kirim</q-btn>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <div class="full-width">
      <FooterComVue />
    </div>
  </div>
</template>

<script setup lang="ts">
import FooterComVue from 'src/components/user/home/FooterCom.vue';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { ContactForm } from 'src/models/contact';
import { useEmail, useName, usePhoneNumber, useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { useQuasar } from 'quasar';
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Kontak')
const contactForm = ref<ContactForm>({
  name: '',
  email: '',
  phone: 0,
  message: ''
})

const { notify } = useQuasar();

const rules = {
  email: { required: useRequired(), email: useEmail() },
  name: { required: useRequired(), name: useName() },
  phone: { validNumber: usePhoneNumber(), required: useRequired() },
  message: { required: useRequired() }
}
const v$ = useVuelidate(rules, contactForm.value)

const sendLoading = ref(false);
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      sendLoading.value = true;
      await api.post('contacts', contactForm.value, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      notify({
        color: 'green',
        message: 'Berhasil terkirim'
      })
    } catch (error) {
      throw error;
    } finally {
      sendLoading.value = false;
    }
  } else {
    v$.value.$touch();
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 90dvh;
}
</style>
