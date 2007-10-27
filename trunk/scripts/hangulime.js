/*
//   Hangul IME lib by Colspan (Miyoshi)   //

・バージョン履歴
	Version 2.22 (2007/10/06)
		関数名変更(toggleIMEへ)
	Version 2.21 (2007/07/27)
		切り替えスイッチを追加
	Version 2.2 (2007/07/20)
		Linux環境でのFirefox2に対応
		IE以外はonkeypressで処理するようにした
		ライブラリ名を変更した

	Version 2.1 (2007/06/14)
		Macintosh環境でのSafari,Firefox,Caminoに対応

	Version 2.01 (2006/09/14)
		enableIME,disableIME関数の修正・コメント加筆

	Version 2.0 (2006/09/02)
		クラス化・ライブラリ化

	Version 1.4 (2006/05/21)
		ライブラリの汎用化
		Ctrl/Shiftキーの挙動を修正

	Version 1.03 (2006/02/07)
		古めのMozillaやFirefox 1.0.xxに対応

	Version 1.02 (2006/02/07)
		関係ないキーが化ける問題を修正

	Version 1.01 (2006/02/06)
		BS周りのバグ修正
		Firefox 1.5.xxに対応

	Version 1.00 (2006/02/06)
		IE6で実装完了
		Sigmarion3のIEで動作確認

・謝辞
	johab.jsを開発されたchiyuさんに深く感謝いたします。
*/

//無動作関数
function no_action(){}

