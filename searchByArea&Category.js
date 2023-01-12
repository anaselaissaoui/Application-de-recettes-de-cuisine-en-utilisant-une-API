open();
/*---------------------------------fill the select inputs function------------------------------------*/
function open() {
  // fill the select input with the areas list
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then((response) => response.json())
    .then((data) => {
      let areas;

      data.meals.reverse().forEach((meal) => {
        if (meal.strArea == "Moroccan") {
          areas =
            "<option value='" +
            meal.strArea +
            "' selected>" +
            meal.strArea +
            "</option>";
        } else {
          areas =
            "<option value='" +
            meal.strArea +
            "'>" +
            meal.strArea +
            "</option>";
        }

        document
          .getElementById("areaSelection")
          .insertAdjacentHTML("afterbegin", areas);
      });
    });

  // fill the select input with the categories list

  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then((response) => response.json())
    .then((data) => {
      let category;
      data.meals.reverse().forEach((meal) => {
        if (meal.strCategory == "Lamb") {
          category =
            "<option value='" +
            meal.strCategory +
            "' selected>" +
            meal.strCategory +
            "</option>";
        } else {
          category =
            "<option value='" +
            meal.strCategory +
            "'>" +
            meal.strCategory +
            "</option>";
        }

        document
          .getElementById("categorySelection")
          .insertAdjacentHTML("afterbegin", category);
      });
    });
}

/*------------------------------------removing childs function------------------------------------*/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*------------------------------------Filtration function------------------------------------*/

async function filterMeals() {
  var categorySelection = document.getElementById("categorySelection");
  var areaSelection = document.getElementById("areaSelection");

  var selectedCategory =
    categorySelection.options[categorySelection.selectedIndex].value;
  var selectedArea = areaSelection.options[areaSelection.selectedIndex].value;
  removeAllChildNodes(selectedResult);
  if (selectedCategory === "" && selectedArea !== "") {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
    )
      .then((response) => response.json())
      .then((areaf) => {
        removeAllChildNodes(selectedResult);
        renderPaginatedMeals(6, areaf.meals);
      });
  } else if (selectedCategory !== "" && selectedArea === "") {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
    )
      .then((response) => response.json())
      .then((cateF) => {
        removeAllChildNodes(selectedResult);
        renderPaginatedMeals(6, cateF.meals);
      });
  } else if (selectedCategory !== "" && selectedArea !== "") {
    const [a, b] = await Promise.all([
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
      ),
      fetch(
        ` https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      ),
    ]);

    const [areaF, cateF] = await Promise.all([a.json(), b.json()]);
    const areaFMeals = areaF.meals;
    const cateFMeals = cateF.meals;
    const mergedMeals = [];
    for (let i = 0; i < areaFMeals.length; i++) {
      for (let j = 0; j < cateFMeals.length; j++) {
        if (areaFMeals[i].idMeal == cateFMeals[j].idMeal) {
          mergedMeals.push(areaFMeals[i]);
        }
      }
    }

    removeAllChildNodes(selectedResult);
    renderPaginatedMeals(6, mergedMeals);
  }
}

//Modal function----------------------------------------------------------------

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
    "<img  src=" +
    meal.strMealThumb +
    " id='mealPic' class='img-thumbnail rounded-4 d-flex justify-content-center px-20%' style='height:250px;'>" +
    "<br>" +
    "<h4>Category:&nbsp" +
    meal.strCategory +
    "</h4>" +
    "<h4>Area:&nbsp" +
    meal.strArea +
    "</h4>" +
    "<h4>Ingredients:</h4>" +
    "<ul class='ms-5' id='ulModal'>" +
    Ingredients +
    "</ul>" +
    "<h4>Instructions:&nbsp</h4>" +
    "<p class='mx-3'>" +
    meal.strInstructions +
    "</p>" +
    "</div></div></div></div>";

  selectedResult.insertAdjacentHTML("afterend", html);

  document.querySelector(".btn-close").addEventListener("click", () => {
    document.getElementById("exampleModal").style.display = "none";
  });
}

function renderPaginatedMeals(pageSize, dataSource) {
  $("#pagination-container").pagination({
    dataSource: dataSource,
    pageSize: pageSize,
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
        $("#selectedResult").html(html);
      }
    },
  });
}
