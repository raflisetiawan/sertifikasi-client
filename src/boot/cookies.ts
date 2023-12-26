import { Cookies } from 'quasar';
import { boot } from 'quasar/wrappers';

let qCookies: Cookies;
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ ssrContext }) => {
  qCookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
});

export { qCookies };
