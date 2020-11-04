using System;
using System.Collections.Generic;
using System.Linq;
using CryptoWallet.Models;

namespace CryptoWallet.Services
{
    public class WalletService
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
                if (!context.Currencys.Contains(currency))
                {
                    context.Currencys.Add(currency);
                }
                else
                {
                    context.Currencys.Update(currency);
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
