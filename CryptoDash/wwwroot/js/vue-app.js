var app = new Vue({
    el: '#app',
    data: {
        currencyArr: [],
        walletArr:[]
    },
    created() {
        this.getLatestPrices(this.getWallet);
        //this.interval = setInterval(() => this.getLatestPrices(), 60000);
    },
    methods: {
        getLatestPrices(_callback) {
            fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD')
                .then(response => response.json())
                .then(data => {
                    this.currencyArr = data.Data;
                    _callback();
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
                if (this.currencyArr[i].CoinInfo.FullName == name) {
                    return this.currencyArr[i].RAW.USD;
                }
            }
        }

    }
})