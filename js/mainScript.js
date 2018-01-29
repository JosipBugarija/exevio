var num = 1; // num služi kao id za kartice
var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// pri prvom otvaranju stranice se prikazuju i spremaju primjerne kartice, a pri svakom sljedećem otvaranju pretražuju se i prikazuju spremljene kartice
var columnNameVal = localStorage.getItem("columnName");
if(columnNameVal === null){
	localStorage.setItem('columnName','TESTNA LISTA');
	columnName.value = 'TESTNA LISTA';
	newCard("Pozdrav Exevio!",getDate(),2,1);
	newCard("Kartice se spremaju u local storage, a nakon refresha stranice se ponovno prikazuju",getDate(),2,2);
	newCard("Izmjena naziva liste se sprema u local storage bilo kojim klikom van polja",getDate(),2,3);
	newCard("Obriši<br>me",getDate(),2,4);
	num = 5;
}else{
	columnName.value = columnNameVal;
	var len = localStorage.length;
	for(num;num < len;num++){
		var card = localStorage.getItem("card"+num);
		if(card === null)len++;
		else{
			card = JSON.parse(card);
			newCard(card.text,card.date,0,num);
		}
	}
}

// funkcija za dohvat datuma
function getDate(){
	var d = new Date();
	return monthNames[d.getMonth()]+', '+d.getDate();
}

// funkcija za spremanje i prikaz kartice. Za parametre prima tekst(value),datum kartice, id kartice(num) i tip prikaza ili spremanja kartice(save).
function newCard(value,date,save,num){
	value = value.replace(/(?:\r\n|\r|\n)/g,'<br>');
	
	var card = document.createElement("div");
	card.setAttribute("class","card");
	card.setAttribute("onmouseover","showRemoveBtn('card"+num+"')");
	card.setAttribute("onmouseleave","hideRemoveBtn('card"+num+"')");
	card.setAttribute("id","card"+num);
	card.innerHTML = '<a onclick="removeCard(\''+num+'\')">x</a>'+value+'<br><p><span class="glyphicon glyphicon-time"></span> '+date+'</p>';

	cards.appendChild(card);

	/* save parametar ima 3 moguće vrijednosti (0,1,2). 
	0 - se koristi kada se kartice učitavaju
	1 - koristi se kada je potrebno spremanje kartice, prikaz nove kartice uz animaciju i prikaz 'Add a card' poveznice
	2 - se koristi samo pri pri prvom otvaranju stranice*/
	if(save == 1 || save == 2){
		if(save == 1){
			$("#card"+num).animate({padding:"6px 12px 30px",opacity:1},400);
			$('#cardText').css({height:0,padding:0,opacity:0,margin:0});
			$("#addCard").css('visibility','visible');
		}else $("#card"+num).css({padding:"6px 12px 30px"}).animate({opacity:1},400)

		var card = {'text':value,'date':date};
		localStorage.setItem('card'+num,JSON.stringify(card));
	}else $("#card"+num).css({padding:"6px 12px 30px"}).animate({opacity:1},400);
}

// funkcija koja svaku izmjenu naziva stupca odmah sprema u local storage. Funkciju poziva onchange event
function saveColumnName(){
	localStorage.setItem('columnName',columnName.value);
}

/* Svakim klikom koji se dogodi na stranici se provjerava da li se klik dogodio van polja za unos teksta.
Ako se klik dogodio van polja, a polje sadrži tekst onda se kartica sprema te se pojavljuje "Add a card" za sljedecu karticu.
Ako se klik dogodio van polja, a polje ne sadrži tekst onda se polje za unos teksta zatvara te se pojavljuje "Add a card" za sljedecu karticu.*/ 
function submitCard(){
	var height = cardText.clientHeight;

	if($("#cardText").is(":focus") == false && (cardText.value.length > 0)){
		newCard(cardText.value,getDate(),1,num);
		cardText.value = '';
		num++;
	}else if($("#cardText").is(":focus") == false && height > 0){
		$('#cardText').animate({height:0,padding:0,opacity:0,margin:0},200);
		$("#addCard").css('visibility','visible');
	}	
}

// Funkcija prikazuje polje za unos teksta sa pokazivacem da se nešto može utipkati, a poziva se klikom na "Add a card".
function showTextarea(){
	$('#cardText').animate({height:'100px',padding:'6px 12px',opacity:1,'margin-bottom':'-20px'},200);
	$("#addCard").css('visibility','hidden');
	cardText.focus();
}

// Funkcija za brisanje kartice
function removeCard(id){
	id = 'card'+id;
	var height = document.getElementById(id).clientHeight+'px';
	$('#'+id).animate({opacity:0},400);
	setTimeout(function(){
		$('#'+id).animate({'margin-top':'-'+height},400).css('max-height',height);
		setTimeout(function(){
			$('#'+id).remove();
		},450);
	},350);
	localStorage.removeItem(id);
}

// na mouseover iznad kartice se prikazuje mali 'x' u njenom gornjem desnom kutu
function hideRemoveBtn(id){
  $('#'+id+' a').css('opacity',0);
}

// kada pokazivač miša više nije iznad kartice onda se 'x' skriva 
function showRemoveBtn(id){
  $('#'+id+' a').css('opacity',1);
}