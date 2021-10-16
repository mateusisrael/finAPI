const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")

app.use(express.json())
const customers = []


app.post("/account", (req, res) => {
  const { cpf, name } = req.body
  console.log(cpf, name)

  const costumerExist = customers.some((customer) => customer.cpf === cpf)
  if(costumerExist) {
    res.status(400).json({ message: "Customer already exists"})
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statements: [{id: "teste"}]
  })
  console.log(customers)
  res.status(201).json({ message: "account created" })
})

app.get("/all", (req, res) => {
  if(customers.length <= 0) return res.status(400).json({ message: "No account created" })
  return res.json({ data: customers })
})

app.get("/statement/:cpf", (req, res) => {
  const { cpf } = req.params

  const accountIndex = customers.findIndex((customer) => customer.cpf === cpf)
  if(accountIndex === -1) return res.status(400).json({ message: "This account does not exists" })
  const accountStatement = customers[accountIndex].statements
  return res.status(200).json({ data: accountStatement })
})

app.listen(3000)