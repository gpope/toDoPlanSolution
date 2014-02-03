/*###########################################################################*/
//Briše input polja (username, password) za prijavu u sustav
/*###########################################################################*/
function clearLoginInput() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById('username').focus();
}

/*###########################################################################*/
//Load XML dokumenta
/*###########################################################################*/
function loadXMLDoc(dname) {
    
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.setRequestHeader("Pragma", "no-cache");
    xhttp.setRequestHeader("Cache-Control", "must-revalidate");
    xhttp.setRequestHeader("Cache-Control", "no-cache");
    xhttp.setRequestHeader("Cache-Control", "no-store");
    xhttp.send();
    return xhttp.responseXML;
}
/*###########################################################################*/
//Drag and Drop
/*###########################################################################*/
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    var eleid = ev.dataTransfer.getData("Text");
    var el = ev.target;
    if (el.id != 'toDoItemList' && el.id != 'doneItemList') {
        if (el.type == 'checkbox')
            el = el.parentNode;
        else if (el.nodeName == 'TABLE')
            el = el.childNodes[0].childNodes[0];
        el = el.parentNode.parentNode;
    }
    el.appendChild(document.getElementById(eleid));
    ev.preventDefault();
    
}

/*###########################################################################*/
// Dodavanje stavki u listu, unosom u text polje i klikom na gumb
// Klikom na unesenu stavku stavka se briše
// Stavka se može prebacivati (drag and drop) iz todoList-e u doneList-u
/*###########################################################################*/
//Add item from input textbox to div id="toDoItemList"
var itemCount = 1;
var itemId = "item1";
function addToDoItem() {
    var txtInput = document.getElementById('toDoInput').value;
    if (txtInput == "") {
        document.getElementById('toDoInput').focus();
    }
    else {
        
        var tr = document.createElement("tr");
        var items = "item";
        
        //tr.addEventListener('click', deleteToDoItem, false);
        tr.setAttribute('class', items);
        tr.setAttribute('draggable', true);
        tr.setAttribute('id', itemId);
        
        var task = "<td class = 'input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' /><input type='text' class='skriveni' style='display: none;' value='" + txtInput + "' /></td><td onclick = 'deleteToDoItem(this.parentNode.id)' class='itemTdName'>" + txtInput + "</td>";
        
        tr.innerHTML = task;
        var list = document.getElementById("toDoItemList");
        //kada se kreira 1. task za novi projekt kreira tbody
        if (list.childNodes.length == 0) {
            var tb = document.createElement('TBODY');
            tb.appendChild(tr);
            list.appendChild(tb);
        }
        else {
            list.firstChild.appendChild(tr);
        }

        tr.addEventListener("dragstart", function (ev) { drag(ev); }, false);

        itemCount++;
        itemId = "item" + itemCount;
        document.getElementById('toDoInput').value = "";
        document.getElementById('toDoInput').focus();
    }
}
function changeStatus(id) {
   
    var checked = "doneItemTdName";
    var unchecked = "ItemTdName";
    var che = "checked";
    var inp = document.getElementById(id).firstChild.childNodes[0];
    var red = document.getElementById(id).firstChild.nextSibling; 
    var preb = document.getElementById(id);
    if (inp.checked) {
        //zadatak čekiran, prebaci ga u listu čekiranih   
        red.setAttribute('class', checked);
        inp.setAttribute('checked');
        
        //prebaci ga u čekirane      
        var cklon = preb.cloneNode(true);
        cklon.setAttribute('draggable', true);
        cklon.addEventListener("dragstart", function (ev) { drag(ev); }, false);
        var dIL = document.getElementById("doneItemList").firstChild;
        if (dIL == undefined) {
            dIL = document.getElementById("doneItemList");
            var tbody = document.createElement('tbody');
            dIL.appendChild(tbody);
        }
        dIL.appendChild(cklon);
        preb.parentNode.removeChild(preb);
    } 
    else {
        //zadatak odčekiran, prebaci ga u listu odčekiranih
        red.setAttribute('class', unchecked);
        inp.removeAttribute('checked');
        preb.addEventListener("dragstart", function (ev) { drag(ev); }, false);
        //prebaci ga u odčekirano
        var uklon = preb.cloneNode(true);
        uklon.setAttribute('draggable', true);
        uklon.addEventListener("dragstart", function (ev) { drag(ev); }, false);
        var tDIL = document.getElementById("toDoItemList").firstChild;
        tDIL.appendChild(uklon);
        preb.parentNode.removeChild(preb);
    }

    
}
//##################################################
// Brisanje i izmjena zadataka u projektu
//##################################################
//Funkcija mijena naziv zadatka
function zamjeniIme(val, parid) {
    var tr = document.getElementById(parid);
    if (val) {
        tr.childNodes[1].innerHTML = val;
        tr.childNodes[0].childNodes[1].value = val;
    } else {
        tr.childNodes[1].innerHTML = "Unesite zadatak!";
        tr.childNodes[1].innerHTML = tr.childNodes[0].childNodes[1].value;
        //tr.childNodes[1].focus();
        
    }
}
//Funkcija briše zadatak
function brisiIme(parid) {
    var tr = document.getElementById(parid);
    var moj;
    for (var i = 0; i < tr.parentNode.childNodes.length; i++)
        if (tr.parentNode.childNodes[i].id == parid)
            moj = i;
    var rod = tr.parentNode;
    var dije = rod.childNodes[moj];
    alert(moj);
    //rod.removeChild(rod.childNodes[moj]);
    rod.removeChild(dije);
}
// Funkcija izbornika za izmjeni ili obriši
function deleteToDoItem(id) {
    
   // var d = confirm("Jeste li sigurni da želite obrisati stavku?");
    //if (d == true) {

    var x = document.getElementsByClassName('active');

    if (x.length > 0) {
        x[0].parentNode.innerHTML = x[0].parentNode.previousSibling.childNodes[1].value;
    }

    var umetak = '<td><input type="text" class="active" style="z-index: 5000;" id="z' + id + '" onkeydown="Javascript: if (event.keyCode==13) zamjeniIme(this.value, this.parentNode.parentNode.id);" > <a href="#" class="red" onclick="brisiIme(this.parentNode.parentNode.id)"> Obriši</a></td>';  
    var zz = document.getElementById(id);
    
    if (zz) {
        var stariNaziv = document.getElementById(id).childNodes[1].childNodes[0].nodeValue;
        zz.childNodes[1].innerHTML = umetak;
        var efoc = document.getElementById("z" + id);
        efoc.value = stariNaziv;
        efoc.focus();
    }
}

