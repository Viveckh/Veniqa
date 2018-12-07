export default {
  baseUrl: 'https://veniqa.azurewebsites.net',
  registerUrl: '/security/signup',
  loginUrl: '/security/login',
  logoutUrl: '/security/logout',
  isSessionActive: '/security/isLoggedIn',
  forgotPassword: '/security/forgotPassword?email=',
  validateResetToken: '/security/validatePasswordResetToken/',
  resetPassword: '/security/resetPassword',

  searchProduct: '/catalog/search',
  getProductDefinitionUrl: '/catalog/getProductDetails?productId=',
  confirmEmail: '/security/confirmEmailAddress',
  resendEmail: '/security/resendEmailAddressConfirmationLink?email=',


  // Shopping cart
  addToCart: '/shopping/addToCart',
  getCart: '/shopping/getCart',
  deleteCart: '/shopping/deleteFromCart',
  updateCart: '/shopping/updateCart',

  // Addresses
  addressUrl: '/address',
};
