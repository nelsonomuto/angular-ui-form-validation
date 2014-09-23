(function($){
    $('#main_content').headsmart()
    $(window).load(function(){

        /* Page Scroll to id fn call */
        $("#navigation-menu a,a[href='#top'],a[rel='m_PageScroll2id']").mPageScroll2id({
            highlightSelector:"#navigation-menu a"
        });

        /* demo functions */
        $("a[rel='next']").click(function(e){
            e.preventDefault();
//            var to=$(this).parent().parent("div").next().attr("id");
            var to = $(this).attr('href');
            $.mPageScroll2id("scrollTo",to);
        });

    });
})(jQuery);
