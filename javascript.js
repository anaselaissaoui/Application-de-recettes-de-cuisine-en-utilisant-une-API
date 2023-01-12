var result = document.getElementById("randomCards");
var searchBtn = document.getElementById("searchBtn");
var cardsResult = document.getElementById("cardsResult");
var userInput = document.getElementById("userInput");

userInput.addEventListener("input", searchFunct);

for (let i = 0; i < 6; i++) {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((response) => response.json())
    .then((data) => {
      data.meals.forEach((meal) => {
        var html;
        html =
          "<div class = 'card text-center col-lg-3 col-md-5 cold-sm-10 m-1 ' id='cardsHere'     style='background-color: rgb(255,33,79, 0.4)'>" +
          "<img src=" +
          meal.strMealThumb +
          " class='card-img-top img-fluid mx-0 '>" +
          "<div class='card-body'><h6 class='card-title text-light' style='min-height:59px;'>" +
          meal.strMeal +
          "</h6>" +
          "<a href='#' class='show btn btn-primary border-light mb-0 w-75' data-bs-toggle='modal data-bs-target='#exampleModal' style='background-color: rgb(255,33,79)' id='" +
          meal.idMeal +
          "' onclick ='linkdetails(" +
          meal.idMeal +
          ")' >Details</a>" +
          "</div></div>";

        cardsResult.insertAdjacentHTML("afterbegin", html);
      });
    });
}

function searchFunct() {
  let searchMatch = userInput.value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMatch}`)
    .then((response) => response.json())
    .then((dataSearching) => {
      while (cardsResult.hasChildNodes())
        cardsResult.removeChild(cardsResult.firstChild);

      // if (data.meals) {
      //   data.meals.forEach((meal) => {
      //     html =
      //       "<div class = 'card text-center col-lg-3 col-md-5 cold-sm-10 m-1 ' id='cardsHere'     style='background-color: rgb(255,33,79, 0.4)'>" +
      //       "<img src=" +
      //       meal.strMealThumb +
      //       " class='card-img-top img-fluid mx-0 '>" +
      //       "<div class='card-body'><h6 class='card-title text-light' style='min-height:59px;'>" +
      //       meal.strMeal +
      //       "</h6>" +
      //       "<a href='#' class='show btn btn-primary border-light mb-0 w-75' data-bs-toggle='modal data-bs-target='#exampleModal' style='background-color: rgb(255,33,79)' id='" +
      //       meal.idMeal +
      //       "' onclick ='linkdetails(" +
      //       meal.idMeal +
      //       ")' >Details</a>" +
      //       "</div></div>";

      //     cardsResult.insertAdjacentHTML("afterbegin", html);
      //   });
      // }

      $("#pagination-container").pagination({
        dataSource: dataSearching.meals,
        pageSize: 6,
        callback: function (data) {
          let html = "";

          for (let i = 0; i < data.length; i++) {
            html +=
              "<div class='card text-center col-lg-3 col-md-5 cold-sm-10 m-1' id='cardsHere'   style='background-color: rgb(255,33,79, 0.4)'>" +
              "<img src=" +
              data[i].strMealThumb +
              " class='card-img-top img-fluid mx-0'>" +
              "<div class='card-body'><h6 class='card-title text-light' style='min-height:59px;'>" +
              data[i].strMeal +
              "</h6>" +
              "<a href='#' class='show btn btn-primary border-light mb-0 w-75' data-bs-toggle='modal data-bs-target='#exampleModal' style='background-color: rgb(255,33,79)' id='" +
              data[i].idMeal +
              "' onclick ='linkdetails(" +
              data[i].idMeal +
              ")' >Details</a>" +
              "</div></div>";
          }

          if (html) {
            $("#cardsResult").html(html);
          }
        },
      });
    });
}

function linkdetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((idData) => receipeModal(idData.meals));
}

function receipeModal(meal) {
  meal = meal[0];
  let count = 1;
  let Ingredients = "";

  for (let i in meal) {
    console.log(meal["strIngredient" + count]);
    while (meal["strIngredient" + count] !== "") {
      Ingredients += "<li>" + meal["strIngredient" + count] + "</li>";
      count++;
    }
  }

  let html =
    "<div class='modal fade' aria-labelledby='exampleModalLabel' id='exampleModal' tabindex='-1' style='display:flex; opacity:1; aria.hidden='true'><div class='modal-dialog modal-dialog-centered modal-dialog-scrollable'>" +
    "<div class='modal-content'><div class='modal-header'><h1 class='modal-title fs-5' id='exampleModalLabel'>" +
    meal.strMeal +
    "</h1>" +
    "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div>" +
    "<div class='modal-body'>" +
    "<img src=" +
    meal.strMealThumb +
    " class='img-thumbnail ' style='height:200px;'>" +
    "<h4>Category:&nbsp" +
    meal.strCategory +
    "</h4>" +
    "<h4>Area:&nbsp" +
    meal.strArea +
    "</h4>" +
    "<h4>Ingredients:</h4>" +
    "<ul class='ms-5'id='ulModal'>" +
    Ingredients +
    "</ul>" +
    "<h4>Instructions:&nbsp</h4>" +
    "<p class='mx-3'>" +
    meal.strInstructions +
    "</p>" +
    "</div></div></div></div>";

  document.getElementById("searchResult").insertAdjacentHTML("afterend", html);

  document.querySelector(".btn-close").addEventListener("click", () => {
    document.getElementById("exampleModal").style.display = "none";
  });
}
