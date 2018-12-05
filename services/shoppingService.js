import User from '../database/models/user';
import Product from '../database/models/product';
import * as _ from 'lodash';

export default {
    async addToCart(userObj, productDetails) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();
            let product = await Product.findOne({_id: productDetails.product_id}).exec()

            // Make sure the user and product exist
            if (user && product) {
                // Intialize cart if it doesn't exist
                if (!user.cart) {
                    user.cart = [];
                }

                // Check to see if the product already exists in user's cart
                let index = _.findIndex(user.cart, {product_id: productDetails.product_id})
                if (index > -1) {
                    // If the item already exists, just increment the count by 1
                    user.cart[index].counts++;
                }
                else {
                    // If the item doesn't exist, add the item to the cart
                    user.cart.push({
                        product_id: productDetails.product_id
                    })
                }

                user = await user.save();
                console.log(user);
                if (user) {
                    // This means the addToCart was successful, so return the cart details saving extra api calls from front end
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

    async getCart(userObj) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and return their cart
            if (user) {
                let enrichedCart = [];
                for (let item of user.cart) {
                    let product = await Product.findOne({_id: item.product_id}).exec()
                    // If the product exists in product collections, only then return it
                    if (product) {
                        enrichedCart.push({
                            product: product,
                            counts: item.counts
                        })
                    }
                }
                return enrichedCart;
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
                // Find each item in cart for update, and if found, update the values associated with them (Which right now is only counts)
                for (let item of cartItems) {
                    let index = _.findIndex(user.cart, {product_id: item.product_id});
                    // Update the values if the item is found, otherwise, silently ignore it
                    if (index > -1) {
                        user.cart[index].counts = item.counts;
                    }
                }

                user = await user.save();
                console.log(user);
                if (user) {
                    // This means the updateCart was successful, so return the cart details saving extra api calls from front end
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

    async deleteFromCart(userObj, arrayOfProductIds) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and delete the given products
            if (user) {
                // Remove the items from cart for which the product_id exists in the arrayOfProductIds requested for removal
                for(let productId of arrayOfProductIds) {
                    user = await User.findOneAndUpdate({'cart.product_id': productId}, 
                        {$pull: { cart: { product_id: productId}}},
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