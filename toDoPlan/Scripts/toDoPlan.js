/*###########################################################################*/
//Briše input polja (username, password) za prijavu u sustav
/*###########################################################################*/
function clearLoginInput() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById('username').focus();
}
function clearRegistrationInput() {
    document.getElementById("imeKorisnika").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password1").value = "";
    document.getElementById("password2").value = "";
    document.getElementById("imeKorisnika").focus();

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
// Dodavanje stavki u listu, unosom u text polje i klikom na gumb
// Klikom na unesenu stavku stavka se briše
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
        
        //tr.addEventListener('click', editItem, false);
        tr.setAttribute('class', items);
        tr.setAttribute('id', itemId);
        
        var task = "<td class = 'input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' /><input type='text' class='skriveni' style='display: none;' value='" + txtInput + "' /></td><td onclick = 'editItem(this.parentNode.id)' class='itemTdName'>" + txtInput + "</td>";
        
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

        itemCount++;
        itemId = "item" + itemCount;
        document.getElementById('toDoInput').value = "";
        document.getElementById('toDoInput').focus();
        //ovdje kreće poziv za save task in xml
        var remVal = txtInput;
        var nazProj = document.getElementById("nazivProjekta").childNodes[0].nodeValue;

        var poruka = "taskName=" + remVal + "&projName=" + nazProj;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/AddTask";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {

                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                    document.getElementById("central").style.visibility = "visible";
                    document.getElementById("central").style.display = "block";
                    document.getElementById("zadaci").innerHTML = "Zadaci";
                    //document.getElementById("zadaciZavrseni").innerHTML = "Završeni zadaci";
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
        //ovdje završava poziv save task in xml
    }
    
}
function changeStatus(id) {
   
    var checked = "doneItemTdName";
    var unchecked = "ItemTdName";
    var che = "checked";
    var inp = document.getElementById(id).firstChild.childNodes[0];
    
    var red = document.getElementById(id).firstChild.nextSibling; 
    var preb = document.getElementById(id);
    var remVal = document.getElementById(id).childNodes[1].childNodes[0].nodeValue;//naziv zadatka kojem se mijenja status
    var nazProj = document.getElementById("nazivProjekta").childNodes[0].nodeValue;//naziv projekta

 
    if (inp.checked) {
        //zadatak čekiran, prebaci ga u listu čekiranih   
        red.setAttribute('class', checked);
        inp.setAttribute('checked');
        
        //prebaci ga u čekirane      
        var cklon = preb.cloneNode(true);
        var dIL = document.getElementById("doneItemList").firstChild;

        if (dIL == undefined) {//tbody nema kad se 1. put prebaci
            dIL = document.getElementById("doneItemList");
            var tbody = document.createElement('tbody');
            dIL.appendChild(tbody);
            dIL.firstChild.appendChild(cklon);
        }
        else
            dIL.appendChild(cklon);

        preb.parentNode.removeChild(preb);

        //podaci za slanje servisu ChangeTaskStatus(taskName, parentId, projName)

        //start of service call
        var remTable = "toDoItemList";
        var poruka = "taskName=" + remVal + "&parentId=" + remTable + "&projName=" + nazProj;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/ChangeTaskStatus";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {

                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                    document.getElementById("zadaciZavrseni").innerHTML = "Završeni zadaci";
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
        //end of service
        //kraj poziva servisu za mijenjanje statusa u xml
    } 
    else {
        //zadatak odčekiran, prebaci ga u listu odčekiranih
        red.setAttribute('class', unchecked);
        inp.removeAttribute('checked');
        //prebaci ga u odčekirano
        var uklon = preb.cloneNode(true);
        var tDIL = document.getElementById("toDoItemList").firstChild;
       

        //
        if (tDIL == undefined) {
            tDIL = document.getElementById("toDoItemList");
            var tableBody = document.createElement('tbody');
            tDIL.appendChild(tableBody);
        }
        //
        tDIL.appendChild(uklon);
        preb.parentNode.removeChild(preb);

        //poziv servisu za mijenjane statusa u xmlu
        //podaci za slanje servisu ChangeTaskStatus(taskName, parentId, projName)
        //var remVal 
        var remTable = "doneItemList";
        var nazProj = document.getElementById("nazivProjekta").childNodes[0].nodeValue;
        //start of service

        var poruka = "taskName=" + remVal + "&parentId=" + remTable + "&projName=" + nazProj;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/ChangeTaskStatus";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {

                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
        //end of service
        //kraj poziva servisu za mijenjanje statusa u xml
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
        var staroIme = tr.childNodes[0].childNodes[1].value;
        tr.childNodes[0].childNodes[1].value = val;
        //zove servis RenameTask
        //RenameTask(string taskName, string newTaskName, string parentId, string projName)
        var remVal = staroIme;
        var newName = val ;
        var remTable = tr.parentNode.parentNode.id;
        var nazProj = document.getElementById("nazivProjekta").childNodes[0].nodeValue;
        //start of service

        var poruka = "taskName=" + remVal + "&newTaskName=" + newName + "&parentId=" + remTable + "&projName=" + nazProj;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/RenameTask";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {

                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
        //kraj poziva servisu RenameTask 

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
    //rod.removeChild(rod.childNodes[moj]);
    rod.removeChild(dije);
    //podaci za slanje servisu DeleteTask(taskName, parentId, projName)
    var remVal = dije.childNodes[1].childNodes[0].value;
    var remTable = rod.parentNode.id;
    var nazProj = document.getElementById("nazivProjekta").childNodes[0].nodeValue;
    //bool DeleteTask(string taskName, string parentId, string projName)
    //start of service

        var poruka = "taskName=" + remVal + "&parentId=" + remTable + "&projName=" + nazProj;

        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/DeleteTask";

        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {
                    
                    document.getElementById("webservice").innerHTML = request.responseText;
                    //Osvježava popis projekata u <aside>
                    GetSessionNick();
                }
            }
            request.send(poruka);
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
    //end of service
}
// Funkcija izbornika za izmjeni ili obriši
function editItem(id) {

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
//se polja sa aktivnim i završenim taskovima, koji se mogu brisati clickom
/*###########################################################################*/
function addList(listname) {
    //Clear fields:: kada klikne na željenu listu polja se obrišu
    document.getElementById("central").style.visibility = "visible";
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
                            listnames = listnames[n];
                            break;
                        }
                    }
                    //openItems = xmlDoc.getElementsByTagName("openitems")[0];
                  
                    openItems = listnames.nextSibling.nextSibling;
                    var tasks = "";
                    if (openItems != null) {
                        for (var i = 0; i < openItems.childNodes.length - 1; i += 2) {
                            tasks += "<tr class='item' id='" + itemId + "'><td class='input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' /><input type='text' class='skriveni' style='display: none;' value='" + openItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "' /></td><td class='itemTdName' onclick = 'editItem(this.parentNode.id)'>" + openItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "</td></tr>";
                            
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
                            tasks += "<tr class='item' id='" + itemId + "'><td class='input'><input type = 'checkbox' onclick = 'changeStatus(this.parentNode.parentNode.id)' checked /><input type='text' class='skriveni' style='display: none;' value='" + doneItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "' /></td><td class='doneItemTdName' onclick = 'editItem(this.parentNode.id)'>" + doneItems.childNodes[i].nextSibling.childNodes[0].nodeValue + "</td></tr>";
                            itemCount++;
                            itemId = "item" + itemCount;
                        }
                        //tasks += "</table>";
                        document.getElementById("zadaciZavrseni").innerHTML = "Završeni zadaci";
                        var doneTasks = document.getElementById("doneItemList");
                        doneTasks.innerHTML += tasks;
                    }
                    //Dodaje event listenere za click na task
                    var li = document.getElementsByClassName("item");
                    for (var l = 0; l < li.length; l++) {
                        //li[l].addEventListener('click', editItem, false);
                    }
                    //kraj ubačenog
                }
            }
            request.send();
        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }

        var zadaci = document.getElementById("central");
        zadaci.style.display = "block";
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
                    document.getElementById("central").style.visibility = "visible";
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
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.onreadystatechange =
                function () {
                    if (request.readyState == 4) {
                        var req = request.responseXML.childNodes[0].firstChild.data;
                        if (req == "true") {
                            //document.getElementsByTagName("header")[0].innerHTML = "hi, " + request.responseText + " | <a href='#' onclick='Odjava()'>ODJAVA</>";
                            GetSessionNick();
                            document.getElementById("central").style.visibility = "hidden";
                            //GetSessionEmail();
                            //document.getElementsByTagName("footer")[0].innerHTML = "";
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
                
                document.getElementById("prijavaDiv").style.visibility = "visible";
                document.getElementById("prijavaDiv").style.display = "block";
                document.getElementById("registracijaDiv").style.visibility = "hidden";
                document.getElementById("registracijaDiv").style.display = "block";
                document.getElementById("linkPR").style.visibility = "visible";
                document.getElementById("porukaPrijavljen").innerHTML = "";
                document.getElementById("porukaPrijavljen").style.visibility = "hidden";
                document.getElementById("central").style.visibility = "hidden";
                document.getElementById("lijevi").style.visibility = "hidden";
                clearLoginInput();
                //GetSessionEmail();
                
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
                    //document.getElementsByTagName("header")[0].innerHTML = "hi, " + request.responseText + " | <a href='#' onclick='Odjava()'>ODJAVA</a><br /><img src='Slike/todo_logo.png' />";
                    document.getElementById("prijavaDiv").style.visibility = "hidden";
                    document.getElementById("prijavaDiv").style.display = "none";
                    document.getElementById("registracijaDiv").style.visibility = "hidden";
                    document.getElementById("registracijaDiv").style.display = "none";
                    document.getElementById("linkPR").style.visibility = "hidden";
                    document.getElementById("porukaPrijavljen").innerHTML = "hi, " + request.responseText + " | <a href='#' onclick='Odjava()'>ODJAVA</a>";
                    document.getElementById("porukaPrijavljen").style.visibility = "visible";
                    //document.getElementById("central").style.visibility = "hidden";
                    document.getElementById("lijevi").style.visibility = "visible";
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

function editProject(ime) {

    //makni stare okvire za unos podataka
        makniAktivne();

    var dijete;
    var p = document.getElementsByClassName("list");
    for (var i = 0; i < p.length; i++){
        if (p[i].childNodes[1].childNodes[0].nodeValue== ime) {
            dijete = i;
            break;
        }
    }
    var roditelj = document.getElementById("todolists");
    var novi = document.createElement("li");
    novi.setAttribute("class", "controlLi");
    var inp = document.createElement("input");
    inp.setAttribute("value", ime);
    var aizmjeni = document.createElement("a");
    var aIzmjeniT = document.createTextNode(" Izmijeni");
    
    aizmjeni.addEventListener('click', izmjeniNazivPr, false);
    aizmjeni.appendChild(aIzmjeniT);
    var meni = document.createElement("li");
    meni.setAttribute("class", "controlLi2");
    var delA = document.createElement("a");
    delA.setAttribute("id", ime);
    delA.setAttribute("href", "#");
    
    delA.addEventListener('click', obrisiProjekt, false);
    var delT = document.createTextNode("Obriši projekt");
    //
    var odustaniA = document.createElement("a");
    //odustaniA.setAttribute("onclick", "alert('odustao')");
    odustaniA.addEventListener('click', odustaniEditProj, false);
    var odustaniT = document.createTextNode("Odustani");
    odustaniA.appendChild(odustaniT);
    //
    var razm = document.createTextNode(" | ");
    delA.appendChild(delT);
    meni.appendChild(delA);
    meni.appendChild(razm);
    novi.appendChild(inp);
    meni.appendChild(odustaniA);
    novi.appendChild(aizmjeni);
    roditelj.insertBefore(novi, roditelj.childNodes[i + 1]);
    roditelj.insertBefore(meni, roditelj.childNodes[i + 2]);
}
function izmjeniNazivPr() {

    var textInput = this.previousSibling;
    var textLabel = this.parentNode.previousSibling.childNodes[1].childNodes[0];
    textLabel.nodeValue = textInput.value;

    makniAktivne();
}

function makniAktivne() {
    var listaAktivnih = document.getElementsByClassName('controlLi');
    var listaAktivnih2 = document.getElementsByClassName('controlLi2');

    //makni stare okvire za unos podataka
    if (listaAktivnih.length > 0) {
        //x[0].parentNode.innerHTML = x[0].parentNode.previousSibling.childNodes[1].value;

        for (var i = 0; i < listaAktivnih.length; i++) {
            listaAktivnih[i].parentNode.removeChild(listaAktivnih[i]);
        }

        for (var i = 0; i < listaAktivnih2.length; i++) {
            listaAktivnih2[i].parentNode.removeChild(listaAktivnih2[i]);
        }
    }
}

function obrisiProjekt() {
    
    //servis DeleteProject
    var nazProj = this.id;

    var poruka = "projName=" + nazProj;

    var request = null;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var the_URL = "servisi.asmx/DeleteProject";

    if (request) {
        request.open("POST", the_URL);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.onreadystatechange =
        function () {
            if (request.readyState == 4) {

                document.getElementById("webservice").innerHTML = request.responseText;
               
                var node = document.getElementById('toDoItemList');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }

                //var nazivProjekta = document.getElementById("nazivProjekta");
                //nazivProjekta.innerHTML = "";

                var zadaci = document.getElementById("central");
                zadaci.style.display = "none";

                //Osvježava popis projekata u <aside>
                GetSessionNick();
            }
        }
        request.send(poruka);
    } else {
        alert("Problemi u radu servera, pokušajte kasnije.");
    }
    //end of service call
}
function odustaniEditProj() {

    makniAktivne();
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
                popis += "<li class='list'><a href='#' onclick='editProject(this.nextSibling.childNodes[0].nodeValue)'>+ </a><a href='#' onclick='addList(this.innerHTML)'>" + lists.childNodes[k].nextSibling.childNodes[0].nodeValue + "</a></li>";
            }
            popis += '</ul>';
            popis += '<div id="createNovi"></div><br /><a href="#" id="noviProjekt" onclick = "createProject()"> + Novi projekt</a>';
            var aside = document.getElementsByTagName("aside")[0];
            aside.innerHTML += popis;
            break;
        }

    }

}

