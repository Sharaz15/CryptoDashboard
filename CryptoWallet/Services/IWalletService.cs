using System;
using System.Collections.Generic;
using CryptoWallet.Models;

namespace CryptoWallet.Services
{
    public interface IWalletService
    {
        public List<Currencys> GetCurrencys();
        public void AddOrUpdateCurrencyHolding(Currencys currency, Transactions transaction);
        public List<Transactions> GetTransactions();
    }
}
