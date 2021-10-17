function calculateAccountBalance(accountStatements) {
  let value = 0
  accountStatements.map(deposit => {
    if(deposit.type === 'credit') return value=value+deposit.amount
    else return value=value-deposit.amount
  })

  return value
}

module.exports = calculateAccountBalance