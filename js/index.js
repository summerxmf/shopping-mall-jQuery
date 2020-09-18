(function(){
	'user strict';

// menu
	$('.menu')
        .on('dropdown-show', function (e) {
            loadOnce($(this), buildMenuItem);        
        }).dropdown({
        css3: true,
        js: true,
        animation: 'fade',
        delay: 200
    });  
    function buildMenuItem($elem, data){
        var html = '';
        if(data.length === 0) return;
        for(var i=0; i<data.length; i++){
            html+= '<li><a href="'+data[i].url+'" target="_blank" class="menu-item">'+data[i].name+'</a></li>';
        }
        $elem.find('.dropdown-layer').html(html);
   }
    
// search
    var $headerSearch = $('#header-search');
    $headerSearch.search({
        autocomplete: true,        
        css3: true,
        js: true,
        animation: 'slideUpDown'
    });

//cart
   $('.cart').dropdown({
        css3: true,
        js: true,
        active:'cart',
        animation: 'slideUpDown',
        delay: 200
   })

   function loadOnce($elem, success){
        var dataLoad = $elem.data('load');
        if(!dataLoad) return;               
        if(!$elem.data('loaded')){
            $elem.data('loaded', true); 
            $.getJSON(dataLoad).done(function(data){
                if(typeof success==='function') success($elem, data);          
            }).fail(function(){
                $elem.data('loaded', false);
            });       
            
        }    
   }
// category
    $('#focus-category').find('.dropdown')
        .on('dropdown-show', function(){
            loadOnce($(this), buildCategoryItem);
        })
        .dropdown({
            css3: false,
            js: false,
            
        });
    function buildCategoryItem($elem, data){
        var html ='';
        if(data.length ===0) return;
        for(var i=0; i<data.length; i++){
            html += '<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">'+ data[i].title+'</a></dt><dd class="category-details-item fl">';
            for(var j=0; j<data[i].items.length; j++){
                html += '<a href="###" target="_blank" class="link">'+data[i].items[j]+'</a>';
            }
            html+= '</dd></dl>';             
        }
        $elem.find('.dropdown-layer').html(html);
    }

// search
    // var $headerSearch = $('#header-search');
    // var html='',
    //     maxNum = 10;
    // $headerSearch.on('search-getData', function(e, data){
    //     console.log(e.type);
    //      var $this = $(this);
    //     html = createHeaderSearchLayer(data);
    //     $this.search('appendLayer', html);
    //     if(html){
    //         $this.search('showLayer');
    //     }else{
    //         $this.search('hideLayer');
    //     }
    // }).on('search-noData', function(e){        
    //      $(this).search('appendLayer','').search('hideLayer');        
    // }).on('click', '.search-layer-item', function(){
    //     $headerSearch.search('setIputVal', $(this).html());
    //     $headerSearch.search('submit');
    // });  
    

   

    // $headerSearch.search({
    //     autocomplete: true,
    //     css3: true,
    //     js: true,
    //     animation: 'fade'
    // });
    // function createHeaderSearchLayer(data) {
    //     var html='',
    //         dataNum=data['result'].length;
       
    //     if(dataNum===0) return '';                           
    //     for(var i =0; i< dataNum; i++){
    //         if(i >= maxNum) break;           
    //          html += '<li class="search-layer-item text-ellipsis">'+ data['result'] [i][0] +'</li>';  
    //     }
      
    //     return html;
    // }
   
})(jQuery)