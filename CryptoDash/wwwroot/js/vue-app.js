var app = new Vue({
    el: '#app',
    data: {
        currencyArr: [],
        walletArr: [],
        buyCurrencySelected: '',
        buyAmountSpecified: '',
        currencyOptions: []
    },
    created() {
        this.getLatestPrices(this.getWallet, this.buildCurrencyOptions);
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
                    for (i = 0; i < data.length; i++) {
                        var stockInfo = this.getStockInfo(data[i].currencyName);
                        if (stockInfo != null && stockInfo != undefined) {

                            walletArray.push({
                                "CurrencyName": data[i].currencyName,
                                "Amount": data[i].amount,
                                "CurrencySymbol": stockInfo.FROMSYMBOL,
                                "PercentChange24Hour": stockInfo.CHANGEPCT24HOUR,
                                "ImgURL": stockInfo.IMAGEURL
                            });
                        }
                    }
                    this.walletArr = walletArray;
                })
        },
        getStockInfo(name) {
            for (i = 0; i < this.currencyArr.length; i++) {
                if (this.currencyArr[i].CoinInfo.FullName == name || this.currencyArr[i].RAW.USD.FROMSYMBOL == name) {
                    return this.currencyArr[i].RAW.USD;
                }
            }
        },
        buyNow() {
            var stockInfo = this.getStockInfo(this.buyCurrencySelected);
            if (stockInfo != null && stockInfo != undefined) {

                var transaction = {
                    'currencyName': this.buyCurrencySelected,
                    'amount': parseFloat(this.buyAmountSpecified),
                    'price': stockInfo.PRICE,
                    'transactionDate': new Date().toISOString()
                }

                fetch('https://localhost:63125/api/currencys', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'same-origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(transaction) // body data type must match "Content-Type" header
                }).catch((error) => {
                    console.error('Error:', error);
                });

                this.getWallet();
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
        }

    }
})