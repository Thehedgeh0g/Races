let user = {
    "email": null,
    "password": null,
    "avatar": null,
    "avatarName": null,
    "nickname": null
}

const readerAvatar = new FileReader();
let Loaded = false
const form = document.forms[0]
const submit = document.getElementById("submit")

submit.addEventListener("click",()=>
    {
        const formData = new FormData(form)
        user.email = formData.get("email-field")
        user.password = formData.get("password-field")
        user.nickname = formData.get("nickname-field")
        user.avatarName = formData.get("avatar-field").name
        readerAvatar.readAsDataURL(formData.get("avatar-field"))
        readerAvatar.addEventListener(
            "load",
            ()=>{
                console.log(readerAvatar.result)
                user.avatar = readerAvatar.result;
                console.log(user)
                Loaded = true
 
                if (verifyMailFormat(user.email) && Loaded){
                    let XHR = new XMLHttpRequest();
                    XHR.open("POST", "/api/registrate");
                    XHR.send(JSON.stringify(user));
                    XHR.onload = function() {
                        if (XHR.status != 200){
                            DataError();
                        }
                        else {
                            window.location.href = "/login"
                        }
                    }
                }
            },
            false
        );
        
        console.log(formData, user)
        
    }
)

function verifyMailFormat(email){
    if((email.includes('@') && (email.indexOf('@') == email.lastIndexOf('@'))) && 
    (email.includes('.') && (email.lastIndexOf('.') - email.indexOf('@') > 1)))
    {
        isEmailValid = true;
    }

    return isEmailValid
}

const hiddenUpload = document.getElementById("avatar-field");
const visibleUpload = document.getElementById("upload");
const ava = document.getElementById("ava");

visibleUpload.addEventListener("click", () => {
    hiddenUpload.click();
})

hiddenUpload.addEventListener("change", () => {
    console.log(hiddenUpload.value);

    const file = hiddenUpload.files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
      ava.src = e.target.result;
    }
    reader.readAsDataURL(file);

})

function GoToLogin() {
    window.location.href = "/login"
}