//show form prijava
function prijavaForm() {
    document.getElementById("prijavaDiv").style.visibility = "visible";
    document.getElementById("prijavaDiv").style.display = "block";
    document.getElementById("registracijaDiv").style.visibility = "hidden";
    document.getElementById("registracijaDiv").style.display = "none";
    document.getElementById("username").focus();
}
function regForm() {
    document.getElementById("registracijaDiv").style.visibility = "visible";
    document.getElementById("registracijaDiv").style.display = "block";
    document.getElementById("prijavaDiv").style.visibility = "hidden";
    document.getElementById("prijavaDiv").style.display = "none";
    document.getElementById("imeKorisnika").focus();
}
//Registracija korisnika
function Registracija() {
    var valid = false;
    var mailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (frmregistracija.imeKorisnika.value == "" || frmregistracija.email.value == "" || frmregistracija.password1.value == "" || frmregistracija.password2.value == "") {
        alert("Popunite sva polja!");
    }
    else if (frmregistracija.password1.value != frmregistracija.password2.value) {
        alert("Lozinke se ne poklapaju");
        clearRegistrationInput();
    }
    else if (!frmregistracija.email.value.match(mailregex))
    {
        alert("Upisani e-Mail nije ispravan");
        clearRegistrationInput();
    }
    else
        valid = true;
    
    if(valid == true) {

        var poruka = "korIme=" + frmregistracija.imeKorisnika.value + "&email=" + frmregistracija.email.value + "&lozinka=" + frmregistracija.password1.value;
        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var the_URL = "servisi.asmx/RegistracijaKorisnika";


        if (request) {
            request.open("POST", the_URL);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.onreadystatechange =
            function () {
                if (request.readyState == 4) {
                    var req = request.responseXML.childNodes[0].firstChild.data;
                    if (req == "ok") {         
                        alert("Možete se prijaviti. Email vam je korisničko ime.");
                        document.getElementById("prijavaDiv").style.visibility = "visible";
                        document.getElementById("prijavaDiv").style.display = "block";
                        document.getElementById("registracijaDiv").style.visibility = "hidden";
                        document.getElementById("linkPR").style.visibility = "visible";
                        document.getElementById("porukaPrijavljen").innerHTML = "";
                        document.getElementById("porukaPrijavljen").style.visibility = "hidden";
                        document.getElementById("central").style.visibility = "hidden";
                        document.getElementById("lijevi").style.visibility = "hidden";
                        clearRegistrationInput();
                        document.getElementById("username").focus();

                    }
                    else {
                        
                        alert("Korisnički email je već registriran.");
                        clearRegistrationInput();
                    }

                }
            }
            request.send(poruka);

        } else {
            alert("Problemi u radu servera, pokušajte kasnije.");
        }
    }

}


window.onload = function () {
    GetSessionNick();
}
