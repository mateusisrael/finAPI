const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")

app.use(express.json())
const customers = []

// middleware
function verifyIfAccountExist(req, res, next) {
  const { cpf } = req.headers
  const account = customers.find((customer) => customer.cpf == cpf)
 
  // status(204) == no content?
  if(!account) return res.status(400).json({ message: "This account does not exists" })
  req.account = account
  return next()
}

function checkForCustomers(req, res, next) {
  if(customers.length <= 0) return res.status(400).json({ message: "No account created "})
  next()
} 

// Routes
app.post("/account", (req, res) => {
  const { cpf, name } = req.body

  // como passar isso para o middleware 'verifyIfAccountExist'?
  const costumerExist = customers.some((customer) => customer.cpf === cpf)
  if(costumerExist) {
    res.status(400).json({ message: "Customer already exists"})
  }

  customers.push({
    cpf,
    name,
    accountId: uuidv4(),
    statements: [{id: "teste"}]
  })
  console.log(customers)
  res.status(201).json({ message: "account created" })
})

app.get(
  "/all",
  checkForCustomers,
  (req, res) => res.json({ data: customers })
)

app.get(
  "/statement/",
  verifyIfAccountExist, 
  (req, res) => res.status(200).json({ data: req.account.statements })
)

app.post(
  "/deposit",
  verifyIfAccountExist,
  (req, res) => {
    const { value } = req.body
    const account = req.account
    const accountIndex = customers.findIndex(customer => customer.cpf === account.cpf)
    customers[accountIndex].statements.push({
      depositId: uuidv4(),
      date: Date.now(),
      value
    })
    res.status(200).json({ message: "Successfully deposited" })
  }
)

app.listen(3000)