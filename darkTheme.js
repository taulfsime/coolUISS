const buttonTexts = [ "Tъмна тема", "Светла тема" ];
let buttonDarkTheme;

function updateTheme(theme) {
	if(theme === "dark") {
		document.querySelector("html").classList.add("dark_theme");
		document.querySelector("body").classList.add("dark_theme");
		if(buttonDarkTheme) {
			buttonDarkTheme.innerHTML = buttonTexts[1];
		}
	}
	else {
		document.querySelector("html").classList.remove("dark_theme");
		document.querySelector("body").classList.remove("dark_theme");
		if(buttonDarkTheme) {
			buttonDarkTheme.innerHTML = buttonTexts[0];
		}
	}
}

function addButton() {
	let topbar = document.querySelector("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(3)");

	if(topbar) {
		if(topbar.childNodes.length > 1) {
			topbar.innerHTML += " || ";
		}	

		buttonDarkTheme = document.createElement("a");
		buttonDarkTheme.style.userSelect = "none";
		buttonDarkTheme.innerHTML = "";
		buttonDarkTheme.style.margin = "0px 5px";
		
		buttonDarkTheme.addEventListener("click", (e) => {
			e.preventDefault();
			
			chrome.storage.local.get("theme", (item) => { 
				if(item["theme"]) {
					let newTheme = (item["theme"] === "dark" ? "light" : "dark");
					chrome.storage.local.set({ "theme": newTheme }, () => {
						updateTheme(newTheme);
					});
				}
			});
		});
		
		topbar.appendChild(buttonDarkTheme);
		
		chrome.storage.local.get("theme", (item) => {
			if(item["theme"]) {
				updateTheme(item["theme"]);
			}
		});
	}
}

function init() {
	chrome.storage.local.get("theme", (item) => {
		if(item["theme"]) {
			updateTheme(item["theme"]);
		}
		else {
			chrome.storage.local.set({ "theme":"light" }, () => {
				updateTheme("light");
			});
		}
	});
}

window.addEventListener("load", () => {
	addButton();
});

init();