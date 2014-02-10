using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml;



namespace toDoPlan
{
    /// <summary>
    /// Servisi za spremanje izmjena napravljenih kroz korisničko sučelje JavaScriptom.
    /// Podaci se spremaju u XML datoteke. Kreiraju i sesijske varijable. 
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class updateListsXML : System.Web.Services.WebService
    {
        /// <summary>
        /// Odjava iz sustava, briše SESSION varijable nick, email, userid
        /// </summary>
        [WebMethod(EnableSession = true)]
        public void Odjava() {
            Session.RemoveAll();
        }
        /// <summary>
        /// Provjera dali je korisnik registriran u sustavu na osnovu emaila i lozinke,
        /// ako korisnik postoji kreira SESSION varijable nick i email,vraća ime korisnika
        /// </summary>
        /// <param name="name">email</param>
        /// <param name="pass">lozinka</param>
        /// <returns>true ili false</returns>
        [WebMethod (EnableSession = true)]
        public bool ProvjeriKorisnika(string name, string pass) {
            string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, "user.xml");

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(filePath);

            XmlNodeList username = xmlDoc.GetElementsByTagName("email");
            XmlNodeList password = xmlDoc.GetElementsByTagName("password");
            XmlNodeList nickname = xmlDoc.GetElementsByTagName("name");
            XmlNodeList userid = xmlDoc.GetElementsByTagName("userid");
            bool valid = false;
            for (int i = 0; i < username.Count; i++) {
                if ((username[i].ChildNodes[0].Value == name) && password[i].ChildNodes[0].Value == pass)
                {
                    
                    valid = true;
                    HttpContext.Current.Session["nick"] = nickname[i].ChildNodes[0].Value;
                    HttpContext.Current.Session["email"] = username[i].ChildNodes[0].Value;
                    HttpContext.Current.Session["userid"] = userid[i].ChildNodes[0].Value;
                    
                    
                    break;
                }

            }
            return valid;
        }
        /// <summary>
        /// Dohvaća vrijednost SESSION varijable nick (ime korisnika) i vraća je pozivatelju metode
        /// </summary>
        /// <returns>ime korisnika</returns>
        [WebMethod(EnableSession = true)]
        public string GetSessionNick() {
            string sessVariable ="";

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["nick"];
            }
            
