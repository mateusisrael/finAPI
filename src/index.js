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
    statements: []
  })
  console.log(customers)
  res.status(201).json({ message: "account created" })
})

app.listen(3000)