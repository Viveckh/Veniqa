import User from '../database/models/user';
import Product from '../database/models/product';
import ObjectId from 'mongodb';
import * as _ from 'lodash';

export default {
    async addToCart(userObj, cartEntriesToProcess) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            if (user) {
                // if the user doesn't have a cart set up yet, initialize it
                if (!user.cart) {
                    user.cart = {
                        items: [],
                        totalPrice: {
                            amount: 0,
                            currency: 'USD'
                        }
                    }
                };

                // Now iterate through the items in the cartEntriesToProcess
                for (let entry of cartEntriesToProcess) {
                    let product = await Product.findOne({_id: entry.product_id}).exec()
                    
                    // Make sure the product exists, if not proceed further
                    if (product) {
                        // Check to see if the product and choice combos already exists in user's cart
                        let index = _.findIndex(user.cart.items, {
                            product_id: entry.product_id,
                            color: entry.color,
                            size: entry.size
                        });

                        if (index > -1) {
                            // If the item already exists, just increment the count
                            // If a value is supplied for count, it will be added. otherwise, 1 will be added.
                            user.cart.items[index].counts += entry.counts ? entry.counts : 1;
                            // Of course need that fresh price calculation
                            user.cart.items[index].aggregatedPrice.amount = user.cart.items[index].counts * product.price.amount;
                            console.log(user);
                        }
                        else {
                            // If the item doesn't exist, add the item to the cart
                            let counts = entry.counts ? entry.counts : 1
                            user.cart.items.push({
                                product_id: entry.product_id,
                                counts: counts,
                                aggregatedPrice: product.price, // this is wrong but it gets recalculated in getCart at the end anyway
                                color: entry.color,
                                size: entry.size,
                            })
                        }

                        // Save all changes and return the updated cart
                        user = await user.save();
                        console.log(user);
                        if (user) {
                            // This means the addToCart was successful, so return the cart details saving extra api calls from front end
                            let updatedCart = await this.getCart(userObj);
                            return updatedCart;
                        }
                    }
                    else {
                        return {status: 'failed', errorDetails: 'The product with product id ' + entry.product_id + ' does not exist in the catalog anymore'};
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

    async getCart(userObj) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and return their cart
            if (user) {
                // if the user doesn't have a cart set up yet, initialize it
                if (!user.cart) {
                    user.cart = {
                        items: [],
                        totalPrice: {
                            amount: 0,
                            currency: 'USD'
                        }
                    }
                };

                // This is where info to be returned will be collected
                let enrichedCart = {
                    items: [],
                    totalPrice: {
                        amount: 0,
                        currency: 'USD'
                    }
                };

                // Resetting the calculated price to zero for a fresh calculation within the loop
                user.cart.totalPrice.amount = 0;

                for (let [index, item] of user.cart.items.entries()) {
                    let product = await Product.findOne({_id: item.product_id}, '_id name brand store price thumbnailUrls').exec();

                    // If the product exists in catalog, only then return it
                    if (product) {
                        // Recalculate the price
                        item.aggregatedPrice.amount = item.counts * product.price.amount;
                        user.cart.totalPrice.amount += item.aggregatedPrice.amount;

                        // Push the item to enrichedCart's array
                        enrichedCart.items.push({
                            product: product,
                            additionalDetails: item
                        })
                    }
                    else {
                        // If the product wasn't found in catalog, remove it from the user's cart automatically
                        user.cart.items.splice(index, 1)
                    }
                }
                // Save the new price calculation in mongo
                user = await user.save();
                
                // Put the new totalPrice in enrichedCart's totalPrice
                enrichedCart.totalPrice = user.cart.totalPrice;

                if (user) {
                    // Return the cart with the newly calculated price
                    return enrichedCart;
                }
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
                    // Validate that the cart item matches by doing a match using the _id and product_id
                    let index = _.findIndex(user.cart.items, (obj) => {
                        return obj._id.toString() == item._id && obj.product_id == item.product_id;
                    });
                    // Update the values if the item is found, otherwise, silently ignore it
                    if (index > -1) {
                        user.cart.items[index] = item;
                    }
                }

                user = await user.save();
                console.log(user);
                if (user) {
                    // This means the updateCart was successful, so return the cart details saving extra api calls from front end.
                    // Essential for price recalculation
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
    }
}