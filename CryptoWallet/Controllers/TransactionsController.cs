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
    public class TransactionsController : ControllerBase
    {
        private readonly ILogger<TransactionsController> _logger;
        private readonly IWalletService WalletService;

        public TransactionsController(ILogger<TransactionsController> logger, IWalletService walletService)
        {
            _logger = logger;
            WalletService = walletService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(WalletService.GetTransactions().ToArray());
        }
    }
}
