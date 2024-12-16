export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/customBaseHome', // 这里自定义路由标记，在代码中会有相应的处理
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
}
export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
