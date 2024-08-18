//==============================Form validation ==============
function sendMail(event){
    event.preventDefault();
    let parms = {
        name: document.getElementById("name").value,
        subject: document.getElementById("subject").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };
    emailjs.send("service_v12wbvn", "template_yqpoarr", parms).then(
        (res) => {
            alert("Email sent.", res.status, res.text);
            console.log("Email sent", res.status, res.text);
        }, (err) => {
            alert("Failed to send mail", err);
            console.log("Not sent", err);
        },
    );
};

//=========End======================