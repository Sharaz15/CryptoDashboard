using System;
using System.Collections.Generic;
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
        public IActionResult Post(Transactions transaction)
        {
            var currency = new Currencys
            {
                CurrencyName = transaction.CurrencyName,
                Amount = transaction.Amount
            };
            if (AreFieldsNull(currency, transaction))
            {
                return BadRequest("some or all of fields provided are null");
            }

            try
            {
              WalletService.AddOrUpdateCurrencyHolding(currency, transaction);
            }catch(Exception e)
            {
                _logger.LogError(e, "failed to add currency to wallet");
                return StatusCode(500,"database entry failed to execute");
            }

            return Ok();
        }

        private bool AreFieldsNull(Currencys currency, Transactions transaction)
        {
            bool isAnyCurrFieldsNull = currency.GetType().GetProperties()
                            .All(p => p.GetValue(currency) != null);

            bool isAnyTransNull = transaction.GetType().GetProperties()
                            .All(p => p.GetValue(transaction) != null);

            return isAnyCurrFieldsNull || isAnyTransNull;
        }
    }
}
