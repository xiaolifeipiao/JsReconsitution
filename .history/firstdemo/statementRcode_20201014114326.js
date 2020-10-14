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
    // const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    for (let perf of invoice[0].performances) {
        // const play = plays[perf.playID];
        // print line for this order
        result += `${playFor(perf).name}:${usd(amountFor(perf))}(${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    volumeCredits = totalVolumeCredits();
    result += `Amount owed is ${usd(totalAmount)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

}


/**
 * 
 * @param {*} aPerformance 
 * @param {*} play 
 * 1. 提取函数
 * 2.查询取代临时变量，一步一步提取语义化变量(aPerformance:默认带上基类名,result:具有语义化，易于理解)，每步进行测试，确保bug规避
 * 3.参数重构，移除play变量
 * 4.
 */
function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
            throw new Error(`unknown type :${playFor(aPerformance).type}`);
    }
    return result;
}
/**
 * 
 * @param {*} aPerformance 
 * 移除play中间局部变量
 */
function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

/**
 * 提炼计算观众量积分的逻辑重构
 * @param {*} perf 
 * 
 */
function volumeCreditsFor(aPerformance) {
    let result = 0;
    //add volume credits
    result += Math.max(aPerformance.audience - 30, 0);
    //add extra for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}

/**
 * //移除format变量，重构format函数,改变函数声明usd格式化货币
 * @param {*} aNumber 
 */
// function format(aNumber) {
//     return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
// }
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber/100);
}

/**
 * 移除观众量积分总和，重构函数
 * 1.使用拆分循环
 * 2.使用移动语句
 * 3.提炼函数
 * 4.使用内联函数
 */
function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice[0].performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

