const { createStatementData } = require('./createStatementData');
const invoice = require("../../firstdemo/invoices.json");
const plays = require("../../firstdemo/plays.json"); 
htmlStatement(invoice, plays);

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}
function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += `<table>\n`;
    result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    for (let pref of data.performances) {
        result += `<tr><td>${pref.play.name}</td><td>${data.audience}</td>`;
        result += `<td>${usd(pref.amount)}</td></tr>\n`;
    }
    result += `</table>`;
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em>credits</p>`;
    return result;
} 
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber/100);
}