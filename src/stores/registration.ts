import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { PaymentUpdateRequest } from 'src/models/payment';
import type {
  Registration,
  Payment,
  RegistrationResponse,
} from 'src/models/registration';

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    currentRegistration: null as Registration | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async registerForCourse(courseId: number) {
      try {
        const response = await api.post<RegistrationResponse>(
          'registration',
          { course_id: courseId },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );

        // Map response to Registration interface
        const registration: Registration = {
          id: response.data.data.registration.id,
          user_id: response.data.data.registration.user_id,
          course_id: response.data.data.registration.course_id,
          verification: response.data.data.registration.verification,
          verified_at: response.data.data.registration.verified_at,
          verified_by: response.data.data.registration.verified_by,
          status: response.data.data.registration.status,
        };

        this.currentRegistration = registration;
        return registration;
      } catch (error) {
        throw error;
      }
    },

    async createPayment(registrationId: number, amount: number) {
      try {
        const response = await api.post<{ data: Payment }>(
          'payments/create',
          {
            registration_id: registrationId,
            amount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        if (this.currentRegistration) {
          this.currentRegistration.payment = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async updatePaymentStatus(paymentData: PaymentUpdateRequest) {
      try {
        const response = await api.post<{
          success: boolean;
          message: string;
          data?: Payment;
        }>('payments/status/update', paymentData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getUserRegistrations() {
      try {
        const response = await api.get<{ data: Registration[] }>(
          'user/registrations',
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
