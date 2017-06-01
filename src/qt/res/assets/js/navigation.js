(function($) {

    var prevPage = null;

    function changePage(event) {
        var toPage = $($(this).attr('href'));

        prevPage = $("#navitems li.selected a");

        $("#navitems li").removeClass("selected");
        $(this).parent("li").addClass("selected");

        if(toPage.length == 1 && toPage[0].tagName.toLowerCase() == "article") {
            event.preventDefault();
            $(window).scrollTop(0);
            $("article").hide();
            toPage.show();
            $(document).resize();
        }
    }

    $(function() {
      // Menu icon onclick
      $("#navlink").on("click", function() {
          $("#layout").toggleClass('active');
      });

      $(document).ready(function() {
          $("#navitems a[href='#overview']").trigger('click');
      });

      // Change page handler
      $("#navitems a, .navigate a").on("click", changePage);
    });

})(jQuery);
