if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// console.log(stripeSecretKey, stripePublicKey);

const express = require("express");
const app = express();
const fs = require('fs');

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

app.listen(3000);
