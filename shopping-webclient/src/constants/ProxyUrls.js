export default {
  baseUrl: 'https://shop-server.veniqa.com/',
  registerUrl: '/security/signup',
  loginUrl: '/security/login',
  logoutUrl: '/security/logout',
  isSessionActive: '/security/isLoggedIn',
  forgotPassword: '/security/forgotPassword?email=',
  validateResetToken: '/security/validatePasswordResetToken/',
  resetPassword: '/security/resetPassword',
  resendEmailConfirmation: '/security/resendEmailAddressConfirmationLink?email=',
  recaptcha: 'https://www.google.com/recaptcha/api/siteverify',

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
  address: '/user/address',

  createCheckout: 'orders/createCheckout',
  createPaymentToken: 'orders/createPaymentToken',
  completeCheckout: 'orders/completeCheckout',

  featuredUrl: '/ui/featured?name=',

  // Order list
  orderList: '/user/orderList',
  orderDetail: '/user/orderDetails?orderId=',
  // Payment URLS
  stripePay: '/orders/completeCheckoutUsingCard',
  khaltiPay: '/orders/completeCheckoutUsingKhalti',
  
  // Stripe Payment Intents
  stripeInstantPay: '/orders/stripePaymentInstant',
  stripeInstantPayment: '/orders/completeCheckoutUsingStripePaymentInstant',

  // Categories List
  categoriesUrl: '/ui/productCategoryList',
};
