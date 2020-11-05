using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CryptoWallet.Models;
using CryptoWallet.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CryptoWallet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencysController : ControllerBase
    {
        private readonly ILogger<CurrencysController> _logger;
        private readonly IWalletService WalletService;

        public CurrencysController(ILogger<CurrencysController> logger, IWalletService walletService)
        {
            _logger = logger;
            WalletService = walletService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(WalletService.GetCurrencys().ToArray());
        }

        [HttpPost]
        public IActionResult Post([FromBody] Transactions transaction)
        {
            var currency = new Currencys
            {
                CurrencyName = transaction.CurrencyName,
                Amount = transaction.Amount
            };

            if (!AreFieldsValid(currency, transaction))
            {
                return BadRequest("some or all fields have not been provided");
            }

            try
            {
                WalletService.AddOrUpdateCurrencyHolding(currency, transaction);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "failed to add currency to wallet");
                return StatusCode(500, "database entry failed to execute");
            }

            return Ok();
        }

        private bool AreFieldsValid(Currencys currency, Transactions transaction)
        {
            if (!string.IsNullOrEmpty(currency.CurrencyName) &&
                currency.Amount != default &&
                !string.IsNullOrEmpty(transaction.CurrencyName) &&
                transaction.Amount != default &&
                transaction.Price != default &&
                transaction.TransactionDate != null && transaction.TransactionDate != DateTime.MinValue
            )
            {
                return true;
            }
            else
            {
                return false;
            }
          
        }
    }
}
