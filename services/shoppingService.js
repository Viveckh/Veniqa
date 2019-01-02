import mongoose from 'mongoose';
import User from '../database/models/user';
import Product from '../database/models/product';
import * as _ from 'lodash';

// IMPORTANT: All the financial recalculations take place in getCart, and also some in addToCart if you are adding a new item

export default {
    async addToCart(userObj, cartEntriesToProcess) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            if (user) {
                // if the user doesn't have a cart set up yet, initialize it
                if (!user.cart) {
                    user.cart = this.returnFreshInitializedCart();
                };

                // Now iterate through the items in the cartEntriesToProcess
                for (let entry of cartEntriesToProcess) {
                    let product = await Product.findOne({_id: entry.product}).exec()
                    
                    // Make sure the product exists, if not proceed further
                    if (product) {
                        // Check to see if the product and choice combos already exists in user's cart
                        let index = _.findIndex(user.cart.items, {
                            product: mongoose.Types.ObjectId(entry.product),
                            color: entry.color,
                            size: entry.size
                        });

                        if (index > -1) {
                            // If the item already exists, just increment the count
                            // If a value is supplied for count, it will be added. otherwise, 1 will be added.
                            user.cart.items[index].counts += entry.counts ? entry.counts : 1;
                            // Of course need that fresh calculation of various fields at order level
                            user.cart.items[index].aggregatedWeight.quantity = Math.round(user.cart.items[index].counts * product.weight.quantity * 100) / 100;
                            user.cart.items[index].aggregatedPrice.amount = Math.round(user.cart.items[index].counts * product.price.amount * 100) / 100;
                        }
                        else {
                            // If the item doesn't exist, add the item to the cart
                            let counts = entry.counts ? entry.counts : 1

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
                                color: entry.color,
                                size: entry.size,
                            })
                        }

                        // Save all changes and return the updated cart
                        user = await user.save();
                        
                        if (user) {
                            // This means the addToCart was successful, so return the cart details saving extra api calls from front end
                            let updatedCart = await this.getCart(userObj);
                            return updatedCart;
                        }
                    }
                    else {
                        return {status: 'failed', errorDetails: 'The product with product id ' + entry.product + ' does not exist in the catalog anymore'};
                    }
                }
            }
            return false;

        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getCart(userObj, returnAllProductProps=false) {
        try {
            let user;
            // find the user first and populate while searching
            if (returnAllProductProps) {
                user = await User.findOne({email: userObj.email}).populate('cart.items.product').exec();
            }
            else {
                user = await User.findOne({email: userObj.email}).populate('cart.items.product', '_id name brand store weight price thumbnailUrls').exec();
            }

            // Make sure the user exists and return their cart
            if (user) {
                // if the user doesn't have a cart set up yet, initialize it
                if (!user.cart) {
                    user.cart = this.returnFreshInitializedCart();
                    return user.cart;
                };

                // Call the recalculate cart function 
                user.cart = this.recalculatePopulatedCart(user.cart);

                // Return the populated cart
                if (user.cart) {
                    // Save with recalculated cart, and interestingly it seems to unpopulate the additional sections added during populate function above automatically
                    user = await user.save()

                    if (user.cart) {
                        // Return calculated cart
                        return user.cart;
                    }
                    return false;
                }
                return false;

            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async updateCart(userObj, cartItems) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and proceed to update
            if (user) {
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

                user = await user.save();
                
                if (user) {
                    // This means the updateCart was successful, so return the cart details saving extra api calls from front end.
                    // Essential for calculation of price and various other fields, 
                    // Also, recalculates and saves us from any potential front end attempts of updating aggregatedPrice or aggregatedWeight fields
                    let updatedCart = await this.getCart(userObj);
                    return updatedCart;
                }
            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async deleteFromCart(userObj, arrayOfCartItemIds) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and delete the given products
            if (user) {
                // Remove the items from cart for which the ids exists in the arrayOfCartItemIds requested for removal
                for(let cartItemId of arrayOfCartItemIds) {
                    user = await User.findOneAndUpdate({'cart.items._id': cartItemId},
                        {$pull: { 'cart.items': { _id: cartItemId}}},
                        {new: true}
                        ).exec()
                }

                // This means the deleteFromCart was successful if there were any elements worth removing, so return the cart details saving extra api calls from front end
                let updatedCart = await this.getCart(userObj);
                return updatedCart;
            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    returnFreshInitializedCart() {
        let cart = {
            items: [],
            totalWeight: {quantity: 0, unit: 'LB' },
            subTotalPrice: { amount: 0, currency: 'USD' },
            serviceCharge: { amount: 0, currency: 'USD' },
            shippingPrice: { amount: 0, currency: 'USD' },
            tariffPrice: { amount: 0, currency: 'USD' },
            totalPrice: { amount: 0, currency: 'USD' }
        }
        return cart;
    },

    recalculatePopulatedCart(cart) {
        try {
            // Resetting the calculated price to zero for a fresh calculation within the loop
            cart.totalWeight.quantity = 0;
            cart.subTotalPrice.amount = 0;
            cart.serviceCharge.amount = 0; // Calculated based on a percentage below
            cart.shippingPrice.amount = 0; // Default price for now
            cart.tariffPrice.amount = 0; // Default price for now
            cart.totalPrice.amount = 0;

            let indexesToRemove = [];

            for (let [index, item] of cart.items.entries()) {
                let product = item.product;

                // If the product is populated, only then move further
                if (product._id) {
                    // Recalculate things at the cart item level
                    item.aggregatedWeight.quantity = Math.round(item.counts * product.weight.quantity * 100) / 100;
                    item.aggregatedPrice.amount = Math.round(item.counts * product.price.amount * 100) / 100;

                    // Add calculated values to the cart overall level, few of them are deferred for calculation after the loop
                    cart.totalWeight.quantity += Math.round(item.aggregatedWeight.quantity * 100) / 100;
                    cart.subTotalPrice.amount += Math.round(item.aggregatedPrice.amount * 100) / 100;
                    cart.tariffPrice.amount += Math.round(0.05 * item.aggregatedPrice.amount * 100) / 100; // 5% tariff by default on all items
                }
                else {
                    // If the product wasn't found in catalog, we'll have to remove it once this loop is complete
                    indexesToRemove.push(index);
                }
            }

            // Remove any items that could not be populated (meaning no match was found in Product Model)
            for (let index of indexesToRemove) {
                cart.items.splice(index, 1);
            }

            // Calculate a few other things at the cart general level
            cart.serviceCharge.amount = Math.round(0.03 * cart.subTotalPrice.amount * 100) / 100; // 3% service charge on subtotalprice
            cart.shippingPrice.amount = Math.round(15 * cart.totalWeight.quantity * 100) / 100; //$15 per pound on total weight
            cart.totalPrice.amount = Math.round((cart.subTotalPrice.amount + cart.tariffPrice.amount + cart.serviceCharge.amount + cart.shippingPrice.amount) * 100) / 100;

            // Return the cart
            return cart;
        }
        catch(err) {
            throw err;
        }
    }
}