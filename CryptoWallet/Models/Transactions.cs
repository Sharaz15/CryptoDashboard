using System;
using System.Collections.Generic;

namespace CryptoWallet.Models
{
    public partial class Transactions
    {
        public string CurrencyName { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
