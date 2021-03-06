﻿var app = new Vue({
    el: '#app',
    data: {
        currencyArr: [],
        walletArr: [],
        transactionsArr: [],
        buyCurrencySelected: '',
        buyAmountSpecified: '',
        currencyOptions: []
    },
    created() {
        this.getLatestPrices(this.getWallet, this.buildCurrencyOptions);
        this.getTransactions();
        //this.interval = setInterval(() => this.getLatestPrices(), 60000);
    },
    methods: {
        getLatestPrices(_callback, _callback2) {
            fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD')
                .then(response => response.json())
                .then(data => {
                    this.currencyArr = data.Data;
                    _callback();
                    _callback2();
                })
        },
        getWallet() {
            fetch('https://localhost:63125/api/currencys')
                .then(response => response.json())
                .then(data => {

                    var walletArray = [];
                    for (n = 0; n < data.length; n++) {
                        var stockInfo = this.getStockInfo(data[n].currencyName);
                        if (stockInfo) {

                            walletArray.push({
                                "CurrencyName": data[n].currencyName,
                                "Amount": data[n].amount,
                                "CurrencySymbol": stockInfo.RAW.USD.FROMSYMBOL,
                                "PercentChange24Hour": stockInfo.RAW.USD.CHANGEPCT24HOUR,
                                "ImgURL": stockInfo.RAW.USD.IMAGEURL
                            });
                        }
                    }
                    this.walletArr = walletArray;
                });
        },
        getStockInfo(name) {
            var matchingCurrency;
            for (i = 0; i < this.currencyArr.length; i++) {
                if (this.currencyArr[i].CoinInfo.FullName == name || this.currencyArr[i].RAW.USD.FROMSYMBOL == name) {
                    matchingCurrency = this.currencyArr[i];
                }
            }
            return matchingCurrency;

        },
        buyNow() {
            var stockInfo = this.getStockInfo(this.buyCurrencySelected);
            if (stockInfo) {

                var transaction = {
                    'currencyName': stockInfo.CoinInfo.FullName,
                    'amount': parseFloat(this.buyAmountSpecified),
                    'price': stockInfo.RAW.USD.PRICE,
                    'transactionDate': new Date().toISOString()
                }
                
                var xhr = new XMLHttpRequest();
                var url = "https://localhost:63125/api/currencys";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this.getWallet();
                        this.getTransactions();
                    }
                };
                var data = JSON.stringify(transaction);
                xhr.send(data);

                this.buyCurrencySelected = '';
                this.buyAmountSpecified = '';
            }
        },
        buildCurrencyOptions() {
            var currOptions = [];
            for (i = 0; i < this.currencyArr.length; i++) {
                currOptions.push(this.currencyArr[i].RAW.USD.FROMSYMBOL)
            }
            this.currencyOptions = currOptions;
        },
        getTransactions() {
            fetch('https://localhost:63125/api/transactions')
                .then(response => response.json())
                .then(data => {

                    var transactionsArray = [];
                    for (t = 0; t < data.length; t++) {
                        transactionsArray.push({
                            "CurrencyName": data[t].currencyName,
                            "Amount": data[t].amount,
                            "Price": data[t].price,
                            "When": this.timeSince(new Date(Date.parse(data[t].transactionDate)))
                        });
                    }
                    this.transactionsArr = transactionsArray;
                });
        },
        timeSince(date) {

            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = seconds / 31536000;

            if (interval > 1) {
                return Math.floor(interval) + " years";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
                return Math.floor(interval) + " months";
            }
            interval = seconds / 86400;
            if (interval > 1) {
                return Math.floor(interval) + " days";
            }
            interval = seconds / 3600;
            if (interval > 1) {
                return Math.floor(interval) + " hours";
            }
            interval = seconds / 60;
            if (interval > 1) {
                return Math.floor(interval) + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        }

    }
})