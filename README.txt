1.内容
東京電力の「でんき家計簿」が表示する時間別グラフのデータ抜出スクリプトです。

・でんき家計簿：https://www.kakeibo.tepco.co.jp/dk/com/menu/

2.使い方
2.1 NodeJS、selenium-webdriver等の準備
以下に関して、未インストールの場合はインストール願います。
(1) NodeJSのインストール
    下記から自分の環境にあった版をダウンロードしてインストールする
      https://nodejs.org/en/download/
      
(2) selenium-webdriverのインストール
  (a) Windowsのコマンドプロンプトを開く
      スタートメニューの「プログラムとファイルの検索」に
      「cmd」と入力し、ENTERキーを押す
  (b) 作業ディレクトリへのチェンジディレクトリ(cd)
      コマンドプロンプトで、作業ディレクトリ(tepco-power-usage.jsを
      置く場所：例えば「C:\WORK」)にcdする
        cd C:\WORK
  (c) selenium-webdriverのインストール
      コマンドプロンプトで下記を実行する
        npm install selenium-webdriver
      ※selenium-webdriverは作業ディレクトリにインストールされます

(3) FireFoxのインストール
    selenium-webdriverで使うため、インストールが必要です。
    下記からダウンロードしてインストールする
      https://www.mozilla.org/ja/firefox/new/

(4) geckodriver.exeのインストール
    下記サイトから"geckodriver-v0.19.1-win64.zip"をダウンロードして解凍し、
    解凍後フォルダ中のgeckodriver.exeを本スクリプトと同じフォルダに置きます。
    https://github.com/mozilla/geckodriver/releases

2.2 tepco-power-usage.jsの修正
初期設定として、tepco-power-usage.jsの修正が必要です。
(1) でんき家計簿のIDとパスワードを記載
    下記2行の""の部分に、IDとパスワードを設定する
      var ID="";
      var PASS = "";

(2) データ取得開始日の設定(必要に応じて)
    一部だけのデータを取り出したいとき、下記を変更することで、
    本日から遡って、下記の日付までのデータのみを取得します
      var firstdate = "2015/01/01"

2.3 時間別電力使用量の抽出
(1) コマンドプロンプトを開き、作業ディレクトリにcdする
(2) 下記コマンドを実行
      node tepco-power-usage.js
    これにより、FireFoxブラウザが立ち上がり、自動的にデータを取得。
    取得結果は、作業ディレクトリの下記のようなファイルに保管される
      TPU-2016-04-11T03-28-31.229.txt
      ※2016-06-11は日付、03-28-31.299は時間(UTC)

上記で表示された情報を、Excelにペーストして、適当にグラフ化して使ってください。

3.免責
（LICENSE.txtから抜粋）
・利用者は、ファイル内容をよく読み、自己責任でのご利用をお願いいたします。
・本ファイル群の利用で生じるいかなる現象・問題に関しても責任を負いません。
