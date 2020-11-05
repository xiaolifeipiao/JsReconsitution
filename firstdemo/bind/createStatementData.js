//创建提升函数
module.exports ={
    creatStatementDate
}
function creatStatementDate(invoice, plays) { 
    const result = {};
    result.customer = invoice[0].customer;
    result.performances = invoice[0].performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

        /**
     * @param aPerformance 
     * 实现剧组的“剧组名称”数据的中转，使用play的aPerformance
     */
    function enrichPerformance(aPerformance) {
        // const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;   //返回一个浅副本
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
}
/**
 * 顶层作用域1
 */
class PerformanceCalculator{
    constructor(aPerformance,aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }
    get amount() {
        throw new Error(`subclass responsibility`);
    }
    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) {
            result += Math.floor(this.performance.audience / 5);
        }
        return result;
    }
    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}
/**
 * Tragedy的类
 */
class TragedyCalculator extends PerformanceCalculator{
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
     }
}
/**
 * Comedy的类
 */
class ComedyCalculator extends PerformanceCalculator{
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }
    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

/**
 * 抽象顶层函数
 * @param {*} aPerformance 
 * @param {*} aPlay 
 */
function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
    }
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
// function amountFor(aPerformance) {
//     return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
// }
/**
 * 提炼计算观众量积分的逻辑重构
 * @param {*} perf 
 * 
 */
//  


// module.exports = {
//     creatStatementDate
//   }