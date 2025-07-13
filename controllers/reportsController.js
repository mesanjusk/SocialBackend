const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

exports.getOutstandingReport = async (req, res) => {
  const { institute_uuid } = req.params;

  try {
    const transactions = await Transaction.aggregate([
      { $match: { institute_uuid } },
      { $unwind: '$Journal_entry' },
      {
        $group: {
          _id: {
            Account_id: '$Journal_entry.Account_id',
            Type: '$Journal_entry.Type'
          },
          totalAmount: { $sum: '$Journal_entry.Amount' }
        }
      }
    ]);

    const accountTotals = {};
    transactions.forEach(tran => {
      const accId = tran._id.Account_id;
      const type = tran._id.Type;
      if (!accountTotals[accId]) accountTotals[accId] = { Debit: 0, Credit: 0 };
      accountTotals[accId][type] += tran.totalAmount;
    });

    const allAccounts = await Account.find({ institute_uuid });
    const report = allAccounts.map(acc => {
      const totals = accountTotals[acc.uuid] || { Debit: 0, Credit: 0 };
      const net = totals.Debit - totals.Credit;
      return {
        Account_name: acc.Account_name,
        Account_group: acc.Account_group,
        Receivable: totals.Debit,
        Payable: totals.Credit,
        Net_Balance: Math.abs(net),
        DrCr: net > 0 ? 'Dr' : (net < 0 ? 'Cr' : ''),
        Status: net > 0 ? 'Receivable' : (net < 0 ? 'Payable' : 'Settled')
      };
    });

    res.json({ success: true, result: report });
  } catch (err) {
    console.error('Error generating outstanding report:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

