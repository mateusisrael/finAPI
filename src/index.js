const express = require("express")
const app = express()
const { v4: uuidv4 } = require("uuid")

app.use(express.json())
const customers = []


app.post("/account", (req, res) => {
  const { cpf, name } = req.body

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
  const account = customers.find((customer) => customer.cpf == cpf)
 
  // status(204) == no content?
  if(!account) return res.status(400).json({ message: "This account does not exists" })
  return res.status(200).json({ data: account.statements })
})

app.listen(3000)