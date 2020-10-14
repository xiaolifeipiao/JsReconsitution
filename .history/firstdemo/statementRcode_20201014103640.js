/**
 * 重构statement
 * 
 */


const invoice = require("./invoices.json");
const plays = require("./plays.json"); 
console.log(statement(invoice, plays));
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice[0].customer}\n`;
    const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    for (let perf of invoice[0].performances) {
        const play = plays[perf.playID];
       

        //add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        //add extra for every ten comedy attendees
        if ("comedy" === play.type) {
            volumeCredits += Math.floor(perf.audience / 5);
        }
        // print line for this order
        result += `${play.name}:${format(thisAmount / 100)}(${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

}


// 提炼计算票价函数
function amountFor(pref, play) {
    let thisAmount = 0;
    switch (play.type) {
        case "tragedy":
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type :${play.type}`);
    }
    return thisAmount;
}

