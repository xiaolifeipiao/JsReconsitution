/**
 * 重构statement
 * 1.重构是以微小的步伐进行，容易发现自己的错误
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
        let thisAmount = amountFor(perf, play);

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


/**
 * 
 * @param {*} aPerformance 
 * @param {*} play 
 * 1. 提取函数
 * 2.一步一步提取语义化变量(aPerformance:默认带上基类名,result:具有语义化，易于理解)，每步进行测试，确保bug规避
 * 3.查询取代临时变量
 * 4.参数重构
 */
function amountFor(aPerformance, play) {
    let result = 0;
    switch (play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type :${play.type}`);
    }
    return result;
}

