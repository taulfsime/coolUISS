let loginForm = document.querySelector("#studlogin");
let loginData_1 = loginForm.querySelector("#egn");
let loginData_2 = loginForm.querySelector("#fn");

let saveLoginRow = document.createElement("tr");

let checkboxTd = document.createElement("td");
let saveLoginRowCheckbox = document.createElement("input");
saveLoginRowCheckbox.type = "checkbox";
saveLoginRowCheckbox.style.marginLeft = "80%";
saveLoginRowCheckbox.addEventListener("change", (e) => {
    if(e.target.checked) {
        if (!confirm("coolUISS\n\nС пускането на тази опция даватe съгласие данните ви за вход да бъдат съхранени локално на компютъра!\nПри изключването на опцията данните ще бъдат изтрити!")) {
            e.target.checked = !e.target.checked;
        }
    }
    else {
        chrome.storage.local.remove(["save","d1", "d2"], () => {
            alert("Данните за вход бяха изтрити!");
        });
    }

    chrome.storage.local.set({ "save": e.target.checked });
});
chrome.storage.local.get("save", (item) => {
    if(item["save"]) {
        saveLoginRowCheckbox.checked = true; 
    }
});
checkboxTd.appendChild(saveLoginRowCheckbox);

let textTd = document.createElement("td");
textTd.innerHTML = "Запазване на входните данни";
//textTd.noWrap = true;

saveLoginRow.appendChild(checkboxTd);
saveLoginRow.appendChild(textTd);

let table = loginForm.querySelector("table tbody");
table.insertBefore(saveLoginRow, table.childNodes[5]);

window.addEventListener("load", (e) => {
    chrome.storage.local.get(["save", "d1", "d2"], (item) => {
        if(item["save"]) {
            loginData_1.value = atob(item["d1"]);
            loginData_2.value = atob(item["d2"]);
        }
    });
});

loginForm.addEventListener("submit", (e) => {
    chrome.storage.local.set({ "d1":btoa(loginData_1.value) });
    chrome.storage.local.set({ "d2":btoa(loginData_2.value) });
});