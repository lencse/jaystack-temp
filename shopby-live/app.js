let express = require('express')
let request = require('request')

let app = express()
app.use('/component/json/cookiePolicyBannerEU', (req, res) => {
    res.json({ "id": "cookiePolicyBannerEU", "name": "Cookie Policy Banner", "data": { "content": "To provide the best possible shopping experience, our site uses cookies to store information. By continuing to browse you are accepting our <a class=\"cb-policy\" href=\"cookies-policy\" style=\"text-decoration: underline\">Cookie Policy</a>." } })
})
app.use('/ajax/headerdata', (req, res) => {
    res.json({ "lastName": "", "shippingCountryName": "Hungary", "email": "", "countryHasDefaultIndicativeCurrency": false, "ng": "", "guest": true, "cg": "", "firstName": "", "indicativeCurrencySymbol": "", "billingCurrencyCode": "EUR", "customerDisplayName": "", "shoppingCartCount": 0 })
})
app.use('/womens/lists/coming-soon-aw16', (req, res) => {
    request('http://www.matchesfashion.com/intl/womens/lists/coming-soon-aw16?format=json&page=1', (err, resp, body) => {
        res.json(JSON.parse(body))
    })
})
app.use('/', express.static('.'))
app.listen(1223)
