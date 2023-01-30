import Login from '../pages/Login';
import Home from '../pages/Home';
import Page404 from '../pages/404'

const publicRoutes = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/404',
    component: Page404,
    exact: true,
  },
];

export default publicRoutes;