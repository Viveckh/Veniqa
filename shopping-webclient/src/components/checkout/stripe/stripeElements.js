export const Stripe = {
  instance: null,
  createToken: null,
  createSource: null,
  retrieveSource: null,
  elements: null,
  paymentRequest: null,
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

  Stripe.createToken = opts => Stripe.instance.createToken(element, opts);
  Stripe.createSource = opts => Stripe.instance.createSource(element, opts);
  Stripe.retrieveSource = opts => Stripe.instance.retrieveSource(opts);

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
}
