var app = new Vue({
    el: '#currencyTicker',
    data: {
        currencyArr: []
    },
    created() {
        fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD')
            .then(response => response.json())
            .then(data => {
                this.currencyArr = data.Data
            })
    }
})