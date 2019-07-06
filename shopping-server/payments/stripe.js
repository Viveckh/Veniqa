import Stripe from 'stripe';

const stripe = Stripe(process.env.VENIQA_STRIPE_API_KEY)

module.exports = stripe;