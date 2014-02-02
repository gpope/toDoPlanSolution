<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="test.aspx.cs" Inherits="toDoPlan.test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>TODO</title>
    <script src="Scripts/toDoPlanLibrary.js"></script>
</head>
<body>
     <div id ="container">
        <header>
            <form runat="server" id="frmlogin" name="frmlogin" method="post" action="javascript:login()" >
                <asp:Label ID="luser" runat="server" Text="Korisničko ime:"></asp:Label><asp:TextBox ID="username" runat="server"></asp:TextBox>
                <asp:Label ID="lpass" runat="server" Text="Lozinka:"></asp:Label><asp:TextBox ID="password" runat="server"></asp:TextBox>
                <asp:Button ID="login" runat="server" Text="Prijava" />
            </form>
        </header>
            
        <div role="main">

        </div>
        <footer></footer>
    </div>
</body>
</html>
