/**
 * 重构statementv2
 * 拆分计算阶段和格式化阶段
 * 需求：
 * 1.一部分计算详单所需的数据
 * 2.将数据转换为渲染文本的HTML
 */
const invoice = require("./invoices.json");
const plays = require("./plays.json"); 
//顶层作用域
function statement(invoice, plays) {
    return renderPlainText(creatStatementDate(invoice, plays));
}
// 创建提升函数
function creatStatementDate(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice[0].customer;
    statementData.performances = invoice[0].performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
}
//提取为顶层函数renderPlanText
function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += `${perf.play.name}:${usd(perf.amount)}(${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
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
    switch (aPerformance.play.type) {
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
            throw new Error(`unknown type :${aPerformance.play.type}`);
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
    if ("comedy" === aPerformance.play.type) {
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
    // let result = 0;
    // for (let perf of data.performances) {
    //     result += perf.volumeCredits;
    // }
    // return result;
    // 用管道取代循环
    return data.aPerformance.reduce((total, p) => total + p.volumeCredits, 0);
}
/**
 * 重构累加变量
 * 1.使用拆分循环
 * 2.使用移动语句
 * 3.提炼函数
 * 4.使用内联函数
 */
function totalAmount() {
    // let result = 0;
    // for (let perf of data.performances) {
    //     result += perf.amount;
    // }
    // 管道取代循环
    // return result;
    return data.performances.reduce((total, p) => total + p.amount, 0);
}

/**
 * 
 * @param aPerformance 
 * 实现剧组的“剧组名称”数据的中转，使用play的aPerformance
 */
function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;   //返回一个浅副本
}
