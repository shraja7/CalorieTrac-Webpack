import Storage from "./Storage";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    //display calorie limit
    this._displayCaloriesLimit();
    //display total calories
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").value = this._calorieLimit;
  }
  //public methods/api //
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    //local storage update
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    //find index of meal want to remove with id
    const index = this._meals.findIndex((meal) => meal.id === id);
    //check it's a match
    if (index !== -1) {
      //remove meal from array
      const meal = this._meals[index];
      //subtract calories from total calories
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      //remove meal from UI
      Storage.removeMeal(id);
      //render
      this._render();
    }
  }

  removeWorkout(id) {
    //find index of meal want to remove with id
    const index = this._workouts.findIndex((workout) => workout.id === id);
    //check it's a match
    if (index !== -1) {
      //remove workout from array
      const workout = this._workouts[index];
      //subtract calories from total calories
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      //remove meal from UI
      Storage.removeWorkout(id);
      //render
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  //load items
  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  //private methods//
  _displayCaloriesTotal() {
    const totalCaloriesEl = document.querySelector("#calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const calorieLimitEl = document.querySelector("#calories-limit");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.querySelector("#calories-consumed");
    const consumed = this._meals.reduce((acc, meal) => {
      return acc + meal.calories;
    }, 0);
    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.querySelector("#calories-burned");
    const burned = this._workouts.reduce((acc, workout) => {
      return acc + workout.calories;
    }, 0);
    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.querySelector("#calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;
    const progressEl = document.querySelector("#calorie-progress");

    if (remaining < 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      //make progress bar red
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
      //progress bar green
      progressEl.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
    }
  }
  _displayCaloriesProgress() {
    const progressEl = document.querySelector("#calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }
  _displayNewMeal(meal) {
    //element where to store/display meal
    const mealsEl = document.querySelector("#meal-items");
    const mealEl = document.createElement("div");
    //add classes to meal element
    mealEl.classList.add("row", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
      <div class="card-body ">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                      class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                      ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
      </div>
          
                `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    //element where to store/display meal
    const workoutEl = document.createElement("div");
    const workoutsEl = document.querySelector("#workout-items");
    //add classes to meal element
    workoutEl.classList.add("row", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `
      <div class="card-body ">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                      class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                      ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
      </div>
          
                `;

    workoutsEl.appendChild(workoutEl);
  }

  //render method to display meals and workouts
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

//export
export default CalorieTracker;