//create zadatak
function createZadatak() {

    var aside = '<input type="text" id="toDoInput" onkeydown="Javascript: if (event.keyCode==13) addToDoItem();" /><br /><br />';
    aside += '<a href="#" id="noviZadatak" onclick = "addToDoItem()">Novi zadatak</a> | <a href="#" id="odustaniOdZadatka" onclick="odustaniOdZadatka()">Odustani</a>';
    document.getElementById("createNoviZadatak").innerHTML = aside;
    document.getElementById("toDoInput").focus();
}
//odustani od kreiranja zadatka
function odustaniOdZadatka() {
    document.getElementById("createNoviZadatak").innerHTML = "";
}

/*###########################################################################*/
//U <aside> nalazi se popis postojećih lista, klikom na neku od njih popunjavaju
//se polja za aktivnim i završenim taskovima, koji se mogu brisati clickom, i
//drag and drop-ati
/*###########################################################################*/
function addList(listname) {
    //Clear fields:: kada klikne na željenu listu polja se obrišu
    document.getElementById('toDoItemList').innerHTML = "";
    document.getElementById('doneItemList').innerHTML = "";
    document.getElementById('nazivProjekta').innerHTML = "";
    document.getElementById("webservice").innerHTML = "";
    document.getElementById("zadaci").innerHTML = "";
    document.getElementById("zadaciZavrseni").innerHTML = "";
    //Naziv projekta
    document.getElementById('nazivProjekta').innerHTML = listname;

    var addItem = '<div id="createNoviZadatak"></div><br /><a href="#" id="noviZadatak" onclick="createZadatak()">+ Novi zadatak</a>'
    document.getElementById("addItem").innerHTML = addItem;

    //alert(listname);
    //Popuni polje s aktivnim taskovima za izabranu listu
    //
        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/GetSessionUserId";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {
                    var fileName = (request.responseXML.childNodes[0].firstChild.data) + ".xml";
                    
                    xmlDoc = loadXMLDoc(fileName);
                    //ovo je ubačeno u if
                    var listnames = xmlDoc.getElementsByTagName("name");
                    for (n = 0; n < listnames.length; n++) {
                        if (listnames[n].childNodes[0].nodeValue == listname) {
                            //alert("Našao sam djubre!");
                            listnames = listnames[n];
                            break;
                        }
                    }
                    //openItems = xmlDoc.getElementsByTagName("openitems")[0];
                  
                    openItems = listnames.nextSibling.nextSibling;
                    var tasks = "";
                    if (openItems != null) {
                        for (var i = 0; i < openItems.childNodes.length - 1; i += 2) {
                            tasks += "<tr class='item' draggable='true' id='" + itemId + "'><td class='input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' /><input type='text' class='skriveni' style='display: none;' value='" + openItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "' /></td><td class='itemTdName' onclick = 'deleteToDoItem(this.parentNode.id)'>" + openItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "</td></tr>";
                            
                            itemCount++;
                            itemId = "item" + itemCount;
                        }
                        //tasks += "</table>";
                        document.getElementById("zadaci").innerHTML = "Zadaci";
                        var openTasks = document.getElementById("toDoItemList");
                        openTasks.innerHTML += tasks;
                    }
                    //Popuni polje sa završenim taskovima za izabranu listu
                    //doneItems = xmlDoc.getElementsByTagName("doneitems")[0];
                    if (openItems != null) {
                        doneItems = listnames.nextSibling.nextSibling.nextSibling.nextSibling;
                    }
                    else {
                        doneItems = listnames.nextSibling.nextSibling;
                    }
                    var tasks = "";
                    if (doneItems != null) {
                        for (var i = 0; i < doneItems.childNodes.length - 1; i += 2) {
                            tasks += "<tr class='item' draggable='true' id='" + itemId + "'><td class='input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' checked /><input type='text' class='skriveni' style='display: none;' value='" + openItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "' /></td><td class='doneItemTdName' onclick = 'deleteToDoItem(this.parentNode.id)'>" + doneItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "</td></tr>";
                            itemCount++;
                            itemId = "item" + itemCount;
                        }
                        //tasks += "</table>";
                        document.getElementById("zadaciZavrseni").innerHTML = "Završeni zadaci";
                        var doneTasks = document.getElementById("doneItemList");
                        doneTasks.innerHTML += tasks;
                    }
                    //Dodaje event listenere za click na task i drog and drop
                    var li = document.getElementsByClassName("item");
                    for (var l = 0; l < li.length; l++) {
                        li[l].addEventListener("dragstart", function (ev) { drag(ev); }, false);
                        //li[l].addEventListener('click', deleteToDoItem, false);
                    }
                    //kraj ubačenog
                }
            }
            request.send();
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }   
}
//create project
function createProject() {
    
    var aside = '<input type="text" id="projekt" onkeydown="Javascript: if (event.keyCode==13) createList();" /><br /><br />';
    aside += '<a href="#" id="novi" onclick = "createList()">Novi projekt</a> | <a href="#" id="odustani" onclick="odustani()">Odustani</a>';
    document.getElementById("createNovi").innerHTML = aside;
    document.getElementById("projekt").focus();
}
//odustani od kreiranja projekta
function odustani() {
    document.getElementById("createNovi").innerHTML = "";
}

