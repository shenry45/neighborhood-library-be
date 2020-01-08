const db = require("../database/dbConfig.js");

module.exports = {
  findTransactionById,
  addTransaction,
  updateReturnTime
};

// Find transaction for a given id
async function findTransactionById(lender_id, google_book_id) {
  // get books where lender id and google book id match
  const transactions = await db("transactions").where({ lender_id, google_book_id });

  console.log(transactions);

  if (transactions.length > 1) {
    // return all available books, not returned yet
    return transactions.reduce(tran => tran.return_time !== null);
  } else {
    return [];
  }
}

// Add a transaction history
async function addTransaction(transaction) {
  const [id] = await db("transactions")
    .returning("id")
    .insert(transaction);
  return findTransactionById(id);
}

// Update time stamp of return time
async function updateReturnTime(id) {
  await db("transactions")
    .where({ id })
    .update({ return_time: db.fn.now() });
  return findTransactionById(id);
}
