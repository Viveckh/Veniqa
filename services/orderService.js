import User from '../database/models/user';
import Checkout from '../database/models/checkout';
import CurrencyExchangeModel from '../database/models/exchangeRate';
import Order from '../database/models/order';
import cryptoGen from '../authentication/cryptoGen';
import shoppingService from '../services/shoppingService';
import * as _ from 'lodash';
import emailService from './emailServiceSendgrid';
import stripe from '../payments/stripe';
import khalti from '../payments/khalti';
import transformer from '../utilities/transform-props';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger'

export default {
    async createCheckout(addressId, shippingMethod, userObj) {
        let result = {};
        try {
            // Retrieve the address and shipping preference
            // Ensure this works
            let address = userObj.addresses.id(addressId);
            // TODO: Use proper shipment mapping
            let shippingPreference = shippingMethod;

            // If either of the passed parameters are invalid, return failure
            if (!(address && shippingPreference)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Invalid address id or shipping preference"};
                return result;
            }

            // otherwise, go ahead and find the user
            let user = await User.findOne({email: userObj.email}).exec();

            // If the user is not found, its most likely they are not authenticated and don't have user info under session
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }

            // Get the freshly calculated order cart, and you must also save any updates resulting during calculation since it isn't a locked deal yet
            let orderCart = await this.calculateFinalPrice(userObj, address, true);

            // Drop any previous checkouts that are still in the checkout collection for the user
            await Checkout.find({user_email: userObj.email}).remove().exec();

            // Find and calculate local currency depending on shipping location
            let currency, exchange_rate;
            if (address.country == 'Bangladesh') {
                currency = 'BDT';
            }
            else if (address.country == 'Nepal') {
                currency = 'NPR';
            }
            else {
                currency = 'USD';
            }
            exchange_rate = await CurrencyExchangeModel.findOne({currency: currency}, '-_id currency one_usd_equals').exec();
                
            // Create the checkout object
            let checkout = new Checkout({
                overall_status: 'RECEIVED',
                cart: orderCart,
                user_email: userObj.email,
                mailing_address: address,
                payment_info: [{
                    source: 'NONE',
                    type: 'PENDING',
                    payment_id: '0',
                    transaction_id: '0',
                    amount_in_usd: orderCart.totalPrice,
                    exchange_rate: exchange_rate, 
                    amount_in_payment_currency: {
                        amount: Math.round(orderCart.totalPrice.amount * exchange_rate.one_usd_equals * 100) / 100,
                        currency: currency
                    }
                }],
                auditLog: {
                    createdBy: {
                        email: userObj.email,
                        name: 'CUSTOMER'
                    },
                    updatedBy: {
                        email: userObj.email,
                        name: 'CUSTOMER'
                    },
                    createdOn: new Date(),
                    updatedOn: new Date()
                }
            });

            // Saving the created checkout
            checkout = await checkout.save();
            result = checkout ? {httpStatus: httpStatus.OK, status: "successful", responseData: checkout} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in createCheckout Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async createPaymentToken(checkoutId, paymentSource, userObj) {
        let result = {};
        try {
            // Make sure at least the required params are passed
            if (!(checkoutId && paymentSource)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing checkout id or payment source"};
                return result;
            }

            // Find the checkout
            let checkout = await Checkout.findOne({'_id': checkoutId, user_email: userObj.email}).exec();
            if (!checkout) {
                result = {httpStatus: httpStatus.NOT_ACCEPTABLE, status: "failed", errorDetails: "Either the requested checkout record does not exist or it does not belong to you"};
                return result;
            }

            // If a payment token seems to have already been generated, then return the existing one
            if (checkout.payment_info.length > 0) {
                result = {
                    httpStatus: httpStatus.OK, 
                    status: "successful", 
                    responseData: {
                        checkout_id: checkout._id,
                        payment_info: checkout.payment_info
                    }
                };
                return result;
            }

            // Ensure what is in the checkout record is up to date by doing a fresh calculation
            let freshCalculatedCart = await this.calculateFinalPrice(userObj, checkout.mailing_address, false);
            let orderCartFromSavedCheckout = checkout.cart;
            // Converting the mongoose object to a regular json object for comparision purposes
            orderCartFromSavedCheckout = orderCartFromSavedCheckout.toObject({flattenMaps: true});
            transformer.castValuesToString(orderCartFromSavedCheckout, ["_id", "tariff", "category"])

            /*
            console.log("fresh order cart", JSON.stringify(freshCalculatedCart));
            console.log("------------------------------------")
            console.log("saved order cart", JSON.stringify(orderCartFromSavedCheckout));
            console.log("------------------------------------")
            console.log("checking if checkout cart ids got modified", checkout.cart);
            */

            // If what is in checkout record does not match what was freshly calculated, return a failure msg
            if (!_.isEqual(freshCalculatedCart, orderCartFromSavedCheckout)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "something crucial about one of the items in the cart has changed. try again"};
                return result;
            }

            // Add the payment info, right now a random token in generated, but that has to be adjusted based on paymentSource
            if (paymentSource == 'BKASH') {
                let currency = 'BDT';
                let exchange_rate = await CurrencyExchangeModel.findOne({currency: currency}, '-_id currency one_usd_equals').exec();
                
                checkout.payment_info.push({
                    source: 'BKASH',
                    type: 'AUTHORIZATION',
                    payment_id: await cryptoGen.generateRandomToken(),
                    transaction_id: '0',
                    amount_in_usd: checkout.cart.totalPrice,
                    exchange_rate: exchange_rate, 
                    amount_in_payment_currency: {
                        amount: Math.round(checkout.cart.totalPrice.amount * exchange_rate.one_usd_equals * 100) / 100,
                        currency: currency
                    }
                })
            }
            else {
                // If none of the payment sources match, this was a bad request
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Invalid payment source"};
                return result;
            }

            // Updating logs, only update date, cause the modifier will/must be the same as the user who created this checkout record
            checkout.auditLog.updatedOn = new Date();

            // If we got this far, go ahead and save the payment info in checkout and return the payment token
            checkout = await checkout.save();
            if (!checkout) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

            result = {
                httpStatus: httpStatus.OK, 
                status: "successful", 
                responseData: {
                    checkout_id: checkout._id,
                    payment_info: checkout.payment_info
                }
            };
            return result;
        }
        catch(err) {
            logger.error("Error in createPaymentToken Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async completeCheckoutUsingCard(checkoutId, paymentToken, userObj) {
        let result = {};
        try {
            // Make sure at least the required params are passed
            if (!(checkoutId && paymentToken)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing checkout id or payment token"};
                return result;
            }

            // Find the checkout
            let checkout = await Checkout.findOne({'_id': checkoutId, user_email: userObj.email}).exec();
            if (!checkout) {
                result = {httpStatus: httpStatus.NOT_ACCEPTABLE, status: "failed", errorDetails: "Either the requested checkout record does not exist or it does not belong to you"};
                return result;
            }

            // If the checkout valid test does not return true, stop here
            let checkoutValidTest = await this.isCheckoutValid(checkoutId, userObj);
            if (!checkoutValidTest.responseData) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "something crucial about one of the items in the cart has changed. try again"};
                return result;
            }

            // Go ahead and charge the card (just authorize for now)
            // Will throw an error directly if the charge fails
            const chargeObj = await stripe.charges.create({
                capture: false,
                amount: Math.round(checkout.cart.totalPrice.amount * 100),
                currency: 'usd',
                source: paymentToken,
                metadata: {
                    user_email: userObj.email
                },
                description: "Veniqa Order " + checkoutId.substr(checkoutId.length - 6), // Last six chars of id
                statement_descriptor: "Veniqa Order " + checkoutId.substr(checkoutId.length - 6)
            });


            // Converting the mongoose object to a regular json object
            let checkoutObj = checkout.toObject({flattenMaps: true});
            transformer.castValuesToString(checkoutObj, ["_id", "tariff", "category"])

            // Move the checkout object succesfully to the order collection with a RECEIVED status
            let order = new Order(checkoutObj);
            order.overall_status = "RECEIVED";
            order.payment_info = [];
            order.payment_info.push({
                source: 'STRIPE',
                type: 'AUTHORIZATION',
                payment_id: chargeObj.id,
                transaction_id: chargeObj.balance_transaction,
                amount_in_usd: checkoutObj.cart.totalPrice,
                amount_in_payment_currency: checkoutObj.cart.totalPrice
            });
            order.auditLog.createdOn = new Date();
            order.auditLog.updatedOn = new Date();

            order = await order.save();

            // If order could not be saved at this point, it must be an internal server error
            if (!order) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: "order could not be created"};
                return result;
            }

            // Remove the checkout from the checkout collection
            await Checkout.remove({'_id': checkoutId}).exec()

            // Converting mongoose order object to regular json object to send to email service
            order = order.toObject({flattenMaps: true});
            transformer.castValuesToString(order, ["_id", "tariff", "category"]);
            emailService.emailOrderReceived(order)

            result = {
                httpStatus: httpStatus.OK,
                status: "successful", 
                responseData: {
                    order_id: order._id
                }
            };
            return result;

        }
        catch(err) {
            logger.error("Error in completeCheckoutUsingCard Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async completeCheckoutUsingKhalti(checkoutId, paymentToken, userObj) {
        let result = {};
        try {
            // Make sure at least the required params are passed
            if (!(checkoutId && paymentToken)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing checkout id or payment token"};
                return result;
            }

            // Find the checkout
            let checkout = await Checkout.findOne({'_id': checkoutId, user_email: userObj.email}).exec();
            if (!checkout) {
                result = {httpStatus: httpStatus.NOT_ACCEPTABLE, status: "failed", errorDetails: "Either the requested checkout record does not exist or it does not belong to you"};
                return result;
            }

            // Return error if the shipping address is not Nepal and payment currency is not NPR
            if (checkout.payment_info[0].amount_in_payment_currency.currency != "NPR" || checkout.mailing_address.country != 'Nepal') {
                result = {httpStatus: httpStatus.NOT_ACCEPTABLE, status: "failed", errorDetails: "Khalti can only be used as a payment method for Nepal"};
                return result;
            }

            // If the checkout valid test does not return true, stop here
            let checkoutValidTest = await this.isCheckoutValid(checkoutId, userObj);
            if (!checkoutValidTest.responseData) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "something crucial about one of the items in the cart has changed. try again"};
                return result;
            }
            
            // Go ahead and charge the card (just authorize for now)
            // Will throw an error directly if the charge fails
            const chargeObj = await khalti.verifyTransaction(paymentToken, Math.round(checkout.payment_info[0].amount_in_payment_currency.amount * 100));

            // Converting the mongoose object to a regular json object
            let checkoutObj = checkout.toObject({flattenMaps: true});
            transformer.castValuesToString(checkoutObj, ["_id", "tariff", "category"])

            // Move the checkout object succesfully to the order collection with a RECEIVED status
            let order = new Order(checkoutObj);
            order.overall_status = "RECEIVED";
            order.payment_info[0].source = 'KHALTI';
            order.payment_info[0].type = 'SALE';
            order.payment_info[0].payment_id = chargeObj.idx;
            order.payment_info[0].transaction_id = chargeObj.idx;
            
            order.auditLog.createdOn = new Date();
            order.auditLog.updatedOn = new Date();

            order = await order.save();

            // If order could not be saved at this point, it must be an internal server error
            if (!order) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: "order could not be created"};
                return result;
            }

            // Remove the checkout from the checkout collection
            await Checkout.remove({'_id': checkoutId}).exec()

            // Converting mongoose order object to regular json object to send to email service
            order = order.toObject({flattenMaps: true});
            transformer.castValuesToString(order, ["_id", "tariff", "category"]);
            emailService.emailOrderReceived(order)

            result = {
                httpStatus: httpStatus.OK,
                status: "successful", 
                responseData: {
                    order_id: order._id
                }
            };
            return result;

        }
        catch(err) {
            logger.error("Error in completeCheckoutUsingKhalti Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async isCheckoutValid(checkoutId, userObj) {
        let result = {};
        try {
            // Make sure at least the required params are passed
            if (!checkoutId) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing checkout id"};
                return result;
            }

            // Find the checkout
            let checkout = await Checkout.findOne({'_id': checkoutId, user_email: userObj.email}).exec();
            if (!checkout) {
                result = {httpStatus: httpStatus.NOT_ACCEPTABLE, status: "failed", errorDetails: "Either the requested checkout record does not exist or it does not belong to you"};
                return result;
            }

            // Ensure what is in the checkout record is up to date by doing a fresh calculation
            let freshCalculatedCart = await this.calculateFinalPrice(userObj, checkout.mailing_address, false);
            let orderCartFromSavedCheckout = checkout.cart;
            // Converting the mongoose object to a regular json object for comparision purposes
            orderCartFromSavedCheckout = orderCartFromSavedCheckout.toObject({flattenMaps: true});
            transformer.castValuesToString(orderCartFromSavedCheckout, ["_id", "tariff", "category"])

            /*
            console.log("fresh order cart", JSON.stringify(freshCalculatedCart));
            console.log("------------------------------------")
            console.log("saved order cart", JSON.stringify(orderCartFromSavedCheckout));
            console.log("------------------------------------")
            console.log("checking if checkout cart ids got modified", checkout.cart);
            */

            // If what is in checkout record does not match what was freshly calculated, return a failure msg
            if (!_.isEqual(freshCalculatedCart, orderCartFromSavedCheckout)) {
                result = { httpStatus: httpStatus.OK, status: "successful", responseData: false };
                return result;
            }

            // If we have gotten this far, return true
            result = { httpStatus: httpStatus.OK, status: "successful", responseData: true };
            return result;
        }
        catch(err) {
            logger.error("Error in isCheckoutValid Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async completeCheckout(paymentSource, paymentId){
        let result = {};
        try {
            let checkout = await Checkout.findOne({'payment_info.source': paymentSource, 'payment_info.payment_id': paymentId}).exec();

            // If the checkout entry is not found, return the failure response
            if (!checkout) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Converting the mongoose object to a regular json object
            let checkoutObj = checkout.toObject({flattenMaps: true});
            transformer.castValuesToString(checkoutObj, "_id")

            // Move the checkout object succesfully to the order collection with a RECEIVED status
            let order = new Order(checkoutObj);
            order.overall_status = "RECEIVED";
            order.auditLog.createdOn = new Date();
            order.auditLog.updatedOn = new Date();

            order = await order.save();

            // If order could not be saved at this point, it must be an internal server error
            if (!order) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: "order could not be saved"};
                return result;
            }

            // Remove the checkout from the checkout collection
            await Checkout.remove({'payment_info.payment_id': paymentId}).exec()

            // Converting mongoose order object to regular json object to send to email service
            order = order.toObject({flattenMaps: true});
            transformer.castValuesToString(order, "_id");
            emailService.emailOrderReceived(order)

            result = {
                httpStatus: httpStatus.OK,
                status: "successful", 
                responseData: {
                    order_id: order._id
                }
            };
            return result;
        }
        catch(err) {
            logger.error("Error in completeCheckout Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async calculateFinalPrice(userObj, shippingAddress, save=false) {
        try {
            // Make the getCart call in ShoppingService first
            let response = await shoppingService.getCart(userObj, true, save);
            if (!(response && response.status == "successful")) {
                throw "Could not retrieve cart"
            }
            
            // Take the shopping cart and add other information for it to be an order cart.
            let shoppingCart = response.responseData;
            // Converting the mongoose object to normal json
            shoppingCart = shoppingCart.toObject({flattenMaps: true});
            transformer.castValuesToString(shoppingCart, "_id")

            let tariffPriceInUSD = 0;
            // Calculating tariff
            for (const [index, item] of shoppingCart.items.entries()) {
                // TODO: Select proper country while calculating tariff
                let tariffRate = item.product.tariff.rates[shippingAddress.country] / 100; // This is freshly populated from the get cart above, so tariff will always be up to date value
                tariffPriceInUSD += Math.round(tariffRate * item.aggregatedPrice.amount * 100) / 100;
                // To reset the tariff and category back to only its id, because that's how it is saved in checkout and order table
                shoppingCart.items[index].product.tariff = item.product.tariff._id;  
                shoppingCart.items[index].product.category = item.product.category._id;
            }

            // Calculating shipping price
            let shippingPriceInUSD = await this.calculateShippingPrice(shoppingCart.totalWeight.quantity)

            // Add other necessary key-values about pricing details necessary for it to be a qualified order cart
            let serviceChargeInUSD = Math.round(0.05 * shoppingCart.subTotalPrice.amount * 100) / 100; // 5% service charge on subtotalprice
            let totalPriceInUSD = Math.round((shoppingCart.subTotalPrice.amount + tariffPriceInUSD + serviceChargeInUSD + shippingPriceInUSD) * 100) / 100;

            shoppingCart['serviceCharge'] = {amount: serviceChargeInUSD, currency: 'USD'}; 
            shoppingCart['shippingPrice'] = {amount: shippingPriceInUSD, currency: 'USD'};  
            shoppingCart['tariffPrice'] = {amount: tariffPriceInUSD, currency: 'USD'};
            shoppingCart['totalPrice'] = {amount: totalPriceInUSD, currency: 'USD'};
            
            return shoppingCart;
        }  
        catch(err) {
            throw err;
        }  
    },

    async calculateShippingPrice(country, shippingMethod, weight) {
        let number_of_ten_pound_volumes = weight / 10;
        let single_digit_volume = weight % 10;
        return 15;
    }
}