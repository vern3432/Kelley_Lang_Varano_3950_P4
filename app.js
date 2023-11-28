function updateFill_complete() {
  console.log("rnning fill complete");
  const author1 = document.getElementById("author").value;
  var checkForUnique = [];
  if (author1.length > 1) {
    console.log(author1);
    var searchtype = "Book_Author";
    fetch("http://localhost:3001/updateFillcomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author1: author1,
        type: searchtype,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        var author2 = document.getElementById("author2");
        var buttoncounter = 1;
        author2.innerHTML = "";
        data.forEach((row) => {
          if (!checkForUnique.includes(row.Book_Author.toUpperCase())) {
            checkForUnique.push(row.Book_Author.toUpperCase());

            console.log(row.Book_Author);
            var option = document.createElement("option");
            option.value = row.Book_Author;
            option.innerHTML = row.Book_Author;
            author2.appendChild(option);
          }
        });
        loadYearsAdvanced() 
      })
      .catch((error) => console.log("Error fetching data: ", error));
  }
}

function loadYearsAdvanced() {
  console.log("rnning fill years column");
  const author1 = document.getElementById("author").value;
  var checkForUnique = [];
  if (author1.length > 1) {
    console.log(author1);
    var searchtype = "Year_Of_Publication";
    fetch("http://localhost:3001/loadYearsAdvanced", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author1: author1,
        type: searchtype,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        var year = document.getElementById("year");
        var buttoncounter = 1;
        year.innerHTML = "";
        var option = document.createElement("option");
        year.appendChild(option);
        data.forEach((row) => {
            console.log("row value"+row)
          if (!checkForUnique.includes(row.Year_Of_Publication.toUpperCase())) {
            checkForUnique.push(row.Year_Of_Publication.toUpperCase());
            console.log(row.Year_Of_Publication);
            var option = document.createElement("option");
            option.value = row.Year_Of_Publication;
            option.innerHTML = row.Year_Of_Publication;
            year.appendChild(option);
          }
        });
      })
      .catch((error) => console.log("Error fetching data: ", error));
  }
}

