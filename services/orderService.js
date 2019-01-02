import User from '../database/models/user';
import Checkout from '../database/models/checkout';
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
                    payment_info: []
                });

                // Add the payment info, right now a random token in generated, but that has to be adjusted based on paymentSource
                checkout.payment_info.push({
                    source: paymentSource,
                    payment_id: await cryptoGen.generateRandomToken(),
                    transaction_id: '000',
                    amount: checkout.cart.totalPrice
                })

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
    }
}