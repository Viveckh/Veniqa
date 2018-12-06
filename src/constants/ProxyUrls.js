export default {
  baseUrl: 'https://veniqa.azurewebsites.net',
  registerUrl: '/security/signup',
  loginUrl: '/security/login',
  isSessionActive: '/security/isLoggedIn',

  searchProduct: '/catalog/search',
  confirmEmail: '/security/confirmEmailAddress',
  resendEmail: '/security/resendEmailAddressConfirmationLink?email=',


  // Shopping cart
  addToCart: '/shopping/addToCart',
  getCart: '/shopping/getCart',
  deleteCart: '/shopping/deleteFromCart',
  updateCart: '/shopping/updateCart',
};
