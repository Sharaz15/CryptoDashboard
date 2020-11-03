var app = new Vue({
    el: '#currencyTicker',
    data: {
        currencyArr: []
    },
    created() {
        this.getLatestPrices();
        //this.interval = setInterval(() => this.getLatestPrices(), 60000);
    },
    methods: {
        getLatestPrices() {
            fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD')
                .then(response => response.json())
                .then(data => {
                    this.currencyArr = data.Data
                })
        }
    }
})