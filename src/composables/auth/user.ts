import { AxiosError } from 'axios';
import { api } from 'src/boot/axios';

const useUser = async (token: null | string) => {
  try {
    const response = await api.get('user', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error('An error occurred.');
  }
};

export { useUser };
