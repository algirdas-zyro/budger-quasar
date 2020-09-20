export const HOME_PATH = '/'
export const LOGIN_PATH = '/login'
export const REGISTER_PATH = '/register'
export const CREATE_PATH = '/create'
export const CATEGORIES_PATH = '/categories'
export const IMPORTER_PATH = '/importer'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: HOME_PATH, component: () => import('pages/Index.vue') },
      { path: LOGIN_PATH, component: () => import('pages/Login.vue') },
      { path: REGISTER_PATH, component: () => import('pages/Register.vue') },
      { path: CREATE_PATH, component: () => import('pages/Create.vue') },
      { path: CATEGORIES_PATH, component: () => import('pages/Categories.vue') },
      { path: IMPORTER_PATH, component: () => import('pages/Importer.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
