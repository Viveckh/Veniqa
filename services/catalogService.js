import ProductModel from '../database/models/product';

export default {
    searchCatalog(searchObj) {
        // Preparing search filters
        let searchFilters = {}
        searchObj.store ? searchFilters.store = searchObj.store : '';
        searchObj.category ? searchFilters.category = searchObj.category : '';
        console.log("Search Filters", searchFilters)

        // Search using the search filters, and return all fields other than id
        return ProductModel.find(searchFilters, '-_id', (err, products) => {
            if (err) {
                console.log("[ERROR]: Catalog search failed => ", err)
                return err;
            }
            return products;
        })
    }
}