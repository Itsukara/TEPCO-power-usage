1.内容
東京電力の「でんき家計簿」が表示する時間別グラフのデータ抜出スクリプトです。

・でんき家計簿：https://www.kakeibo.tepco.co.jp/dk/com/menu/

2.使い方
半自動での作業となります。

2.1 時間別電力使用量の抽出
時間別グラフからデータを抽出し、chromeのlocalStorageに保管。

(1)chromeで「でんき家計簿」の時間別グラフを表示。
(2)PF12を押してchromeの「Developer Tools」を表示。
(3)「Developer Tools」のConsoleに下記ファイル内容をペースト。
    [ファイル]extract-power-usage.js
   これにより、電力使用量がchromeのlocalStorageに保管され、
   その後で、前日の時間帯別グラフが表示される。
(4)Consoleで上向きカーソルキーを押してスクリプトを再表示し、
   Enterキーで実行。
(5)上記(4)を、時間別グラフが表示されなくなるまで繰り返す。

2.2 時間別電力使用量の表示
(1)chromeで「でんき家計簿」の時間別グラフを表示。
(2)PF12を押して「Developer Tools」を表示。
(3)「Developer Tools」のConsoleに下記ファイル内容をペースト。
    [ファイル]print-power-usage
    これにより、Consoleに電力使用量情報が表示される。

上記で表示された情報をコピーして、Excelにペーストして、
適当にグラフ化して使ってください。

3.免責
（LICENSE.txtから抜粋）
・利用者は、ファイル内容をよく読み、自己責任でのご利用をお願いいたします。
・本ファイル群の利用で生じるいかなる現象・問題に関しても責任を負いません。
