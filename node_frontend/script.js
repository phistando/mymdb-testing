$(document).ready(function() {

  $('#signup').on('click', function() {
    $.ajax({
      url: 'http://localhost:5000/signup',
      data: {
        "name": "test",
        "email": "test@email.com",
        "password": "test123"
      },
      type: 'POST',
    }).success(successFunction)
      .fail(failFunction);

      function successFunction(data){
        alert ('signup successful');
      }

      function failFunction(data) {
        alert ('signup failed');
      }
    });
  });
