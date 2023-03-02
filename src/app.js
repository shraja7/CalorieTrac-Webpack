import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import "./css/bootstrap.css";
import "./css/style.css";

//imports
import CalorieTracker from "./Tracker";
import { Meal, Workout } from "./Item";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  //event listeners
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    //get reset button
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    //get limit form
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    //validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
    }
    //if type is meal or workout
    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.querySelector(`#collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("fa-xmark") ||
      e.target.classList.contains("delete")
    ) {
      if (confirm("Are you sure?")) {
        //get data-id
        const id = e.target.closest(".row").getAttribute("data-id");
        console.log("id: ", id);
        //reomve meal or workout using ternary
        type === "workout"
          ? this._tracker.removeWorkout(id)
          : this._tracker.removeMeal(id);
        //remove the item from the dom
        e.target.closest(".row").remove();
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .row`).forEach((item) => {
      const name = item.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    if (confirm("Are you sure?")) {
      this._tracker.reset();
      document.getElementById("meal-items").innerHTML = "";
      document.getElementById("workout-items").innerHTML = "";
      document.getElementById("filter-meals").value = "";
      document.getElementById("filter-workouts").value = "";
    }
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");
    if (limit.value === "") {
      alert("Please enter a limit");
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = "";

    //close modal
    const modal = document.getElementById("limit-modal");
    const bsModal = Modal.getInstance(modal);
    bsModal.hide();
  }
}

const app = new App();
