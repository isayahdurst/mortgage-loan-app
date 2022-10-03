'use strict'

const LOANBALANCE = 80_000;
const RATE = 2.25;
const LOANTERM = 360;
const CURRENTBALANCE = 75_000;

const mortgageLoan = {
    amortization: ['hello'],
};


const getPayment = function (startingBalance, rate, term) {
    let i = (rate / 100) / 12;
    let monthlyInterestPayment = i * startingBalance;
    let payment = startingBalance * (i * (1 + i)**term) / (((1 + i)**term) - 1);
    let monthlyPrincipalPayment = payment - monthlyInterestPayment;
    return payment;
}

const getPIPayment = function (payment, balance, rate) {
    let i = (rate/100) /12;
    let monthlyInterestPayment = balance * i;
    let monthlyPrincipalPayment = payment-monthlyInterestPayment;
    return [monthlyPrincipalPayment, monthlyInterestPayment];
}

getPayment(LOANBALANCE, RATE, LOANTERM);
// M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]. 

// M = Total monthly payment
// P = The total amount of your loan
// I = Your interest rate, as a monthly percentage
// N = The total amount of months in your timeline for paying off your mortgage

const amortization = new Map();

const getNewBalance = function(previousMonthArray) {
    return previousMonthArray[0];
};

const amortizeLoan = function (LOANBALANCE, RATE, LOANTERM) {
    let balance = LOANBALANCE;
    let rate = RATE;
    let term = LOANTERM;
    let payment = getPayment(balance, rate, term);
    let [principalPayment, interestPayment] = getPIPayment(payment, balance, rate);
    amortization.set(1, [balance-principalPayment, principalPayment, interestPayment, payment]);
    
    for (let i = 2; i<=LOANTERM; i++) {
        balance = getNewBalance(amortization.get(i-1))-principalPayment;
        [principalPayment, interestPayment] = getPIPayment(payment, balance, rate);
        amortization.set(i, [balance, principalPayment, interestPayment, payment]);
        [principalPayment, interestPayment] = getPIPayment(payment, balance, rate);
    }
    console.log(amortization);
};

amortizeLoan(LOANBALANCE, RATE, LOANTERM);

const findMonthsRemaining = function (loanBalance) {
    let monthsRemaining = 0;
    for (let [key, value] of amortization) {
        if (loanBalance>value[0]) {
            console.log(`Months paid: ${key}`);
            return key;
        }
    }    
};

const findInterestRemaining = function(monthsRemaining, amortization, term) {
    let interest = 0;

    for (let i=monthsRemaining; i<term; i++) {
        interest+=amortization.get(i)[2];
    }
    return interest;

}

const currentLoan = {
    amortization: amortization,
    balance: CURRENTBALANCE,
    PIPayment: 12,
    term: 360,
    getTotalInterest: function () {
        this.totalInterest = 0;
        for (let i = 1; i<this.term; i++) {
            this.totalInterest += this.amortization.get(i)[2];
        }
        console.log(`Total Interest: ${this.totalInterest}`);
    } 
}

const creditReportDebts = {
    barclays: {
        balance: 1800,
        payment: 200,
        highBalance: 7800
    },

    
}

currentLoan.getTotalInterest();
console.log(currentLoan);

