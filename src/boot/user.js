import { boot } from 'quasar/wrappers'
import { USER } from '../store/namespace';
import { CHECK_LOCALSTORAGE } from '../store/user/actions';

export default boot(({ store }) => store.dispatch(`${USER}/${CHECK_LOCALSTORAGE}`))