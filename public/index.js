// assignments
var amountInput = document.getElementById("myRange")
var loanAmount = document.getElementById("loanAmount")
var radioSoap = document.getElementsByName("radioSoap")
var repaymentAmount = document.getElementById("repaymentAmount")
var duration = document.getElementById("duration")

var prev = null;
var percentRate = 4


var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2
});

var convertToDecimal = function(val){
    return formatter.format(val)
}

var getPayRateFunc = function(loanAmount, intRate, duration){
    var loanRate = loanAmount * (intRate/100)
    var montPrincipal = loanAmount/duration
    var repayment = loanRate + montPrincipal
    
    repaymentAmount.value = convertToDecimal(repayment)

}

// initial values
getPayRateFunc(50000, percentRate, 1)
loanAmount.value = convertToDecimal(amountInput.value)

for (var i = 0; i < radioSoap.length; i++) {
    radioSoap[i].addEventListener('change', function() {
        if (this !== prev) {
            prev = this;
        }
        percentRate = this.value
        getPayRateFunc(amountInput.value, percentRate, duration.value)

    });
}



var amountChangeFunction = function (e) {
    // console.log(e.target)
    loanAmount.value = convertToDecimal(e.target.value)
    getPayRateFunc(e.target.value, percentRate, duration.value)

}

amountInput.addEventListener("change", amountChangeFunction)
amountInput.addEventListener("input", amountChangeFunction)

duration.addEventListener("change", function(e){
    getPayRateFunc(amountInput.value, percentRate, e.target.value)
})