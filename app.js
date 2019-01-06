const addMeal = document.getElementById("add-meal");
const clearAll = document.getElementById("clear-all");
const meal = document.querySelector(".meal");
const calories = document.querySelector(".calories");
const foodList = document.getElementById("foodList");
const totalCalories = document.getElementById("totalCalories");

let totalCals = 0;
let foodItems = [];

class foodItem {
	constructor(name, calories) {
		this.name = name;
		this.calories = calories;
	}
}

if (localStorage.getItem("Food") == null) {
	foodItems = [];
} else {
	foodItems = JSON.parse(localStorage.getItem("Food"));

	updateList();
}

addMeal.addEventListener("click", () => {
	if (meal.value != "" && calories.value != "") {
		let newFoodItem = new foodItem(meal.value, calories.value);
		foodItems.push(newFoodItem);

		updateList();
	}
});

function updateList() {
	totalCals = 0;
	let counter = 0;
	foodList.innerHTML = "";
	foodItems.forEach(item => {
		totalCals += parseInt(item.calories);
		foodList.innerHTML += `<li class="list-group-item" id = "${counter}">${
			item.name
		}: ${
			item.calories
		} Calories <a href= "#"><i  class="fas fa-edit float-right edit"></i></a></li>`;
		counter++;
	});
	localStorage.setItem("Food", JSON.stringify(foodItems));
	totalCalories.innerHTML = `Total Calories: ${totalCals}`;
	meal.value = "";
	calories.value = "";
	edit();
}

clearAll.addEventListener("click", clear);

function clear() {
	localStorage.clear();
	foodItems = [];
	updateList();
}

// State pattern
const PageState = function() {
	let currentState = new homeState(this);

	this.init = function() {
		this.change(new homeState());
	};
	this.current = () => {
		return currentState;
	};
	this.change = function(state) {
		currentState = state;
	};
};

// Home State
const homeState = function(page) {
	document
		.querySelector("#add-meal")
		.setAttribute("class", "btn btn-primary text-light mt-3");
	document
		.querySelector("#update-meal")
		.setAttribute("class", "btn btn-warning text-light mt-3 d-none");
	document
		.querySelector("#delete-meal")
		.setAttribute("class", "btn btn-danger text-light mt-3 d-none");
	document
		.querySelector("#back-to-home")
		.setAttribute(
			"class",
			"btn btn-secondary text-light mt-3 float-right d-none"
		);
};

// Edit state
const editState = function(page) {
	document
		.querySelector("#add-meal")
		.setAttribute("class", "btn btn-primary text-light mt-3 d-none");
	document
		.querySelector("#update-meal")
		.setAttribute("class", "btn btn-warning text-light mt-3 ");
	document
		.querySelector("#delete-meal")
		.setAttribute("class", "btn btn-danger text-light mt-3 ");
	document
		.querySelector("#back-to-home")
		.setAttribute("class", "btn btn-secondary text-light mt-3 float-right");
};

// Instantiate pageState

const page = new PageState();

// Init the first state
page.init();

// Back to home button
document.querySelector("#back-to-home").addEventListener("click", e => {
	page.change(new homeState());
	updateList();

	e.preventDefault();
});

function edit() {
	let editButtons = document.querySelectorAll(".edit");
	editButtons.forEach(item => {
		item.addEventListener("click", e => {
			let itemPosition = e.target.parentElement.parentElement.getAttribute(
				"id"
			);
			page.change(new editState());
			document.querySelector("#update-meal").addEventListener("click", () => {
				console.log("hi");
				foodItems[itemPosition].name = meal.value;
				foodItems[itemPosition].calories = calories.value;
				meal.value = "";
				calories.value = "";
				page.change(new homeState());
				updateList();
			});
			document.querySelector("#delete-meal").addEventListener("click", () => {
				foodItems.splice(itemPosition, 1);
				console.log("hi");
				meal.value = "";
				calories.value = "";
				page.change(new homeState());
				updateList();
			});
		});
	});
}
