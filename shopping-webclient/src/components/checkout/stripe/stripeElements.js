export const Stripe = {
  instance: null,
  createToken: null,
  createSource: null,
  retrieveSource: null,
  elements: null,
  paymentRequest: null,
  redirectToCheckout: null,
  retrievePaymentIntent: null,
  handleCardPayment: null,
  handleCardSetup: null,
  handleCardAction: null,
  confirmPaymentIntent: null,
  createPaymentMethod: null,
  confirmCardPayment: null
};

export const baseStyle = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: 'Helvetica Neue',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

function init(key, options = {}) {
  if (typeof key === 'object' && typeof key.elements === 'function') {
    Stripe.instance = key;
  }

  if (window.Stripe === undefined && Stripe.instance === null) {
    console.error('Stripe V3 library not loaded!');
  } else if (Stripe.instance === null) {
    Stripe.instance = window.Stripe(key);
  }

  if (!Stripe.instance.elements) {
    console.error('Stripe V3 library not loaded!');
  } else if (Stripe.elements === null) {
    Stripe.elements = Stripe.instance.elements(options);
  }
}

export function create(elementType, keyOrStripe, options = {}) {
  init(keyOrStripe, options.elements || {});
  options.style = Object.assign(baseStyle, options.style || {});

  const element = Stripe.elements.create(elementType, options);
  console.log(element);

  Stripe.createToken = opts => Stripe.instance.createToken(element, opts);
  Stripe.createSource = opts => Stripe.instance.createSource(element, opts);
  Stripe.retrieveSource = opts => Stripe.instance.retrieveSource(opts);
  Stripe.redirectToCheckout = (options) => Stripe.instance.redirectToCheckout(options)
  Stripe.retrievePaymentIntent = (clientSecret) => Stripe.instance.retrievePaymentIntent(clientSecret)
  Stripe.handleCardPayment = (clientSecret, data) => Stripe.instance.handleCardPayment(clientSecret, element, data)
  Stripe.handleCardSetup = (clientSecret, data) => Stripe.instance.handleCardSetup(clientSecret, element, data)
  Stripe.handleCardAction = (clientSecret) => Stripe.instance.handleCardAction(clientSecret)
  Stripe.confirmPaymentIntent = (clientSecret, data) => Stripe.instance.confirmPaymentIntent(clientSecret, element, data)
  Stripe.createPaymentMethod = (cardType, data) => Stripe.instance.createPaymentMethod(cardType, element, data)
  Stripe.confirmCardPayment = (clientSecret, data) => Stripe.instance.confirmCardPayment(clientSecret, {
    payment_method:{
      card:element,
      billing_details: {}
    }
  }, data)

  return element;
}

export function createPaymentRequest(options) {
  Stripe.paymentRequest = Stripe.instance.paymentRequest(options);

  return Stripe.paymentRequest;
}

export function createPayButton() {
  // Create the Payment Request Button.
  const paymentRequestButton = Stripe.elements.create('paymentRequestButton', {
    paymentRequest: Stripe.paymentRequest,
  });

  return paymentRequestButton;
}

export function getPaymentRequest() {
  return Stripe.paymentRequest;
}

export function destroy() {
  Stripe.instance = null;
  Stripe.elements = null;
  Stripe.createToken = null;
  Stripe.createSource = null;
  Stripe.retrieveSource = null;
  Stripe.redirectToCheckout = null;
  Stripe.retrievePaymentIntent = null;
  Stripe.handleCardPayment = null;
  Stripe.handleCardSetup = null;
  Stripe.handleCardAction = null;
  Stripe.confirmPaymentIntent = null;
  Stripe.createPaymentMethod = null;
  Stripe.confirmCardPayment = null;
}
