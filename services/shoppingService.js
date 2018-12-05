import User from '../database/models/user';

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
                    product_origin: productDetails.product_origin,
                    counts: productDetails.counts
                })

                user = await user.save();
                console.log(user);
                if (user) {
                    return true;
                }
            }
            return false;

        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}