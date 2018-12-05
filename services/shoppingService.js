import User from '../database/models/user';
import Product from '../database/models/product';

export default {
    async addToCart(userObj, productDetails) {
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and productDetails 
            if (user && productDetails) {
                // Intialize cart if it doesn't exist
                if (!user.cart) {
                    user.cart = [];
                }

                // Add the item to the cart
                user.cart.push({
                    product_id: productDetails.product_id,
                    counts: productDetails.counts
                })

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
                    enrichedCart.push({
                        product: product,
                        counts: item.counts
                    })
                }
                return enrichedCart;
            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}