/*###########################################################################*/
//Klikom na gumb poziva servis koji kreira novi projekt 
//u lists.xml, users.xml
/*###########################################################################*/
function createList() {

    var nazivliste = document.getElementById("projekt").value;
    if (nazivliste == "")
        document.getElementById("projekt").focus();
    if (nazivliste != "") {
        var poruka = "name=" + nazivliste;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/UpdateXML";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {
                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                    document.getElementsByClassName("todoList")[0].innerHTML = "";
                    document.getElementsByClassName("todoList")[1].innerHTML = "";
                    document.getElementById('nazivProjekta').innerHTML = nazivliste;
                    var addItem = '<div id="createNoviZadatak"></div><br /><a href="#" id="noviZadatak" onclick="createZadatak()">+ Novi zadatak</a>'
                    document.getElementById("addItem").innerHTML = addItem;
                    document.getElementById("addItem").innerHTML = addItem;
                    document.getElementById("webservice").innerHTML = "";
                    document.getElementById("zadaci").innerHTML = "";
                    document.getElementById("zadaciZavrseni").innerHTML = "";
                    
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
    }
}

//###################################################################
//Prijava u sustav (kreira SESSION varijable [nick, email])
//###################################################################
function Prijava() {

        if (frmlogin.username.value == "" || frmlogin.password.value == "")
            alert("Unesite korisničko ime i lozinku!");
        else {
        
            var poruka = "name=" + frmlogin.username.value + "&pass=" + frmlogin.password.value;
            var request = null;
            if (window.XMLHttpRequest) {
                request = new XMLHttpRequest();
            } else {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var the_URL = "servisi.asmx/ProvjeriKorisnika";


            if (request) {
                request.open("POST", the_URL);
                //requesr.data = "{ ime: 'petar', prezime: 'petar' }";
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.onreadystatechange =
                function () {
                    if (request.readyState == 4) {
                        var req = request.responseXML.childNodes[0].firstChild.data;
                        if (req == "true") {
                            //document.getElementsByTagName("header")[0].innerHTML = "hi, " + request.responseText + " | <a href='#' onclick='Odjava()'>ODJAVA</>";
                            GetSessionNick();
                            //GetSessionEmail();
                            document.getElementsByTagName("footer")[0].innerHTML = "";
                        }
                        else {
                            alert("Korisnički podaci nisu prošli validaciju.");
                            clearLoginInput();
                        }

                    }
                }
                request.send(poruka);

            } else {
                alert("Problemi u radu servera, pokušajte kasnije.");
            }
        }
  //  }
}
//###################################################################
//Odjava iz sustava (briše SESSION varijable [nick, email])
//###################################################################
function Odjava() {

    var request = null;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var the_URL = "servisi.asmx/Odjava";
   
    if (request) {
        request.open("POST", the_URL);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.onreadystatechange =
        function () {
            if (request.readyState == 4) {
                var forma = '<form id="frmlogin" name="frmlogin" method="post" action="javascript:Prijava()">';
                forma += '<label>Email: </label><input type="text" name="username" id="username" /> ';
                forma += '<label>Lozinka: </label><input type="text" name="password" id="password" /> ';
                forma += '<input type="submit" value="Prijava" />';
                forma += '</form>';
                forma += '<br /><img src="Slike/todo_logo.png" />';
                document.getElementsByTagName("header")[0].innerHTML = forma;
                document.getElementsByTagName("aside")[0].innerHTML = "";
                document.getElementById('nazivProjekta').innerHTML = "";
                document.getElementsByClassName("todoList")[0].innerHTML = "";
                document.getElementsByClassName("todoList")[1].innerHTML = "";
                document.getElementById("webservice").innerHTML = "";
                document.getElementById("zadaci").innerHTML = "";
                document.getElementById("zadaciZavrseni").innerHTML = "";
                document.getElementsByTagName("footer")[0].innerHTML = "Sva prava pridržana. FOI&copy;2013.";
                document.getElementById("addItem").innerHTML = "";
            }
        }
        request.send();
    } else {
        alert("Problemi u radu servera, pokušajte kasnije.");
    }
}
//get session variable nick
function GetSessionNick() {

    var request = null;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var the_URL = "servisi.asmx/GetSessionNick";

    if (request) {
        request.open("POST", the_URL);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.onreadystatechange =
        function () {
            if (request.readyState == 4) {
                //kada se reloada (refresh) provjerava SESSION, da li je korisnik logiran
                if (request.responseXML.childNodes[0].firstChild != null) {
                    document.getElementsByTagName("header")[0].innerHTML = "hi, " + request.responseText + " | <a href='#' onclick='Odjava()'>ODJAVA</a><br /><img src='Slike/todo_logo.png' />";
                    GetSessionEmail();
                }
                    
            }
        }
        request.send();
    } else {
        alert("Problemi u radu servera, pokušajte kasnije.");
    }
}
//get session varibale email
function GetSessionEmail() {

    var request = null;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var the_URL = "servisi.asmx/GetSessionEmail";

    if (request) {
        request.open("POST", the_URL);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.onreadystatechange =
        function () {
            if (request.readyState == 4) {
                AsideProjekti( request.responseXML.childNodes[0].firstChild.data);
                //alert(req);
            }
        }
        request.send();
    } else {
        alert("Problemi u radu servera, pokušajte kasnije.");
    }
}
//Ispisuje liste za logiranog korisnika u <aside>
function AsideProjekti(mail) {
    //Dohvaća i ispisuje popis todo list-a za prijavljenog korisnika
    xmlDoc = loadXMLDoc("user.xml");
    //svi emailovi
    usersemail = xmlDoc.getElementsByTagName("email");
    for (var j = 0; j < usersemail.length; j++) {
        //traži email prijavljenog korisnika
        if (usersemail[j].childNodes[0].nodeValue == mail) {
            //dohvaća liste za prijavljenog korisnika
            lists = xmlDoc.getElementsByTagName("lists")[j];
            //prolazi kroz i ispisuje liste za prijavljenog korisnika
            //koliko ima djece čvorova?
            //document.write(lists.childNodes.length);
            document.getElementsByTagName("aside")[0].innerHTML = "";
            //---->ispis u aside
            var popis = "<h1>Projekti</h1><ul id='todolists'>";
            for (var k = 0; k < lists.childNodes.length - 1; k += 2) {
                popis += "<li class='list'><a href='#' onclick='addList(this.innerHTML)'>" + lists.childNodes[k].nextSibling.childNodes[0].nodeValue + "</a></li>";
            }
            popis += '</ul>';
            popis += '<div id="createNovi"></div><br /><a href="#" id="noviProjekt" onclick = "createProject()"> + Novi projekt</a>';
            var aside = document.getElementsByTagName("aside")[0];
            aside.innerHTML += popis;
            break;
        }

    }

}


window.onload = function () {
    GetSessionNick();
}
