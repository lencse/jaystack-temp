let express = require('express')

let app = express()
app.use('/component/json/cookiePolicyBannerEU', (req, res) => {
    res.json({ "id": "cookiePolicyBannerEU", "name": "Cookie Policy Banner", "data": { "content": "To provide the best possible shopping experience, our site uses cookies to store information. By continuing to browse you are accepting our <a class=\"cb-policy\" href=\"cookies-policy\" style=\"text-decoration: underline\">Cookie Policy</a>." } })
})
app.use('/ajax/headerdata', (req, res) => {
    res.json({ "lastName": "", "shippingCountryName": "Hungary", "email": "", "countryHasDefaultIndicativeCurrency": false, "ng": "", "guest": true, "cg": "", "firstName": "", "indicativeCurrencySymbol": "", "billingCurrencyCode": "EUR", "customerDisplayName": "", "shoppingCartCount": 0 })
})
app.use('/', express.static('.'))
app.listen(1223)
