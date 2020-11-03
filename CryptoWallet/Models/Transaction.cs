using System;
namespace CryptoWallet.Models
{
    public class Transaction
    {
        public Transaction()
        {
        }

        public string CurrencyName { get; set; }
        public double Amount { get; set; }
        public decimal Price { get; set; }
        public DateTime Time { get; set; }
    }
}
