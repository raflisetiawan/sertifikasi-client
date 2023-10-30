import { useUserStore } from 'src/stores/user';

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

const isAdmin = (): boolean => {
  const { role } = useUserStore();
  if (role === 'admin') return true;
  else return false;
};

export { isAuthenticated, isAdmin };
