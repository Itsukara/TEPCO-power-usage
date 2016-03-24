// タイトル行の表示
var tt="\t"; for (i = 0; i < 24; i++) { tt += i+":00-"+i+":30\t "+i+":30-"+(i+1)+":00\t "}

// localStorageからの電力量情報取出し
var powerInfo = tt + "\n"

for (var key in localStorage) {
  // console.log(key)
  var r = key.match(/power-usage-(.*)/)
  if (r != null) {
    var pdate = r[1]
    var powerdata = JSON.parse(localStorage[key])
    powerInfo += pdate + "\t" + powerdata.join("\t") + "\n"
  }
}
console.log(powerInfo)
