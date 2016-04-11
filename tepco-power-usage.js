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
 
  ・利用前に、でんき家計簿のIDとパスワードを下記に追記願います。
*/

// でんき家計簿のIDとパスワード
var ID="";
var PASS = "";

// 「前日」クリック後のブラウザ画面の更新待ち時間(必要に応じて調整願います)
var waitms = 1000

// 一部だけのデータを取り出したいとき、下記を変更することで、
// 本日から遡って、下記の日付までのデータのみを取得します
var firstdate = "2015/01/01"

console.log("");
if (ID === "" || PASS === "") {
  console.log("tepco-power-usage.js中で「でんき家計簿」のIDとパスワードを記載してから実行願います。");
  process.exit()
}

function write_txt(basename, txt) {
    var fname = basename + new Date().toISOString().substr(0,23).replace(/:/g, "-") + ".txt";
    require('fs').writeFile(fname, txt);
}

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var baseUrl = "https://www.kakeibo.tepco.co.jp/";
driver.get(baseUrl + "/dk/aut/login/");

driver.findElement(By.id("idId")).clear();
driver.findElement(By.id("idId")).sendKeys(ID);
driver.findElement(By.id("idPassword")).clear();
driver.findElement(By.id("idPassword")).sendKeys(PASS);
driver.findElement(By.id("idLogin")).click();
driver.findElement(By.id("idNotEmptyImg_contents01.jpg")).click();

driver.findElement(By.id("bt_time_view.jpg")).click();


var allpowerdatatxt = ""
extract_loop()

function extract_loop() {
  driver.executeScript(extract_power_usage, []).then(function(powerdatatxt) {
    console.log(powerdatatxt)
    if(powerdatatxt.slice(0, 10) === firstdate) {
      allpowerdatatxt += powerdatatxt + "\n"
      powerdatatxt = ""
    }
    
    if(powerdatatxt === "") {
      allpowerdatatxt = allpowerdatatxt.split("\n").reverse().join("\n")
      write_txt("TPU-", allpowerdatatxt)
    } else {
      allpowerdatatxt += powerdatatxt + "\n"
      setTimeout(extract_loop, waitms)
    }
  });
}

function extract_power_usage() {
// 電力使用量の取り出し
  var dkhead = document.head.children
  var dkscript = Array.prototype.slice.call(dkhead, -3,-2)[0]
  var dkscripttxt = dkscript.innerText
  var itemptn = /var items = \[([^\]]+])/
  var powertxt = dkscripttxt.match(itemptn)[1]
  if (powertxt === '["日次", 0]') {
    return ""
  }
  var powerdata = eval(powertxt).slice(1,49)

  // 日付の取り出し
  var pdate = document.querySelector(".graph_head_table tr:nth-of-type(1) td:nth-of-type(2)")
  var pdatetxt = pdate.innerText.substr(0,10)

  // リターン値
  powerdata.unshift(pdatetxt)
  var powerdatatxt = powerdata.join(",")

  // 前日をクリック
  doPrevious.click()
  
  return powerdatatxt
}