var hangulIME = function(obj){this.initialize.call(this, obj)};
hangulIME.prototype = {
	hangulBox : null,//textarea要素
	isEnabled : false,//現在の入力モードを記憶する
	tempText : "",//結合作業領域
	originalBackgroundColor:"",

	initialize : function(formObj){
		var _this = this;

		if( !browser.isModern && !browser.isIe && !browser.isOpera ){// browser detection
			alert('Sorry. Your browser does not support Hangul IME.');
			return false;
		}

		//hangul Box
		this.hangulBox = formObj;
//		this.hangulBox.value = "Type here.";
		this.hangulBox.onkeydown = function(e){ // Key Down
			if( browser.isIe ) return _this.hangulBox.onkeypress();
			if(!event) var event = e;
			if( e.altKey && String.fromCharCode(e.keyCode).toUpperCase() == "O" ) _this.toggleIME(); //切り替え
			if( _this.isEnabled ){
				if( e.ctrlKey || e.altKey || e.metaKey || e.keyCode == 13 || !keyCode.isAlphabet(event.keyCode) ) return true;
				else return false;
			}
			return true;
		}
		this.hangulBox.onkeyup = function(e){ // Key Up
			if( _this.isEnabled ){
				return false;
			}
			return true;
		}
		this.hangulBox.onkeypress = function(e){// Key Press (onkeydownと同じ値を返す)
			if( !browser.isIe && !event ) var event = e;
			//if( event.keyCode != null ) $("debug3").innerHTML =　"keyCode:"+event.keyCode+" charCode:"+event.charCode;
//alert(e);
/*			if( event.altKey && String.fromCharCode(event.keyCode).toUpperCase() == "O" ){
				_this.toggleIME(); //切り替え
				return false;
			}*/
			if( _this.isEnabled ){
				var status = _this.imeCombine(event);
				return !status;
			}
			else return true;
		}
		this.hangulBox.onmousedown = function(){
			if( _this.isEnabled ){
				_this.imeAccept();
			}
		}

		//execute
		this.hangulBox.focus();
		this.enableIME();

	},
	enableIME : function(){
		this.isEnabled = true;
		this.tempText = "";
		this.originalBackgroundColor = this.hangulBox.style.background;
		this.hangulBox.style.background = "#FFF0F0";
	},
	disableIME : function(){
		this.isEnabled = false;
		this.tempText = "";
		this.hangulBox.style.background = this.originalBackgroundColor;
	},
	toggleIME : function (){
		if( this.isEnabled ) this.disableIME();
		else this.enableIME();
	},
	imeCombine : function(e){
		/* IME処理関数
			処理したらtrue
			処理せず無視したらfalse
		*/
		if( !this.isEnabled ) return false;	// IMEが無効になっている場合
		if( browser.isIe ) e = event; // IEの場合
//		event = eventObj || window.event;
		//入力制御
		var inputCode = ( browser.isIe ? e.keyCode : e.charCode );
		var inputChar = String.fromCharCode(inputCode);

		//extention 漢字変換など
	//	if( hangulIME_extension( e ) ) return false;
		//関係ないキーは除外
		if( e.keyCode == 8 ){//BS
			return this.imeBS();
		}
		else if( e.keyCode == 16 || e.keyCode == 17 ){//Shift || Ctrl
			return false;
		}
		else if( e.keyCode == 224 || e.keyCode == 13 ){//Meta || Enter 
			this.imeAccept();
			return false;
		}
		else if( e.ctrlKey || e.altKey || e.metaKey ){//特殊キーが押されているとき
			if( keyCode.isAlphabet( inputCode ) ){
				//特殊キーの組み合わせでは確定してスルー
				this.imeAccept();
				return false;
			}
		}
		else if( ! keyCode.isAlphabet(inputCode) ){//アルファベットではない
			this.imeAccept();
			return false;
		}

		//Shiftキーの処理
		// 二重子音かどうかを判断
		if( e.shiftKey && (("abcdfghijklmnsuvxyz").search(inputChar.toLowerCase()) == -1) ) inputChar = inputChar.toUpperCase();
		else inputChar = inputChar.toLowerCase();

		//変換開始
		var mytext = this.tempText;
		var mykey = inputChar;
		if(this.tempText.length != 0 ) selecter_backspace(this.hangulBox);//作業文字列がからでないときには1文字消す
		var lastChar = mytext.substring(mytext.length - 1, mytext.length);//結合対象文字列

		if(isJasoKey(mykey)){//作業文字列に入力文字を演算
			this.tempText = strPlusJasoKey(lastChar, mykey);
		}
		if(this.tempText.length == 2){//文字が確定した
			selecter_insert(this.hangulBox,this.tempText.substring(0, 1));//テキストボックスに確定文字を挿入
			this.tempText = this.tempText.substring(1,2);
		}
		selecter_insert(this.hangulBox,this.tempText);//テキストボックスに作業文字列を挿入
		return true;
	},
	imeBS : function(){
		var mystr = this.tempText;
		if(mystr.length!=0){
			this.tempText = strDeleteOneJaso(mystr);
			selecter_backspace(this.hangulBox);
			if( this.tempText.length != 0 ) selecter_insert(this.hangulBox,this.tempText);//テキストボックスに挿入
			return true;
		}
		else{
			return false;
	//		selecter_backspace(this.hangulBox);
		}
	},
	//処理文字列を確定する
	imeAccept :  function(){
		if(this.tempText.length != 0 ){
			selecter_backspace(this.hangulBox);
			selecter_insert(this.hangulBox,this.tempText.substring(0, 1));//テキストボックスに挿入
			this.tempText = "";
		}
	},
	selectAll : function(){
		this.imeAccept();
		this.hangulBox.focus();
		this.hangulBox.select();
	},
	clearBox : function(){
	this.tempText = ""
	this.hangulBox.focus();
	this.hangulBox.value = "";
	}
}


//debug
function dump( dmpObj ){
	/*	event = dmpObj;
	document.write("<table border=1>");
	for(i in event){
		document.write("<tr><td>"+i+"</td><td>"+ event[i]+"</td><td>"+typeof(event[i])+"</td></tr>");
	}
	document.write("</table>");*/
	//	alert(event.toElement);
	var dumpStr = "<table border=1>";
	for(i in dmpObj){
		dumpStr+="<tr><td>"+i+"</td><td>"+ dmpObj[i]+"</td><td>"+typeof(dmpObj[i])+"</td></tr>";
	}
	dumpStr+="</table>";
	document.getElementById("debug").innerHTML = dumpStr;
}

