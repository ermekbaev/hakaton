let API = "http://localhost:8001/twitter";

let user = document.querySelector("#user");
let password = document.querySelector("#pass");
let btn = document.querySelector(".btn");
console.log(user);
console.log(password);
console.log(btn);
btn.addEventListener("click", () => {
  let obj = {
    user: user.value,
    pass: password.value,
  };
  //   console.log(obj);

  if (!obj.user.trim() || !obj.pass.trim()) {
    alert`Please fill in all required fields`;
    return;
  }

  let email = "admin";
  let pass = "admin";

  if (user.value == email && password.value == pass) {
  } else {
    alert`Validation is error`;
  }
});
