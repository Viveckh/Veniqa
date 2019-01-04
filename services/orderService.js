import User from '../database/models/user';
import Checkout from '../database/models/checkout';
import CurrencyExchangeModel from '../database/models/exchangeRate';
import Order from '../database/models/order';
import cryptoGen from '../authentication/cryptoGen';
import shoppingService from '../services/shoppingService';
import * as _ from 'lodash';
import transformer from '../utilities/transform-props';

export default {
    async initiateCheckout(userObj, shoppingCartObj, addressId, paymentSource) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();
            
            if (user) {
                let freshShoppingCart = await shoppingService.getCart(userObj);
                // Converting the mongoose object to a regular json object for comparision purposes
                freshShoppingCart = freshShoppingCart.toObject();
                transformer.castValuesToString(freshShoppingCart, "_id")
                /*
                console.log("------------------------------------")
                console.log(freshShoppingCart)
                console.log("------------------------------------")
                console.log(shoppingCartObj);
                console.log("------------------------------------")
                */
                if (!_.isEqual(freshShoppingCart, shoppingCartObj)) {
                    result = {status: "failed", errorDetails: "something crucial about one of the items in the cart has changed. try again."};
                    return result;
                }
                // If nothing seems to have changed from what was shown to the user and what was newly calculated, go ahead.

                // Drop any previous checkouts that are still in the temporary buffer collection for the user
                await Checkout.find({user_email: userObj.email}).remove().exec();

                // Create the checkout object
                let checkout = new Checkout({
                    overall_status: 'PENDING',
                    cart: await shoppingService.getCart(userObj, true), // This has to be changed when orderCart and shoppingCart are different.
                    user_email: userObj.email,
                    mailing_address: userObj.addresses.id(addressId),
                    payment_info: [],
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

                // Add the payment info, right now a random token in generated, but that has to be adjusted based on paymentSource
                if (paymentSource == 'BKASH') {
                    let currency = 'BDT';
                    let exchange_rate = await CurrencyExchangeModel.findOne({currency: currency}, '-_id currency one_usd_equals').exec();
                    
                    checkout.payment_info.push({
                        source: 'BKASH',
                        payment_id: await cryptoGen.generateRandomToken(),
                        transaction_id: '000',
                        amount_in_usd: checkout.cart.totalPrice,
                        exchange_rate: exchange_rate, 
                        amount_in_payment_currency: {
                            amount: Math.round(checkout.cart.totalPrice.amount * exchange_rate.one_usd_equals * 100) / 100,
                            currency: currency
                        }
                    })
                }

                checkout = await checkout.save();
                if (checkout) {
                    result = {
                        status: "successful", 
                        responseData: {
                            checkout_id: checkout._id,
                            payment_info: checkout.payment_info
                        }
                    };
                }
                else {
                    result = {status: "failed", errorDetails: "checkout could not be initiated due to missing info"};
                }
            }
            else {
                result = {status: "failed", errorDetails: "user not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async completeCheckout(userObj, paymentId){
        let result = {};
        try {
            let checkout = await Checkout.findOne({'payment_info.payment_id': paymentId}).exec();

            if (checkout) {
                // Converting the mongoose object to a regular json object
                let checkoutObj = checkout.toObject();
                transformer.castValuesToString(checkoutObj, "_id")
                let order = new Order(checkoutObj);
                order.auditLog.createdOn = new Date();
                order.auditLog.updatedOn = new Date();

                order = await order.save();
                if (order) {
                    await Checkout.remove({'payment_info.payment_id': paymentId}).exec()
                    result = {
                        status: "successful", 
                        responseData: null
                    };
                }
                else {
                    result = {status: "failed", errorDetails: "order could not be saved"};
                }
            }
            else {
                result = {status: "failed", errorDetails: "checkout entry not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    }
}