import mongoose from 'mongoose';
import User from '../database/models/user';
import Product from '../database/models/product';
import httpStatus from 'http-status-codes';
import * as _ from 'lodash';
import logger from '../logging/logger'

export default {
    async addToCart(userObj, cartEntriesToProcess) {
        let result = {};
        try {
            // If there is no items to add, return it right here and do not proceed
            if (!(cartEntriesToProcess && cartEntriesToProcess.length > 0)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "No items to add"};
                return result;
            }

            // find the user
            let user = await User.findOne({email: userObj.email}).exec();

            // If the user is not found, its most likely they are not authenticated and don't have user info under session
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }

            // If the user doesn't have a cart set up yet, initialize it
            if (!user.cart) {
                user.cart = this.returnFreshInitializedCart();
            };

            // Now iterate through the items in the cartEntriesToProcess
            for (let entry of cartEntriesToProcess) {
                let product = await Product.findOne({_id: entry.product, active: true}).exec()
                
                // If the product does not exist, continue adding the next item to the list.
                if (!product) {
                    continue;
                }

                // If a value is supplied for count, use it. otherwise, use 1.
                let counts = entry.counts ? entry.counts : 1

                // Check to see if the product and choice combos already exists in user's cart
                let index = _.findIndex(user.cart.items, (item) => {
                    if (_.isEqual(item.product.toString(), entry.product) && _.isEqual(item.customizations ? item.customizations.toJSON() : item.customizations, entry.customizations)) {
                        return true;
                    }
                    return false;
                });

                if (index > -1) {
                    // If the item already exists, just increment the count
                    user.cart.items[index].counts += counts;
                    // Of course need that fresh calculation of various fields at item level
                    user.cart.items[index].aggregatedWeight.quantity = Math.round(user.cart.items[index].counts * product.weight.quantity * 100) / 100;
                    user.cart.items[index].aggregatedPrice.amount = Math.round(user.cart.items[index].counts * product.price.amount * 100) / 100;
                }
                else {
                    // If the item doesn't exist in cart already, add the item to the cart
                    user.cart.items.push({
                        product: mongoose.Types.ObjectId(entry.product),
                        counts: counts,
                        aggregatedWeight: {
                            quantity: Math.round(product.weight.quantity * counts * 100) / 100,
                            unit: product.weight.unit
                        },
                        aggregatedPrice: {
                            amount: Math.round(product.price.amount * counts * 100) / 100,
                            currency: product.price.currency
                        },
                        customizations: entry.customizations
                    })
                }
            }

            // Save all changes
            user = await user.save();
            
            // If save was not succesful, let em know. Must be cause of a bad request.
            if (!user) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
                return result;
            }
        
            // If we got this far, the call has been succesful, so return the updated cart details saving extra api calls from front end
            let updatedCartResponse = await this.getCart(userObj);
            return updatedCartResponse;
        }
        catch(err) {
            logger.error("Error in addToCart Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getCart(userObj, returnAllProductProps=false, save=true) {
        let result = {};
        try {
            let user;
            // find the user first and populate while searching
            if (returnAllProductProps) {
                user = await User.findOne({email: userObj.email}).populate({path: 'cart.items.product', select: '-__v', populate: [{path: 'category', select: '_id category subcategory'}, {path: 'tariff', select: '_id name rates'}]}).exec();
            }
            else {
                user = await User.findOne({email: userObj.email}).populate('cart.items.product', '_id name brand store weight price thumbnailUrls').exec();
            }

            // If the user is not found, its most likely they are not authenticated and don't have user info under session
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }

            // If the user doesn't have a cart set up yet, initialize it
            if (!user.cart) {
                user.cart = this.returnFreshInitializedCart();
                result = { httpStatus: httpStatus.OK, status: "successful", responseData: user.cart };
                return result;
            };

            // Remove any existing items from cart which were not found in catalog during population
            _.remove(user.cart.items, (item) => {
                // Returns truthy if product does not have a truthy value
                return !item.product;
            })

            // Call the recalculate cart function 
            user.cart = this.recalculatePopulatedCart(user.cart);
            
            // If save is true, save the recalculated cart, and interestingly it seems to unpopulate the additional sections added during populate function above automatically
            if (save) {
                user = await user.save()
            }

            // If saving is unsuccessful, return failure message
            if (!(user && user.cart)) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

            // If we have gotten this far, it was succesful
            result = { httpStatus: httpStatus.OK, status: "successful", responseData: user.cart };
            return result;
        }
        catch(err) {
            logger.error("Error in getCart Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateCart(userObj, cartItems) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // If the user is not found, its most likely they are not authenticated and don't have user info under session
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }
            
            // Find each item in cart for update, and if found, update the values associated with them
            for (let item of cartItems) {
                // Validate that the cart item matches by doing a match using the _id and product id
                let index = _.findIndex(user.cart.items, (obj) => {
                    return obj._id.toString() == item._id && obj.product.toString() == item.product;
                });

                // Update the values if the item is found, otherwise, silently ignore it
                if (index > -1) {
                    user.cart.items[index] = item;
                }
            }

            // Saving the changes
            user = await user.save();
            
            // If save was not succesful, let em know. Must be cause of a bad request.
            if (!user) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
                return result;
            }
        
            // If we got this far, the call has been succesful, so return the updated cart details saving extra api calls from front end
            let updatedCartResponse = await this.getCart(userObj);
            return updatedCartResponse;
        }
        catch(err) {
            logger.error("Error in updateCart Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteFromCart(userObj, arrayOfCartItemIds) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // If the user is not found, its most likely they are not authenticated and don't have user info under session
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }

            // Remove the items from cart for which the ids exists in the arrayOfCartItemIds requested for removal
            for(let cartItemId of arrayOfCartItemIds) {
                user = await User.findOneAndUpdate({'cart.items._id': cartItemId},
                    {$pull: { 'cart.items': { _id: cartItemId}}},
                    {new: true}
                    ).exec()
            }

            // This means the deleteFromCart was successful if there were any elements worth removing, so return the cart details saving extra api calls from front end
            let updatedCartResponse = await this.getCart(userObj);
            return updatedCartResponse;
        }
        catch(err) {
            logger.error("Error in deleteFromCart Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    returnFreshInitializedCart() {
        let cart = {
            items: [],
            totalWeight: {quantity: 0, unit: 'LB' },
            subTotalPrice: { amount: 0, currency: 'USD' }
        }
        return cart;
    },

    recalculatePopulatedCart(cart) {
        try {
            // Resetting the calculated price to zero for a fresh calculation within the loop
            cart.totalWeight.quantity = 0;
            cart.subTotalPrice.amount = 0;

            let indexesToRemove = [];

            for (let [index, item] of cart.items.entries()) {
                let product = item.product;

                // If the product wasn't found in catalog, jump to next iteration of the loop. 
                // Keep track of it to remove later once this loop is complete
                if (!(product && product._id)) {
                    indexesToRemove.push(index);
                    continue;
                }
                // Recalculate things at the cart item level
                item.aggregatedWeight.quantity = Math.round(item.counts * product.weight.quantity * 100) / 100;
                item.aggregatedPrice.amount = Math.round(item.counts * product.price.amount * 100) / 100;

                // Add calculated values to the cart overall level
                cart.totalWeight.quantity += Math.round(item.aggregatedWeight.quantity * 100) / 100;
                cart.subTotalPrice.amount += Math.round(item.aggregatedPrice.amount * 100) / 100;
            }

            // Remove any items that could not be populated (meaning no match was found in Product Model)
            for (let index of indexesToRemove) {
                cart.items.splice(index, 1);
            }

            // Return the cart
            return cart;
        }
        catch(err) {
            throw err;
        }
    }
}