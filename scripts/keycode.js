// キー入力管理 ///////////////
var keyCode = {
	isAlphabet : function(keyCode){
		return ( ( keyCode >= 0x41 && keyCode <= 0x5a ) || ( keyCode >= 0x61 && keyCode <= 0x7a ) );
	},
	isSymbol : function(keyCode){
		var inputChar = String.fromCharCode(keyCode);
		var symbolTable = '"\\'+"!#$%&'()=~|^-{}[]*`@:+;<,>.?/_";
		return symbolTable.search(inputChar) != -1;
	}
}
