//////////////////////////////////
//
//    selecter version 2.00
//        by Colspan (Miyoshi)
//         http://colspan.net/
//
//////////////////////////////////


//文字列挿入
function selecter_insert(myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		sel.select();
	}
	//Mozilla
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos)
		+ myValue
		+ myField.value.substring(endPos, myField.value.length);
		myField.selectionStart = myField.selectionEnd = startPos + 1;
	} else {
		myField.value += myValue;
	}
}

//文字列後退
function selecter_backspace(myField){
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		if( sel.text == "") sel.moveStart("character",-1);
		sel.text = "";
		sel.move("character",0);
		sel.select();
	}
	//Mozilla
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		var temp = myField.value;
		if( startPos != endPos ){
			myField.value = myField.value.substring(0, startPos )
			+ myField.value.substring(endPos , myField.value.length);
			myField.selectionStart = myField.selectionEnd = startPos -1;
		}
		else{
			myField.value = myField.value.substring(0, startPos - 1)
			+ myField.value.substring(endPos , myField.value.length);
			myField.selectionStart = myField.selectionEnd = startPos - 1;
		}
//		document.getElementById("debug").innerHTML = startPos+"<br>"+endPos;
	}
	else {
		myField.value = myField.value.substring(0, myField.value.length-1);
	}
}
/*//文字列取得
function selecter_fetch(myField) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		if( sel.text == "") sel.moveStart("character",-1);
		return sel.text;
	}
	//Mozilla
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		if( startPos == endPos ) startPos -=1;
		return myField.value.substring(startPos,endPos);
	} else {
		return myField.value;
	}
}
*/