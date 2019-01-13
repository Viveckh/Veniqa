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
  addProduct: '/catalog/addProduct',
  refData: '/referenceData/getCatalogBundle',
  getProduct: '/catalog/getProductDetails',
  editProduct: '/catalog/updateProduct',

  // User settings
  roles: '/referenceData/getRoles',
  allAdmins: '/superAdmin/getAllAdmins',
  addAdmin: '/superAdmin/createAdmin',
  deleteAdmin: '/superAdmin/deleteAdmin',
  editAdmin: '/superAdmin/updateAdminAccess',
  predefinedUrls: '/catalog/getPresignedUrlsForCatalogImageUploads',

  // Order URLS
  getOrderByStatus: '/orders/orderList',
  getSingleOrderById: '/orders/order?orderId=',
};
