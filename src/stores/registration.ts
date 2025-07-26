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

        const registrationData = response.data.data;

        // For free courses, the backend might directly return enrollment info
        if (registrationData.enrollment) {
          // Directly return the whole data object for the component to handle redirection
          return registrationData;
        }

        // For paid courses, proceed as before
        const registration: Registration = {
          id: registrationData.registration.id,
          user_id: registrationData.registration.user_id,
          course_id: registrationData.registration.course_id,
          verification: registrationData.registration.verification,
          verified_at: registrationData.registration.verified_at,
          verified_by: registrationData.registration.verified_by,
          status: registrationData.registration.status,
        };

        this.currentRegistration = registration;
        return { registration }; // Return in the same structure as free courses for consistency
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
