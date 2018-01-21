This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This is digital-generation assignment to mark stores on google maps. On clicking a store that store is marked as favorite  store. This can be removed from favorite stores, by clicking it again.

For Demo purpose, stores have been removed from store_directory.json, but any number of stores can be added to json store file.

Since unpaid API key for google maps comes with a limit, the stores are drawn one after another done by promisifying the geocoding API call.
Since, the assignment clearly stated "not to use any third party package", the google maps javascript API has been integrated directly into react without using any npm package.

a demo can be seen at [freesiteandapps.com](http://freesiteandapps.com)
