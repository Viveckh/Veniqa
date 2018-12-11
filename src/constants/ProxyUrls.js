export default {
  // baseUrl: 'https://veniqa.azurewebsites.net',
  registerUrl: '/security/signup',
  loginUrl: '/security/login',
  isSessionActive: '/security/isLoggedIn',
  forgotPassword: '/security/forgotPassword?email=',
  validateResetToken: '/security/validatePasswordResetToken/',
  resetPassword: '/security/resetPassword',

  searchProduct: '/catalog/search',
  confirmEmail: '/security/confirmEmailAddress',
  resendEmail: '/security/resendEmailAddressConfirmationLink?email=',

  // Shopping cart
  addToCart: '/shopping/addToCart',
  getCart: '/shopping/getCart',
  deleteCart: '/shopping/deleteFromCart',
  updateCart: '/shopping/updateCart',

  // Admin Panel
  baseUrl: 'https://hsjnruyi2xjmcrl.azurewebsites.net',
  listCatalog: '/catalog/search',
  deleteProduct: '/catalog/deleteProduct',
};
