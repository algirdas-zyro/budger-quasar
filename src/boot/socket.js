import { boot } from 'quasar/wrappers'
import { SOCKET } from '../store/namespace';
import { INITIALIZE } from '../store/socket/actions';

export default boot(({ store }) => store.dispatch(`${SOCKET}/${INITIALIZE}`))
