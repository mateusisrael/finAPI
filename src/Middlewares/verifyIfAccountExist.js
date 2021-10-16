function verifyIfAccountExist(req, res, next) {
  const { cpf } = req.headers
  const account = customers.find((customer) => customer.cpf == cpf)
 
  // status(204) == no content?
  if(!account) return res.status(400).json({ message: "This account does not exists" })
  req.account = account
  return next()
}