function submitAdvanced(num_start) {

if(document.getElementById("breadcrumb")){
  document.getElementById("breadcrumb").remove();
  if(document.getElementById("breadcrumb")){
  document.getElementById("breadcrumb").remove();
  

}

}
if(document.getElementById("breadcrumb2")){
  document.getElementById("breadcrumb2").remove();


}

if(document.getElementById("arrow")){
  document.getElementById("arrow").remove();


}
  console.log("fetching filter");
  console.log("collection log:" + localStorage.getItem("collection_log"));
  var selected_year = document.getElementById("year").value;
  var author = document.getElementById("author").value;

  fetch("http://localhost:3001/fetchDataAdvanced", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ year: selected_year, author: author }),
  })
    .then((response) => response.json())
    .then((data) => {
      var dataBody = document.getElementById("books_container");

      dataBody.innerHTML =''
        // '<div  style="display: flex;"> <input style="length: 20px;" type="text" name="city" list="cityname" id="filterSelector"> <datalist id="cityname"> </datalist> <select  id="typeSelector" onchange=""> <option value="Book_Author">Author</option> <option value="Year_Of_Publication">Year</option> </select> - </div><div class="button-container" style="  display: flex;"><button  style="  margin-left: 40px;" onclick="skipback()">&laquo;</button> <button class="tabbutton" onclick="prev()" class="previous">&laquo; Previous</button><button onclick="next()" class="next">Next &raquo;</button><button  onclick="skipforward()">&raquo;</button></div>';
      var buttoncounter = 1;
      console.log(data);
      data.forEach((row) => {
        if (buttoncounter % 2 == 0) {
          var background = "#A8A4E6";
        } else {
          var background = "#A01FE7";
        }
        if (1 > 2) {
          var bubble_style =
            "width:55%;border: 2px solid black; border-radius: 25px;background:" +
            background +
            ";'";
        } else {
          bubble_style = "";
        }
        // console.log(row.ISBN)
        var rowHTML = '<div id="books" style="  margin-left: 45px;" >';
        rowHTML += "<div id='book' style=''>";
        rowHTML += '<img src="' + row.Image_URL_L + '">';
        rowHTML += "<br>" + row.ISBN;
        rowHTML += "<br>" + row.Book_Title;
        rowHTML += "<br>" + row.Book_Author;
        rowHTML += "<br>" + row.Year_Of_Publication;
        //remeber to add function that calls collection list so that we can precheck this box. I think that it should probably just laod a users collection on login.
        //Then provide a remove from colleciton option
        if (localStorage.getItem("collection_log").includes(row.ISBN)) {
          rowHTML +=
            '<button id="button' +
            buttoncounter +
            '" style="background-color: crimson;color: white;border-radius: 10px;" ' +
            ' ">' +
            "Remove From Collection-" +
            "</button>";
          console.log(" inclued");
          rowHTML += "</div>";
          console.log(rowHTML);
          dataBody.innerHTML += rowHTML;
          document
            .getElementById("button" + buttoncounter)
            .setAttribute(
              "onclick",
              "removeCollection(" + buttoncounter + ',"' + row.ISBN + '")'
            );
        } else {
          console.log("not inclued");
          rowHTML +=
            '<button id="button' +
            buttoncounter +
            '" style="border-radius:10px;" ' +
            '">' +
            "Add to Collection +" +
            "</button>";
          rowHTML += "</div>";
          console.log(rowHTML);


          dataBody.innerHTML += rowHTML;
          document
            .getElementById("button" + buttoncounter)
            .setAttribute(
              "onclick",
              "addCollection(" + buttoncounter + ',"' + row.ISBN + '")'
            );
        }
        buttoncounter = buttoncounter + 1;
        //rowHTML += '<br>' + row.Image_URL_S ;
        //rowHTML += '<br>' + row.Image_URL_M;
        //rowHTML += '<br>' + row.Image_URL_L ;
        //rowHTML += '<br>';
        // rowHTML +="</div>"
        // dataBody.innerHTML += rowHTML;
        //                    dataBody.innerHTML='<div  style="display: flex;"> <input type="text" name="city" list="cityname" id="filterSelector"> <datalist id="cityname"> </datalist> <select  id="typeSelector" onchange=""> <option value="Book_Author">Author</option> <option value="Year_Of_Publication">Year</option> </select> - </div><div class="button-container" style="  display: flex;"><button  style="  margin-left: 40px;" onclick="skipback()">&laquo;</button> <button class="tabbutton" onclick="prev()" class="previous">&laquo; Previous</button><button onclick="next()" class="next">Next &raquo;</button><button  onclick="skipforward()">&raquo;</button></div>'

        //                        document.getElementById("typeSelector").onchange =   selectorFill('cityname',document.getElementById('typeSelector').value)

      });
      var yearbuttons=''
      if(document.getElementById("year")){
        if(document.getElementById("year").value.length>1){
         yearbuttons="<i id='arrow'>-->></i>"+'<button id="breadcrumb2" onclick="back_to_Author()'+'">'+document.getElementById("year").value+'</button>'
             }
           }
           dataBody.innerHTML='<button id="breadcrumb" onclick="back_to_Author()'+'">'+author+'</button>'+yearbuttons+dataBody.innerHTML




    })
    .catch((error) => console.log("Error fetching data: ", error));
}

function back_to_Author(){
  document.getElementById("breadcrumb").remove();
  document.getElementById("breadcrumb2").remove();
  document.getElementById("arrow").remove();
  document.getElementById("books").innerHTML='';
  document.getElementById("year").value='';
  submitAdvanced()


}

         

       




















// function searchList(){
//     console.log("fetching filter")
//     console.log( 'collection log:'+localStorage.getItem('collection_log'))
//     var selected_year=document.getElementById('year').value
//     var author=document.getElementById('author').value

//       fetch('http://localhost:3001/fetchDataAdvanced', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ year:selected_year, author:author }),
//       })
//       .then(response => response.json())
//                 .then(data => {
//                     var dataBody = document.getElementById('books_container');