            return sessVariable;
        }
        /// <summary>
        /// Dohvaća vrijednost SESSION varijable email i vraća je pozivatelju metode
        /// </summary>
        /// <returns>email</returns>
        [WebMethod(EnableSession = true)]
        public string GetSessionEmail()
        {
            string sessVariable = null;

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["email"];
            }

            return sessVariable;
        }
        /// <summary>
        /// Dohvaća vrijednost SESSION userid (jedinstveni broj korisnika) i vraća je pozivatelju metode
        /// </summary>
        /// <returns>jedinstveni broj korisnika</returns>
        [WebMethod(EnableSession = true)]
        public string GetSessionUserId()
        {
            string sessVariable = "false";

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["userid"];
            }

            return sessVariable;
        }
        
        /// <summary>
        /// Dodaje zadatak projektu
        /// </summary>
        /// <param name="taskName">ime zadatka</param>
        /// <param name="projName">ime projekta</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public bool AddTask(string taskName, string projName)
        {
            string imeXML = GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);

                XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                for (int i = 0; i < projekt.Count; i++)
                {
                    if (projekt[i].ChildNodes[0].Value == projName)
                    {
                        XmlNode task = projekt[i].NextSibling;
                        var novi = xmlDoc.CreateElement("item");
                        var noviText = xmlDoc.CreateTextNode(taskName);
                        novi.AppendChild(noviText);
                        task.AppendChild(novi);
                        xmlDoc.Save(filePath);
                        return true;
                    }
                }
            }

                return false;
        }
        /// <summary>
        /// Briše zadatak na projektu
        /// </summary>
        /// <param name="taskName">ime zadatka</param>
        /// <param name="parentId">id roditelja</param>
        /// <param name="projName">ime projekta</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public bool DeleteTask(string taskName, string parentId, string projName)
        {
            string imeXML = GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);
                if (parentId == "toDoItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    r.RemoveChild(r.ChildNodes[j]);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }
                else if (parentId == "doneItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    r.RemoveChild(r.ChildNodes[j]);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                else
                    return false;
            }
            else
                return false;
        }
        /// <summary>
        /// Metoda mijenja ime zadatka
        /// </summary>
        /// <param name="taskName">staro ime zadatka</param>
        /// <param name="newTaskName">novo ime zadatka</param>
        /// <param name="parentId">id roditelja</param>
        /// <param name="projName">ime projekta</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public bool RenameTask(string taskName, string newTaskName, string parentId, string projName)
        {
            string imeXML = GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);
                if (parentId == "toDoItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    //r.RemoveChild(r.ChildNodes[j]); 
                                    XmlNode noviE = xmlDoc.CreateElement("item");
                                    XmlNode noviT = xmlDoc.CreateTextNode(newTaskName);
                                    noviE.AppendChild(noviT);
                                    r.ReplaceChild(noviE, r.ChildNodes[j]);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }
                else if (parentId == "doneItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    //r.RemoveChild(r.ChildNodes[j]);
                                    XmlNode noviE = xmlDoc.CreateElement("item");
                                    XmlNode noviT = xmlDoc.CreateTextNode(newTaskName);
                                    noviE.AppendChild(noviT);
                                    r.ReplaceChild(noviE, r.ChildNodes[j]);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                else
                    return false;
            }
            else
                return false;

        }
        /// <summary>
        /// Briše cijeli projekt s svim zadacima
        /// </summary>
        /// <param name="projName">ime projekta</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public bool DeleteProject(string projName)
        {
            //string imeXML = "";
            string imeXML= GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);
                //Briše podatke u projektu
                XmlNodeList projektB = xmlDoc.GetElementsByTagName("name");
                for (int i = 0; i < projektB.Count; i++)
                {
                    if (projektB[i].ChildNodes[0].Value == projName)
                    {
                        var rod = projektB[i].ParentNode.ParentNode;
                        XmlNodeList liste = xmlDoc.GetElementsByTagName("lists");
                        liste[0].RemoveChild(liste[0].ChildNodes[i]);
                        xmlDoc.Save(filePath);

                        break;
                    }
                }
                //Briše u user.xml
                string filePathUser = Path.Combine(HttpRuntime.AppDomainAppPath, "user.xml");

                XmlDocument xmlDocUser = new XmlDocument();
                xmlDocUser.Load(filePathUser);
                XmlNodeList projektNameB = xmlDocUser.GetElementsByTagName("userid");
                for (int j = 0; j < projektNameB.Count; j++)
                {
                    if (projektNameB[j].ChildNodes[0].Value == imeXML)
                    {
                        var rod = projektNameB[j].ParentNode.ParentNode;
                        XmlNodeList listeUsera = xmlDocUser.GetElementsByTagName("lists");
                        for (var k = 0; k < listeUsera[j].ChildNodes.Count; k++)
                        {
                            if (listeUsera[j].ChildNodes[k].ChildNodes[0].Value == projName)
                            {

                                listeUsera[j].RemoveChild(listeUsera[j].ChildNodes[k]);
                                xmlDocUser.Save(filePathUser);
                                return true;
                            }

                        }

                        break;
                    }
                }

                return false;
            }
            else
                return false;
        }
        /// <summary>
        /// Metoda zamijenjuje ime projekta u user.xml i jedinstveni_broj_korisnika.xml
        /// </summary>
        /// <param name="novoIme">novo ime</param>
        /// <param name="staroIme">staro ime</param>
        /// <returns>true ili false</returns>
        [WebMethod(EnableSession = true)]
        public bool RenameProject(string novoIme, string staroIme)
        {
            //string imeXML = "";
            string imeXML = GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);
               
                XmlNodeList projektB = xmlDoc.GetElementsByTagName("name");
                for (int i = 0; i < projektB.Count; i++)
                {
                    if (projektB[i].ChildNodes[0].Value == staroIme)
                    {
                        //var rod = projektB[i].ParentNode.ParentNode;
                        //XmlNodeList liste = xmlDoc.GetElementsByTagName("lists");
                        
                        
                        //XmlNode novi = xmlDoc.CreateElement("name");                       
                        XmlNode noviT = xmlDoc.CreateTextNode(novoIme);
                        //novi.AppendChild(noviT);

                        projektB[i].ReplaceChild(noviT ,projektB[i].ChildNodes[0]);
                        xmlDoc.Save(filePath);
                        break;
                    }
                }
                //Mijenja ime u user.xml
                string filePathUser = Path.Combine(HttpRuntime.AppDomainAppPath, "user.xml");

                XmlDocument xmlDocUser = new XmlDocument();
                xmlDocUser.Load(filePathUser);
                XmlNodeList projektNameB = xmlDocUser.GetElementsByTagName("userid");
                for (int j = 0; j < projektNameB.Count; j++)
                {
                    if (projektNameB[j].ChildNodes[0].Value == imeXML)
                    {
                        var rod = projektNameB[j].ParentNode.ParentNode;
                        XmlNodeList listeUsera = xmlDocUser.GetElementsByTagName("lists");
                        for (var k = 0; k < listeUsera[j].ChildNodes.Count; k++)
                        {
                            if (listeUsera[j].ChildNodes[k].ChildNodes[0].Value == staroIme)
                            {
                                
                                XmlNode nt = xmlDocUser.CreateTextNode(novoIme);
                                listeUsera[j].ChildNodes[k].ReplaceChild(nt, listeUsera[j].ChildNodes[k].ChildNodes[0]);
                                xmlDocUser.Save(filePathUser);
                                return true;
                            }

                        }

                        break;
                    }
                }

                return false;
            }
            else
                return false;
        }

        /// <summary>
        /// Metoda mijenja status zadatka na projektu
        /// </summary>
        /// <param name="taskName">ime zadatka</param>
        /// <param name="parentId">id roditelja</param>
        /// <param name="projName">ime projekta</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public bool ChangeTaskStatus(string taskName, string parentId, string projName)
        {
            string imeXML = GetSessionUserId();
            if (imeXML != "false")
            {
                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, imeXML + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);
                if (parentId == "toDoItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    var cKlon = c.CloneNode(true);//kloniram node
                                    r.RemoveChild(r.ChildNodes[j]);//obrišem node
                                    var dItems = projekt[i].NextSibling.NextSibling;
                                    dItems.AppendChild(cKlon);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }
                else if (parentId == "doneItemList")
                {
                    XmlNodeList projekt = xmlDoc.GetElementsByTagName("name");
                    for (int i = 0; i < projekt.Count; i++)
                    {
                        if (projekt[i].ChildNodes[0].Value == projName)
                        {
                            XmlNodeList taskovi = projekt[i].NextSibling.NextSibling.ChildNodes;
                            for (int j = 0; j < taskovi.Count; j++)
                            {
                                if (taskovi[j].ChildNodes[0].Value == taskName)
                                {
                                    var r = taskovi[j].ParentNode;
                                    var c = r.ChildNodes[j];
                                    var cKlon = c.CloneNode(true);//kloniram node
                                    r.RemoveChild(r.ChildNodes[j]);
                                    var oItems = projekt[i].NextSibling;
                                    oItems.AppendChild(cKlon);
                                    xmlDoc.Save(filePath);
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                else
                    return false;
            }
            else
                return false;
        }
        /// <summary>
        /// Registracija novog korisnika, unos podataka u user.xml, pod uvijetom da već ne postoji korisnik
        /// s registriranim email-om
        /// </summary>
        /// <param name="korIme">ime korisnika</param>
        /// <param name="email">email</param>
        /// <param name="lozinka">lozinka</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public string RegistracijaKorisnika(string korIme, string email, string lozinka)
        {
            string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, "user.xml");

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(filePath);
            bool valid = true;
            XmlNodeList useri = xmlDoc.GetElementsByTagName("email");
            for (var i = 0; i < useri.Count; i++) {
                if (useri[i].ChildNodes[0].Value == email)
                {
                    valid = false;
                    break;
                }
            }
            if(valid){
                XmlNode user = xmlDoc.CreateElement("user");
            
                XmlNode name = xmlDoc.CreateElement("name");
                XmlNode nameT = xmlDoc.CreateTextNode(korIme);
                name.AppendChild(nameT);
            
                //nadji zadnjeg usera
                XmlNodeList id= xmlDoc.GetElementsByTagName("userid");
                var broj = id.Count;
                XmlNode userid = xmlDoc.CreateElement("userid");
                XmlNode useridT = xmlDoc.CreateTextNode((broj+1).ToString());
                userid.AppendChild(useridT);
            
                XmlNode password = xmlDoc.CreateElement("password");
                XmlNode passwordT = xmlDoc.CreateTextNode(lozinka);
                password.AppendChild(passwordT);
                XmlNode emailK = xmlDoc.CreateElement("email");
                XmlNode emailT = xmlDoc.CreateTextNode(email);
                emailK.AppendChild(emailT);

                XmlNode lists = xmlDoc.CreateElement("lists");
                XmlNode listsT = xmlDoc.CreateTextNode("");
                lists.AppendChild(listsT);

                user.AppendChild(name);
                user.AppendChild(userid);
                user.AppendChild(password);
                user.AppendChild(emailK);
                user.AppendChild(lists);

                XmlNodeList svi = xmlDoc.GetElementsByTagName("users");
                svi[0].AppendChild(user);
                xmlDoc.Save(filePath);
                //kreira xml za projekte

                broj = broj + 1;

                XmlDocument xmlDocProjekt = new XmlDocument();
                XmlNode projektListe = xmlDocProjekt.CreateElement("lists");
                XmlNode projektListeT = xmlDocProjekt.CreateTextNode("");
                projektListe.AppendChild(projektListeT);
                xmlDocProjekt.AppendChild(projektListe);

                xmlDocProjekt.Save(Path.Combine(HttpRuntime.AppDomainAppPath, broj.ToString() + ".xml"));
                return "ok";
            }
            return "not";
        }
        //

        /// <summary>
        /// Korisnik kreira novi projekt, te se naziv projekta snima u 
        /// user.xml (kako bi znali kojem korisniku pripada koji projekt)
        /// i u XML datoteku koja se odnosi na projekte specificiranog korisnika
        /// </summary>
        /// <param name="name">Ime projekta</param>
        /// <returns></returns>
        [WebMethod (EnableSession = true)]
        public bool UpdateXML(string name) 
        {
            //###########################################################
            //Snimanje u lists.xml
            //###########################################################
            if (Session["email"] != null)
            {
                var sessUserId = "";
                sessUserId = (string)Session["userid"];

                string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, sessUserId + ".xml");

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(filePath);

                XmlNode lists = xmlDoc.GetElementsByTagName("lists")[0];
                XmlNode list = xmlDoc.CreateElement("list");
                XmlNode listName = xmlDoc.CreateElement("name");
                XmlText t = xmlDoc.CreateTextNode(name);
           
                XmlNode oItems = xmlDoc.CreateElement("openitems");
                XmlNode dItems = xmlDoc.CreateElement("doneitems");
                XmlNode oText = xmlDoc.CreateTextNode("");
                XmlNode dText = xmlDoc.CreateTextNode("");
                oItems.AppendChild(oText);
                dItems.AppendChild(dText);
                listName.AppendChild(t);
                list.AppendChild(listName);
                list.AppendChild(oItems);
                list.AppendChild(dItems);
                lists.AppendChild(list);

                xmlDoc.Save(filePath);
            }
            //###########################################################
            //Snimanje u user.xml
            //###########################################################
            
            if (Session["email"] != null)
            {
                string filePathUser = Path.Combine(HttpRuntime.AppDomainAppPath, "user.xml");

                XmlDocument xmlDocUser = new XmlDocument();
                xmlDocUser.Load(filePathUser);

                string korisnik = (string)(Session["email"]);

                XmlNodeList korisnici = xmlDocUser.GetElementsByTagName("email");
                var rb = 0;
                for (int k = 0; k < korisnici.Count; k++)
                {
                    if (korisnik == korisnici[k].ChildNodes[0].Value)
                    {
                        rb = k;
                        break;
                    }
                }

                XmlNode listsUser = xmlDocUser.GetElementsByTagName("lists")[rb];
                XmlNode listUser = xmlDocUser.CreateElement("list");
                XmlText tUser = xmlDocUser.CreateTextNode(name);

                listUser.AppendChild(tUser);
                listsUser.AppendChild(listUser);
                xmlDocUser.Save(filePathUser);

                return true;
            }
            return false;
        }
    }
}
