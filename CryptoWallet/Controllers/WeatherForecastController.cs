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
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IWalletService WalletService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWalletService walletService)
        {
            _logger = logger;
            WalletService = walletService;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet]
        public IActionResult GetCurrencyHoldings()
        {
            return Ok(WalletService.GetCurrencys().ToArray());
        }

        [HttpGet]
        public IActionResult GetTransactions()
        {
            return Ok(WalletService.GetTransactions().ToArray());
        }

        [HttpPost]
        public IActionResult AddCurrencyToWallet(Currencys currency, Transactions transaction)
        {
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
