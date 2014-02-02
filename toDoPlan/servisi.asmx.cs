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
    /// Summary description for servisi
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
        /// ako korisnik postoji kreira SESSION varijable nick i email,
        /// vraća ime korisnika
        /// </summary>
        /// <param name="name">Email - korisničko ime</param>
        /// <param name="pass">Lozinka</param>
        /// <returns>true or false</returns>
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
                    //Session["nick"] = nickname[i].ChildNodes[0].Value;
                    HttpContext.Current.Session["nick"] = nickname[i].ChildNodes[0].Value;
                    HttpContext.Current.Session["email"] = username[i].ChildNodes[0].Value;
                    HttpContext.Current.Session["userid"] = userid[i].ChildNodes[0].Value;
                    
                    
                    break;
                }

            }
            return valid;
        }

        [WebMethod(EnableSession = true)]
        public string GetSessionNick() {
            string sessVariable ="";

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["nick"];
            }
            
            return sessVariable;
        }

        [WebMethod(EnableSession = true)]
        public string GetSessionEmail()
        {
            string sessVariable = "";

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["email"];
            }

            return sessVariable;
        }
        [WebMethod(EnableSession = true)]
        public string GetSessionUserId()
        {
            string sessVariable = "";

            if (Session["email"] != null && Session["nick"] != null)
            {
                sessVariable = (string)Session["userid"];
            }

            return sessVariable;
        }

        /// <summary>
        /// Korisnik kreira novi projekt, te se naziv projekta snima u 
        /// 1. user.xml (kako bi znali kojem korisniku pripada koji projekt)
        /// 2. lists.xml (projekti i njihovi taskovi)
        /// </summary>
        /// <param name="name">Ime projekta</param>
        /// <returns></returns>
        [WebMethod (EnableSession = true)]
        public string UpdateXML(string name) 
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
                listName.AppendChild(t);
                list.AppendChild(listName);
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

                return "Kreiran je projekt: " + name;
            }
            return "Niste logirani.";
        }
    }
}