//                     dataBody.innerHTML='<div  style="display: flex;"> <input style="length: 20px;" type="text" name="city" list="cityname" id="filterSelector"> <datalist id="cityname"> </datalist> <select  id="typeSelector" onchange=""> <option value="Book_Author">Author</option> <option value="Year_Of_Publication">Year</option> </select> - </div><div class="button-container" style="  display: flex;"><button  style="  margin-left: 40px;" onclick="skipback()">&laquo;</button> <button class="tabbutton" onclick="prev()" class="previous">&laquo; Previous</button><button onclick="next()" class="next">Next &raquo;</button><button  onclick="skipforward()">&raquo;</button></div>'
//                     var buttoncounter=1;
//                     console.log(data)
//                     data.forEach(row => {
//                       if(buttoncounter%2==0){

//                             var background="#A8A4E6"
//                       }else{
//                         var background="#A01FE7"

//                       }
//                       if(1>2){
//                       var bubble_style="width:55%;border: 2px solid black; border-radius: 25px;background:"+background+";'"
//                       }
//                       else{bubble_style=''}
//                       // console.log(row.ISBN)
//                         var rowHTML = '<div id="books" style="  margin-left: 45px;" >';
//                         rowHTML +="<div id='book' style=''>"
//                         rowHTML += '<img src="' + row.Image_URL_L+'">' ;
//                         rowHTML += '<br>' + row.ISBN ;
//                         rowHTML += '<br>' + row.Book_Title ;
//                         rowHTML += '<br>' + row.Book_Author ;
//                         rowHTML += '<br>' + row.Year_Of_Publication ;
//                         //remeber to add function that calls collection list so that we can precheck this box. I think that it should probably just laod a users collection on login.
//                         //Then provide a remove from colleciton option
//                         if(localStorage.getItem('collection_log').includes(row.ISBN)){
//                           rowHTML += '<button id="button'+buttoncounter+'" style="background-color: crimson;color: white;border-radius: 10px;" '+' ">'+'Remove From Collection-'+'</button>';
//                           console.log(' inclued')
//                           rowHTML +="</div>"
//                         console.log(rowHTML)
//                         dataBody.innerHTML += rowHTML;
//                           document.getElementById("button"+buttoncounter).setAttribute( "onclick", 'removeCollection('+buttoncounter+',"'+row.ISBN+'")')

//                         }else{
//                           console.log('not inclued')
//                           rowHTML += '<button id="button'+buttoncounter+'" style="border-radius:10px;" '+'">'+'Add to Collection +'+'</button>';
//                           rowHTML +="</div>"
//                         console.log(rowHTML)
//                         dataBody.innerHTML += rowHTML;
//                           document.getElementById("button"+buttoncounter).setAttribute( "onclick", 'addCollection('+buttoncounter+',"'+row.ISBN+'")')
//                         }
//                         buttoncounter=buttoncounter+1
//                         //rowHTML += '<br>' + row.Image_URL_S ;
//                         //rowHTML += '<br>' + row.Image_URL_M;
//                         //rowHTML += '<br>' + row.Image_URL_L ;
//                         //rowHTML += '<br>';
//                         // rowHTML +="</div>"
//                         // dataBody.innerHTML += rowHTML;
// //                    dataBody.innerHTML='<div  style="display: flex;"> <input type="text" name="city" list="cityname" id="filterSelector"> <datalist id="cityname"> </datalist> <select  id="typeSelector" onchange=""> <option value="Book_Author">Author</option> <option value="Year_Of_Publication">Year</option> </select> - </div><div class="button-container" style="  display: flex;"><button  style="  margin-left: 40px;" onclick="skipback()">&laquo;</button> <button class="tabbutton" onclick="prev()" class="previous">&laquo; Previous</button><button onclick="next()" class="next">Next &raquo;</button><button  onclick="skipforward()">&raquo;</button></div>'

//                         //                        document.getElementById("typeSelector").onchange =   selectorFill('cityname',document.getElementById('typeSelector').value)
//                         document.getElementById( "typeSelector" ).setAttribute( "onchange", "selectorFill('cityname',document.getElementById('typeSelector').value)" );

//                     });
//                 })
//                 .catch(error => console.log('Error fetching data: ', error));
//     }




















