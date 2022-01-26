let table = document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td > table");

table.style.left = "50%";
table.style.position = "relative";

const gradeTexts = [ "слаб", "среден", "добър", "мн.добър" , "отличен"];
const colorRed = "#b82e2e";
const gradeColors = [
						colorRed,
						"#c7c938",
						"#8aa9d1",
						"#de9343",
						"#6ec27c"
					];

function getGrade(text) {
	let findGrade = text.indexOf("(");
	
	if(findGrade > 0) {
		return parseInt(text.charAt(findGrade + 1));
	}
}

function updateGradeColors() {
	for(let g of table.querySelectorAll(".grade")) {
		let grade = getGrade(g.innerHTML);
		
		if(grade) {
			let checkColorGrades = document.querySelector("#grade_color");
			if(checkColorGrades.checked) {			
				g.style.backgroundColor = gradeColors[grade - 2];
				g.style.color = "white";
			}
			else {
				if(grade == 2) {
					g.style.backgroundColor = gradeColors[0];
					g.style.color = "white";
				}
				else {
					g.style.color = "";
					g.style.backgroundColor = "";
				}
			}
		}
	}
}

function init() {
	if(table.classList.contains("init")) {
		return;
	}
	else {
		table.classList.add("init");
	}
	
	let rows = table.querySelectorAll("tr");
	let add = [];
	let gradeCount = 0;
	let gradeMustHaveCount = 0;
	let gradeSum = 0;

	//skip the first one
	for(let i = 1; i < rows.length; i++) {
		if(rows[i].childNodes.length > 3) {
			if(rows[i].childNodes[2].innerHTML !== "&nbsp;Няма&nbsp;") {
				rows[i].childNodes[3].classList.add("grade");
				rows[i].classList.add("row_grade");
				
				if(rows[i].childNodes[3].innerHTML === "&nbsp;-&nbsp;") {
					rows[i].style.backgroundColor = colorRed;
					rows[i].style.color = "white";
					rows[i].style.fontWeight = "bold";
				}
				else {
					let grade = getGrade(rows[i].childNodes[3].innerHTML);
					
					if(grade > 0) {
						gradeSum += grade;
						gradeCount += 1;
					}
				}
				
				gradeMustHaveCount += 1;
			}

			if(rows[i].childNodes[2].innerHTML === "&nbsp;Изпит&nbsp;" && rows[i].childNodes[3].innerHTML === "&nbsp;-&nbsp;") {
				rows[i].childNodes[2].innerHTML = "";
				let inputDate = document.createElement("input");
				inputDate.type = "date";

				rows[i].childNodes[2].appendChild(inputDate);
				rows[i].childNodes[2].classList.add("exam_date");
			}
		}
		else {
			add.push({ index: i, count: gradeCount, total: gradeMustHaveCount, sum: gradeSum });
			gradeCount = 0;
			gradeMustHaveCount = 0;
			gradeSum = 0;
		}
	}
	
	for(let sp of table.querySelectorAll("tr .subtitle span")) {
		sp.style.color = colorRed;
	}

	for(let i = add.length - 1; i > 0; i--) {
		//spacing row
		var r = table.insertRow(add[i].index);
		var c = r.insertCell(0);
		c.colSpan = "5";
		r.style.backgroundColor = "lightgray";
		r.classList.add("spacing");
		
		//information row
		r = table.insertRow(add[i].index);
		r.align = "center";
		
		c = r.insertCell(0);
		c.colSpan = "5";
		c.classList.add("subtitle");
		
		let showGrade = add[i].sum / add[i].count;
		c.innerHTML = "";
		c.innerHTML += "Брой оценки за този семестър са " + add[i].count + " от общо " + add[i].total + "</br>";

		if(showGrade) {
			c.innerHTML += "Среден успех за <span style='text-decoration:underline;font-size:12px;color:green'>семестър " + i + "</span> е " + gradeTexts[Math.round(showGrade) - 2] + "(" + showGrade.toFixed(2) + ")";
		}
		else {
			c.innerHTML += "Няма въведени оценки за <span style='text-decoration:underline;font-size:12px;color:green'>семестър " + i + "</span>";
		}
	}
	
	//add options
	let options = table.insertRow(0).insertCell(0);
	options.colSpan = "5";

	let checkColorGrades = document.createElement("input");
	checkColorGrades.id = "grade_color";
	checkColorGrades.type = "checkbox";
	options.appendChild(checkColorGrades);

	checkColorGrades.addEventListener("change", (e) => { updateGradeColors(); });

	let labelColorGrades = document.createElement("label");
	labelColorGrades.htmlFor = "grade_color";
	labelColorGrades.style.userSelect = "none";
	labelColorGrades.innerHTML = "Филтър на оценки";
	options.appendChild(labelColorGrades);
}

init();
updateGradeColors();