import { Notify } from 'quasar';

const useNotify = (message: string, color: string) => {
  Notify.create({
    message,
    color,
  });
};

export { useNotify };
