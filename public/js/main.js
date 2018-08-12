$(document).ready(function(){
  $('.delete-project').on('click', (e) => {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/projects/delete/'+id,
      success: function(response){
        window.location.href='/projects';
      },
      error: function(error){
        console.log(error);
      }
    });
  });
})
