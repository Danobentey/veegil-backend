const User = require('../models/user');
const Transaction = require('../models/transaction');

const transfer = async (req, res) => {
  try {
    const { senderPhoneNumber, recipientPhoneNumber, amount } = req.body;

    const sender = await User.findOne({ phoneNumber: senderPhoneNumber });
    const recipient = await User.findOne({ phoneNumber: recipientPhoneNumber });

    if (!sender || !recipient) {
      return res.status(400).json({ message: 'Sender or recipient not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for the transfer' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    // Create a transaction record
    const transaction = new Transaction({
      senderPhoneNumber,
      recipientPhoneNumber,
      amount,
    });

    // Save the updated user balances and the transaction record
    await sender.save();
    await recipient.save();
    await transaction.save();

    res.status(200).json({ message: `$${amount} Transfer to ${recipientPhoneNumber} successful` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error transferring money' });
  }
}


const deposit = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;

    console.log(req.body)

    const user = await User.findOne({ phoneNumber });

    console.log(user)

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.balance += amount;

    // Create a transaction record for the deposit
    const transaction = new Transaction({
      senderPhoneNumber: "Bank", // TODO: Implement something better here
      recipientPhoneNumber: phoneNumber,
      amount,
    });

    await user.save();
    await transaction.save();

    res.status(200).json({ message: `$${amount} Deposit successful` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error depositing money' });
  }
}

// Function to handle user withdrawals
const withdraw = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for withdrawal' });
    }

    user.balance -= amount;

    const transaction = new Transaction({
      senderPhoneNumber: phoneNumber,
      recipientPhoneNumber: null, // Withdrawals don't have a recipient
      amount,
    });

    // Save the updated user balance and the withdrawal transaction
    await user.save();
    await transaction.save();

    res.status(200).json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error withdrawing money' });
  }
}

// Function to retrieve a user's transaction history
const transactionHistory = async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    // Find transactions related to the user (sender or recipient)
    const transactions = await Transaction.find({
      $or: [{ senderPhoneNumber: phoneNumber }, { recipientPhoneNumber: phoneNumber }],
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving transaction history' });
  }
}

module.exports = {
  transfer,
  deposit,
  withdraw,
  transactionHistory,
};