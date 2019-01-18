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
  confirmOrder: '/orders/confirmOrder',
  fulfillOrder: '/orders/markItemAsFulfilling',
  editFulfillOrder: '/orders/updateOrderFulfillmentDetails',
  markShipped: '/orders/markItemAsShipped',
  editShipped: '/orders/updateShipmentDetails',
  markDelivered: '/orders/markItemAsDelivered',
  editDelivered: '/orders/updateDeliveryDetails',
  cancelOrder: '/orders/cancelOrder',

  // Tariff URLs
  allTariffs: '/referenceData/tariffList',
  editTariff: '/referenceData/tariff',
  addTariff: '/referenceData/tariff',

  // Comments
  postComment: '/orders/addComment',
  deleteComment: '/orders/deleteComment',
  putComment: '/orders/editComment',

};
