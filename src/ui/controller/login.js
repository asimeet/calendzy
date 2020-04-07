var formShow = function (id) {
    if (id == "sign-in-form") {
        document.getElementById("sign-up-form").hidden = true;
        document.getElementById("sign-up-tab").classList.remove('bg-info');
        document.getElementById("sign-in-tab").classList.add('bg-info');
    }
    if (id == "sign-up-form") {
        document.getElementById("sign-in-form").hidden = true;
        document.getElementById("sign-in-tab").classList.remove('bg-info');
        document.getElementById("sign-up-tab").classList.add('bg-info');
    }
    document.getElementById(id).hidden = false;
    document.getElementById("error-message").hidden = true;
}

var signIn = function () {
    let user = document.getElementById("sign-in-user").value;
    let pass = document.getElementById("sign-in-pass").value;
    if(user.trim()=='' || pass.trim()==''){
        let errMsg = document.getElementById("error-message")
        errMsg.innerHTML = `Please fill out all fields to proceed`;
        errMsg.hidden = false;
        return;
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (err, data) {
        if (this.readyState == 4 && this.status == 200) {
            createCookie('auth-token',this.response,1);
            window.location.pathname = '/home'
        }
        if (this.status != 200 && this.status != 0){
            //alert(this.statusText);
            let errMsg = document.getElementById("error-message")
            errMsg.innerHTML = this.statusText;
            errMsg.hidden = false;
            createCookie('auth-token','',1);
            this.abort();
        }
    };
    xhttp.open("POST", `/login/sign-in`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let body = JSON.stringify({
        user: user,
        password: pass
    })
    xhttp.send(body);
}

function createCookie(cookieName, cookieValue, daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

function accessCookie(cookieName) {
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for (var i = 0; i < allCookieArray.length; i++) {
        var temp = allCookieArray[i].trim();
        if (temp.indexOf(name) == 0)
            return temp.substring(name.length, temp.length);
    }
    return "";
}

function signUp(){
    let user = document.getElementById("sign-up-user").value;
    let pass = document.getElementById("sign-up-pass").value;
    let repass = document.getElementById("sign-up-repass").value;
    let email = document.getElementById("sign-up-email").value;
    if(user.trim()=='' || pass.trim()=='' || repass.trim()=='' || email.trim()==''){
        let errMsg = document.getElementById("error-message")
        errMsg.innerHTML = `Please fill out all fields to proceed`;
        errMsg.hidden = false;
        return ;
    }
    if(pass != repass){
        let errMsg = document.getElementById("error-message")
        errMsg.innerHTML = `Password Mistmatch`;
        errMsg.hidden = false;
        return;
    }
    if(pass.length < 6){
        let errMsg = document.getElementById("error-message")
        errMsg.innerHTML = `Password must of be minumum 6 characters`;
        errMsg.hidden = false;
        return;  
    }
    let validEmail = email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g);
    if(!validEmail){
        let errMsg = document.getElementById("error-message")
        errMsg.innerHTML = `In-valid email address`;
        errMsg.hidden = false;
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (err, data) {
        if (this.readyState == 4 && this.status == 200) {
            createCookie('auth-token',this.response,1);
            window.location.pathname = '/home'
        }
        if (this.status != 200 && this.status != 0){
            //alert(this.statusText);
            let errMsg = document.getElementById("error-message")
            errMsg.innerHTML = this.statusText;
            errMsg.hidden = false;
            createCookie('auth-token','',1);
            this.abort();
        }
    };
    xhttp.open("POST", `/login/sign-up`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let body = {
        user: user,
        password: pass,
        email: email
    }
    xhttp.send(JSON.stringify(body));
}

