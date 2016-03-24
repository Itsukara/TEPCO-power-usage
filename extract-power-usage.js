// 電力使用量の取り出し
var dkhead = document.head.children
var dkscript = Array.prototype.slice.call(dkhead, -3,-2)[0]
var dkscripttxt = dkscript.innerText
var itemptn = /var items = \[([^\]]+])/
var powertxt = dkscripttxt.match(itemptn)[1]
var powerdata = eval(powertxt).slice(1,49)

// 日付の取り出し方
var pdate = document.querySelector(".graph_head_table tr:nth-of-type(1) td:nth-of-type(2)")
var pdatetxt = pdate.innerText.substr(0,10)

// localStorageへの保管
localStorage["power-usage-" + pdatetxt] = JSON.stringify(powerdata)

// 前日をクリック
doPrevious.click()
