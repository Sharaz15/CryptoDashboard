using System;
using System.Collections.Generic;
using System.Linq;
using CryptoWallet.Models;

namespace CryptoWallet.Services
{
    public class WalletService : IWalletService
    {
        public WalletService()
        {
        }

        public List<Currencys> GetCurrencys()
        {
            using (var context = new CryptoDashDatabaseContext())
            {
                return context.Currencys.ToList();
            }
        }

        public void AddOrUpdateCurrencyHolding(Currencys currency, Transactions transaction)
        {
            using (var context = new CryptoDashDatabaseContext())
            {
                if (!context.Currencys.Any(c => c.CurrencyName == currency.CurrencyName))
                {
                    context.Currencys.Add(currency);
                }
                else
                {
                    var existingCurr = context.Currencys.Single(c => c.CurrencyName == currency.CurrencyName);
                    existingCurr.Amount += currency.Amount;
                }
                context.Transactions.Add(transaction);

                context.SaveChanges();
            }
        }

        public List<Transactions> GetTransactions()
        {
            using (var context = new CryptoDashDatabaseContext())
            {
                return context.Transactions.ToList();
            }
        }
    }
}
