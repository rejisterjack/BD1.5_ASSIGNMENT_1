const express = require('express')
const { resolve } = require('path')
const cors = require('cors')

const app = express()
const port = 3000

app.use(express.static('static'))
app.use(cors())

const TAX_RATE = 0.05
const LOYALTY_POINTS_MULTIPLIER = 2

const calculateCartTotal = (newItemPrice, cartTotal) =>
  (newItemPrice + cartTotal).toFixed(2)

const applyMembershipDiscount = (cartTotal, isMember) => {
  const discount = isMember === 'true' ? cartTotal * 0.1 : 0
  return (cartTotal - discount).toFixed(2)
}

const calculateTax = (cartTotal) => (cartTotal * TAX_RATE).toFixed(2)

const estimateDeliveryTime = (shippingMethod, distance) => {
  const divisor = shippingMethod.toLowerCase() === 'express' ? 100 : 50
  return Math.ceil(distance / divisor)
}

const calculateShippingCost = (weight, distance) =>
  (weight * distance * 0.1).toFixed(2)

const calculateLoyaltyPoints = (purchaseAmount) =>
  purchaseAmount * LOYALTY_POINTS_MULTIPLIER

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'))
})

app.get('/cart-total', (req, res) => {
  const { newItemPrice, cartTotal } = req.query
  const total = calculateCartTotal(
    parseFloat(newItemPrice),
    parseFloat(cartTotal)
  )
  res.send(total)
})

app.get('/membership-discount', (req, res) => {
  const { cartTotal, isMember } = req.query
  const finalPrice = applyMembershipDiscount(parseFloat(cartTotal), isMember)
  res.send(finalPrice)
})

app.get('/calculate-tax', (req, res) => {
  const { cartTotal } = req.query
  const tax = calculateTax(parseFloat(cartTotal))
  res.send(tax)
})

app.get('/estimate-delivery', (req, res) => {
  const { shippingMethod, distance } = req.query
  const deliveryDays = estimateDeliveryTime(
    shippingMethod,
    parseFloat(distance)
  )
  res.send(deliveryDays.toString())
})

app.get('/shipping-cost', (req, res) => {
  const { weight, distance } = req.query
  const shippingCost = calculateShippingCost(
    parseFloat(weight),
    parseFloat(distance)
  )
  res.send(shippingCost)
})

app.get('/loyalty-points', (req, res) => {
  const { purchaseAmount } = req.query
  const points = calculateLoyaltyPoints(parseFloat(purchaseAmount))
  res.send(points.toString())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
