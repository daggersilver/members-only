var showpass = document.querySelector(".show");
var pass = document.querySelector("input[type='password']")

showpass.addEventListener("click", ()=>{
    if(pass.type=="password"){
        pass.type = "text";
        return;
    }
    pass.type = "password";
})