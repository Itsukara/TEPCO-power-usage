/*
  selenium-webdriverを使って、でんき家計簿の使用量グラフの
  時間別グラフから、使用量を取得するためのスクリプトです。
  利用に際し、NodeJS、selenium-webdriverを設定した環境が必要です。
  これらが整った環境において、下記コマンドで実行開始願います。
    node tepco-power-usage.js
  
  ・nodeは下記からダウンロードしてインストールできます。
    https://nodejs.org/en/download/
  
  ・selenium-webdriverはnpmでインストールできます。
    npm install selenium-webdriver -g
    
  ・Firefoxブラウザを使いますので事前インストール願います。
  
  ・下記サイトから"geckodriver-v0.19.1-win64.zip"をダウンロードして解凍し、
    解凍後フォルダ中のgeckodriver.exeを本スクリプトと同じフォルダに置きます。
    https://github.com/mozilla/geckodriver/releases
    
  ・利用前に、でんき家計簿のIDとパスワードを下記に追記願います。
*/

// でんき家計簿のIDとパスワード
var ID="";
var PASS = "";

// 一部だけのデータを取り出したいとき、下記を変更することで、
// 本日から遡って、下記の日付までのデータのみを取得します
var firstdate = "2016/03/14"


console.log("");
if (ID === "" || PASS === "") {
  console.log("tepco-power-usage.js中で「でんき家計簿」のIDとパスワードを記載してから実行願います。");
  process.exit()
}

function write_txt(basename, txt) {
    var fname = basename + new Date().toISOString().substr(0,23).replace(/:/g, "-") + ".txt";
    require('fs').writeFile(fname, txt);
    console.log("*** Data written to File: " + fname)
}

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.manage().setTimeouts({script: 2000, pageLoad: 5000, implicit: 2000})

var baseUrl = "https://www.kakeibo.tepco.co.jp";
var allpowerdatatxt = ""

driver.get(baseUrl + "/dk/aut/login/")
.then(function() {
  return driver.wait(until.elementLocated(By.id("idId")), 100)
})
.then(function() {
  return driver.findElement(By.id("idId")).sendKeys(ID)
})
.then(function() {
  return driver.findElement(By.id("idPassword")).sendKeys(PASS)
})
.then(function() {
  return driver.findElement(By.id("idLogin")).click()
})
.then(function() {
  return driver.wait(until.elementLocated(By.id("idNotEmptyImg_contents01.jpg")), 100).click()
})
.then(function() {
  return driver.wait(until.elementLocated(By.id("bt_time_view.jpg")), 100).click()
})
.then(function() {
  return extract_loop()
});

function extract_loop() {
  driver.wait(until.elementLocated(By.id("usage_grp")), 100)
  .then(function() {
    return driver.executeScript(extract_power_usage, [])
  })
  .then(function(powerdatatxt) {
    console.log(powerdatatxt)
    if(powerdatatxt.slice(0, 10) === firstdate) {
      console.log("*** Data Extraction Completed")
      allpowerdatatxt += powerdatatxt + "\n"
      powerdatatxt = ""
    }
    
    if(powerdatatxt === "") {
      allpowerdatatxt = allpowerdatatxt.split("\n").reverse().join("\n")
      write_txt("TPU-", allpowerdatatxt)
    } else {
      allpowerdatatxt += powerdatatxt + "\n"
      driver.findElement(By.id("doPrevious")).click()
      .then(extract_loop)
    }
  });
}

function extract_power_usage() {
// 電力使用量の取り出し
  var dkheadtxt = document.head.innerText
  var itemptn = /var items = \[([^\]]+])/
  var powertxt = dkheadtxt.match(itemptn)[1]
  if (powertxt === '["日次", 0]' || document.getElementById("doPrevious") === null) {
    return ""
  }
  var powerdata = eval(powertxt).slice(1,49)

  // 日付の取り出し
  var pdate = document.querySelector(".graph_head_table tr:nth-of-type(1) td:nth-of-type(2)")
  var pdatetxt = pdate.innerText.substr(0,10)

  // リターン値
  powerdata.unshift(pdatetxt)
  var powerdatatxt = powerdata.join(",")
  return powerdatatxt
}
