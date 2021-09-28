if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// console.log(stripeSecretKey, stripePublicKey);

const express = require("express");
const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey)

app.set("view engine", "ejs");
app.use(express.static("public")); // Static() tells the app to make all the files inside the public folder static so that they can be used for frontend work.

app.get('/store', function (req, res) {
    fs.readFile('items.json', function (err, data) {
        if (err) {
            res.status(500).end();
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
});

app.post('/purchase', function (req, res) {
    fs.readFile('items.json', function (err, data) {
        if (err) {
            res.status(500).end();
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(function (item) {
                const itemJson = itemsArray.find(function (i) {
                    return i.id == item.id
                })
                total = total + itemJson.price * item.quantity
            })
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'inr'
            }).then(function () {
                console.log('Charge successful');
                res.json({ message: 'Successfully purchased items.' })
            }).catch(function () {
                console.log('Charge Fail');
                res.status(500).end()
            })
        }
    })
});

app.listen(3000);
