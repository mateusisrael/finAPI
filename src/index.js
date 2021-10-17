const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")
const calculateAccountBalance = require('./utils/calculateAccountBalance')


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
    statements: []
  })
  console.log(customers)
  res.status(201).json({ message: "account created" })
})

app.put(
  "/account",
  verifyIfAccountExist,
  (req, res) => {
    const { name } = req.body
    const account = req.account
    account.name = name

    res.status(201).send()
  }
)

app.get(
  "/account",
  verifyIfAccountExist,
  (req, res) => {
    const account = req.account
    res.status(200).json({
      name: account.name,
      balance: calculateAccountBalance(account.statements)
    })
  }
)

app.get(
  "/all",
  checkForCustomers,
  (req, res) => res.json({ data: customers })
)

app.get(
  "/statement",
  verifyIfAccountExist, 
  (req, res) => res.status(200).json({ data: req.account.statements })
)

app.get(
  "/statement/date/",
  verifyIfAccountExist,
  (req, res) => {
    const account = req.account
    const { date } = req.query
    const dateFormat = new Date(date + " 00:00")

    const filteredStatements = account.statements.filter((statement) => {
      return statement.date.toDateString() === new Date(dateFormat).toDateString()
    })

    return res.json({ "data": filteredStatements })
  }
)

app.post(
  "/deposit",
  verifyIfAccountExist,
  (req, res) => {
    const { amount, description } = req.body
    const account = req.account
    account.statements.push({
      depositId: uuidv4(),
      date: new Date(),
      type: 'credit',
      description,
      amount: amount
    })
    res.status(201).json({ message: "Successfully deposited" })
  }
)

app.post(
  "/withdraw",
  verifyIfAccountExist,
  (req, res) => {
    const { withdraw } = req.body
    const account = req.account
    let accountValue = calculateAccountBalance(account.statements)

    if(accountValue >= withdraw) {
      account.statements.push({
        depositId: uuidv4(),
        date: new Date(),
        type: 'debit',
        amount: withdraw
      })

      return res.status(201).send()
    } else return res.status(400).json({ message: "Insufficient funds" })
  }
)

app.listen(3000)