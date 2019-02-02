import Stripe from 'stripe';
import stripeConfig from '../properties/stripe.json';

const stripe = Stripe(stripeConfig.test_secret_key)

module.exports = stripe;