var selectedRow = null


function getMovieList() {
    fetch('http://localhost:3000/movies', {
        method: 'GET'
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(movies => {
        console.log('Movies fetched successfully:', movies);
        const tableBody = document.getElementById('moviesTableBody');
        tableBody.innerHTML = ''; // Clear the table body

        // Populate the table with movies
        movies.forEach((movie) => {
            insertNewRecord(movie);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Call getMovieList when the page loads
// document.addEventListener('DOMContentLoaded', getMovieList);
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("updateBtn").disabled = true; // Disable the update button
    getMovieList(); // Then load the movie list
});



// function onFormSubmit(event) {
//     event.preventDefault(); 
//     var formData = new FormData(document.getElementById('addMovieForm'));

//     fetch('http://localhost:3000/movies', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if(response.ok) {
//             return response.json();
//         }
//         throw new Error('Network response was not ok.');
//     })
//     .then(data => {
//         console.log('Success:', data);
//         refreshMovieList(); 
//         // resetForm();
//         // Additional code to handle success, like updating the UI
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }



function onFormSubmit(event) {
    event.preventDefault(); 
    var formData = readFormData(); // Assuming readFormData() returns an object with form data

    if (selectedRow == null) {
        // POST request to add a new movie
        fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        // .then(handleResponse)
        // .then(() => refreshMovieList())
        // .catch(error => console.error('Error:', error));
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
            document.getElementById('response-message').innerText = 'Movie added successfully';
            refreshMovieList();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response-message').innerText = 'Failed to add movie';
        });

    } else {
        // PUT request to update an existing movie
        fetch(`http://localhost:3000/movies/${selectedRow.cells[0].innerText}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
            document.getElementById('response-message').innerText = 'Movie updated successfully';
            refreshMovieList();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response-message').innerText = 'Failed to update movie';
        });

        // .then(handleResponse)
        // .then(() => refreshMovieList())
        // .catch(error => console.error('Error:', error));
    }
}

function handleResponse(response) {
    if(response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
}

// function editMovie() {
//     if (selectedRow) {
//         const movies_id = selectedRow.cells[0].innerText;
//         const movieData = readFormData();

//         fetch(`http://localhost:3000/movies/${movies_id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(movieData),
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             refreshMovieList();
//             resetForm();
//         })
//         .catch(error => console.error('Error:', error));
//     } else {
//         console.error('No row selected for editing.');
//     }
// }

function editMovie(movieId) {
    // Fetch the data for the movie with movieId
    fetch(`http://localhost:3000/movies/${movieId}`)
        .then(response => response.json())
        .then(data => {
            const movie = data[0]; // Assuming the response is an array with one movie object
            // Populate form fields
            document.getElementById("name").value = movie.name;
            document.getElementById("genre").value = movie.genre;
            document.getElementById("releaseYear").value = movie.releaseYear;
            document.getElementById("rating").value = movie.rating;
            
            // Store the ID of the movie being edited
            selectedRow = movieId;
            
            // Enable the update button, disable the submit button
            document.getElementById("submitBtn").disabled = true;
            document.getElementById("updateBtn").disabled = false;
        })
        .catch(error => console.error('Error:', error));
}
  
  
  
  function deleteMovie(movieId) {
    fetch(`http://localhost:3000/movies/${movieId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      document.getElementById('response-message').innerText = 'Movie deleted successfully';
      refreshMovieList();
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('response-message').innerText = 'Failed to delete movie';
    });
  }
  
  


function readFormData() {
    var formData = {};
    // formData["movies_id"] = document.getElementById("movies_id").value;
    formData["name"] = document.getElementById("name").value;
    formData["genre"] = document.getElementById("genre").value;
    formData["releaseYear"] = document.getElementById("releaseYear").value;
    formData["rating"] = document.getElementById("rating").value;
    return formData;
}

function insertNewRecord(data) {
    // Make sure the "moviesTable" exists in your HTML with this ID
    var table = document.getElementById("moviesTable");
    var tableBody = table.getElementsByTagName('tbody')[0];
    var newRow = tableBody.insertRow(tableBody.rows.length);
    newRow.insertCell(0).innerText = data.movies_id; 
    newRow.insertCell(1).innerText = data.name;
    newRow.insertCell(2).innerText = data.genre;
    newRow.insertCell(3).innerText = data.releaseYear;
    newRow.insertCell(4).innerText = data.rating;
    newRow.insertCell(5).innerHTML = `<button onclick="editMovie(${data.movies_id})">Edit</button>
    <button onclick="deleteMovie(${data.movies_id})" id="deleteBtn-${data.movies_id}">Delete</button>`;
}



function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    // document.getElementById("movies_id").value = selectedRow.cells[0].innerText; // Use innerText instead of innerHTML
    document.getElementById("name").value = selectedRow.cells[1].innerText;
    document.getElementById("genre").value = selectedRow.cells[2].innerText;
    document.getElementById("releaseYear").value = selectedRow.cells[3].innerText;
    document.getElementById("rating").value = selectedRow.cells[4].innerText;
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("updateBtn").disabled = false;
}


function updateRecord() {
    var formData = readFormData(); // Assuming readFormData() correctly gathers form data

    // PUT request to update an existing movie
    fetch(`http://localhost:3000/movies/${selectedRow}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log('Update successful:', data);
        document.getElementById('response-message').innerText = 'Movie updated successfully';
        refreshMovieList();
        resetForm();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



// function resetForm() {
//     // document.getElementById("movies_id").value = "";
//     document.getElementById("name").value = "";
//     document.getElementById("genre").value = "";
//     document.getElementById("releaseYear").value = "";
//     document.getElementById("rating").value = "";
//     selectedRow = null;
// }

function resetForm() {
    // Reset the form fields
    document.getElementById('addMovieForm').reset();
    // Clear the selected row
    selectedRow = null;
    document.getElementById("submitBtn").disabled = false; //added
    document.getElementById("updateBtn").disabled = true; //added
}

document.addEventListener('DOMContentLoaded', function() {
    getMovieList();
    resetForm(); // This will set the correct initial state for your buttons
});



function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("moviesTable").deleteRow(row.rowIndex);
        resetForm();
    }
}

async function refreshMovieList() {
    try {
        const response = await fetch('http://localhost:3000/movies');
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const movies = await response.json();
        const table = document.getElementById('moviesTable'); // Ensure this is the correct ID
        const tableBody = table.getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear current movie list

        // Insert new rows into the table body
        movies.forEach((movie) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = movie.movies_id;
            row.insertCell(1).innerText = movie.name;
            row.insertCell(2).innerText = movie.genre;
            row.insertCell(3).innerText = movie.releaseYear;
            row.insertCell(4).innerText = movie.rating;
            // Include your edit/delete buttons here
            row.insertCell(5).innerHTML = `<button onclick="editMovie(${movie.movies_id})">Edit</button>
                                        <button onclick="deleteMovie(${movie.movies_id})">Delete</button>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}



  
function validate() {
    isValid = true;
    if (document.getElementById("name").value == "") {
        isValid = false;
        document.getElementById("NameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("NameValidationError").classList.contains("hide"))
            document.getElementById("NameValidationError").classList.add("hide");
    }
    return isValid;
}