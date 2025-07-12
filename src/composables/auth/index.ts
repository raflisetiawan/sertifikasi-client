import { useUserStore } from 'src/stores/user';
import { qCookies } from 'src/boot/cookies';

const isAuthenticated = (): boolean => {
  const token = qCookies.get('token');
  return !!token;
};

const isAdmin = (): boolean => {
  const { role } = useUserStore();
  if (role === 'admin') return true;
  else return false;
};
const isTrainer = (): boolean => {
  const { role } = useUserStore();
  if (role === 'trainer') return true;
  else return false;
};

export { isAuthenticated, isAdmin, isTrainer };
