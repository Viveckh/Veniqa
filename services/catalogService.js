import ProductModel from '../database/models/product';

export default {
    async searchCatalog(searchObj) {
        // Preparing search filters
        let searchFilters = {}
        searchObj.store ? searchFilters.store = searchObj.store : '';
        searchObj.category ? searchFilters.category = searchObj.category : '';
        console.log("Search Filters", searchFilters)

        try {
            let products = await ProductModel.find(searchFilters).exec()
            return products;
        }   
        catch(err) {
            console.log("[ERROR]: Catalog search failed => ", err)
            return err;
        }
    }
}