const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

if (process.env.NODE_ENV !== "production") {
  const dotEnv = require("dotenv");
  dotEnv.config({ path: "./.env" });
}
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/payment", (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };

  stripe.charges.create(body, (err, response) => {
    if (err) res.status(500).send({ message: "internal Error" });

    res.status(200).send({ response });
  });
});

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res
      .status(200)
      .sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, (err) => {
  if (err) throw new Error("There is a propblem");

  console.log("Server is Listening ");
});
