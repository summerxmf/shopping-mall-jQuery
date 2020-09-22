(function ($) {
    'use strict';

 	var cache = {
        data: {},
        count: 0,
        addData: function (key, data) {
            if (!this.data[key]) {
                this.data[key] = data;
                this.count++;
            }
        },
        readData: function (key) {
            return this.data[key];
        },
        deleteDataByKey: function (key) {
            delete this.data[key];
            this.count--;
        },
        deleteDataByOrder: function (num) {
            var count = 0;

            for (var p in this.data) {
                if (count >= num) {
                    break;
                }
                count++;
                this.deleteDataByKey(p);
            }
        }
    };

    function Search($elem, options) {
        this.$elem = $elem;
        this.options = options; 

        this.$form = this.$elem.find('.search-form');
        this.$input = this.$elem.find('.search-inputbox');        
        this.$layer = this.$elem.find('.search-layer');  
        this.loaded = false;

        this.$elem.on('click','.search-btn', $.proxy(this.submit, this));

        if(this.options.autocomplete){
        	this.autocomplete();
        }
        
    }
    Search.DEFAULTS = {
        autocomplete: false,
        url: 'https://autosug.ebaystatic.com/autosug?jgr=1&sId=15&_ch=0&callback=nil&kwd=',
        jsonpCallback: 'nil',
        css3: false,
        js: false,
        animation: 'fade'
        
    };
    Search.prototype.submit = function() {
        if ($.trim(this.$input.val()) === '') {
            return false;
        }
        this.$form.submit();
    };
    Search.prototype.autocomplete = function() {
    	var timer = null,
    		self = this;
        this.$input
        	.on('input', function(){
        		clearTimeout(timer);
        		timer = setTimeout(function(){
        			self.getData();
        		},200)
        	})
        	.on('focus', $.proxy(this.showLayer, this))
        	.on('click', function(){
        		return false;
        	});
        this.$layer.showHide(this.options);
        $(document).on('click', $.proxy(this.hideLayer, this))
    };
    Search.prototype.getData = function() {
    	var self = this;
    	var inputVal = this.getInputVal();
    	if(inputVal === '') return self.$elem.trigger('search-noData');

    	if(cache.readData(inputVal)){
    		return self.$elem.trigger('search-getData', [cache.readData(inputVal)])
    	}
    	if(this.jqXHR) this.jqXHR.abort();

        this.jqXHR = $.ajax({
			url: this.options.url + inputVal,
			dataType: 'jsonp',
			jsonpCallback: 'nil'	
		}).done(function(data){
			cache.addData(inputVal,data);
			self.$elem.trigger('search-getData', [data])
		}).fail(function(){
			self.$elem.trigger('search-noData');
		}).always(function(){
			self.jqXHR = null;
		});
    };
    Search.prototype.showLayer = function() {
    	if(!this.loaded) return;
        this.$layer.showHide('show');
    };
    Search.prototype.hideLayer = function() {
        this.$layer.showHide('hide');
    };
    Search.prototype.getInputVal = function() {
        return $.trim(this.$input.val());
    };
    Search.prototype.setInputVal = function(val) {
        this.$input.val(removeHtmlTags(val));

        function removeHtmlTags(str) {
            return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
        }
    };
    Search.prototype.appendLayer = function(html) {
        this.$layer.html(html);
        this.loaded = !!html;
    };
  
    $.fn.extend({
        search: function(option, val) {

            
            return this.each( function() {
                
                var $this=$(this),
                search=$this.data('search'),
                options = $.extend({}, Search.DEFAULTS, $(this).data(), typeof option==='object'&&option);
                  
                if(!search){
                    $this.data('search',search = new Search($this,options));

                }  

                if(typeof search[option] === 'function'){
                    search[option](val);

                }

            });

        }
    });



})(jQuery);


// (function($){
// 	'use strict'

// 	var $search = $('.search'),
// 		$input = $search.find('.search-inputbox'),
// 		$form = $search.find('.search-form'),
// 		$btn = $search.find('.search-btn'),
// 		$layer = $search.find('.search-layer');

// 	// validation for null or space
// 	$form.on('submit',function(){
// 		if($.trim($input.val()) === ''){
// 			return false;
// 		}
// 	})

// 	// auto complete
// 	$input.on('input',function(){
// 		var url = 'https://autosug.ebaystatic.com/autosug?jgr=1&sId=15&_ch=0&callback=nil&kwd=' + $.trim($input.val());
// 		$.ajax({
// 			url:url,
// 			dataType: 'jsonp',
// 			jsonpCallback: 'nil'	
// 		}).done(function(data){
// 			console.log(data.res.sug)
// 				var html = '',
// 					dataNum = data['res']['sug'].length,
// 					maxNum = 10;
// 				if(dataNum === 0){
// 					$layer.hide().html('');
// 					return;
// 				}
// 				// console.log(data);
// 				for(var i = 0; i < data['res']['sug'].length; i++){
// 					if(i >= maxNum) break;
// 					html += '<li class="search-layer-item text-ellipsis">' + data['res']['sug'][i] + '</li>'
// 				}
// 				// console.log(html);
// 				$layer.html(html).show();
// 		}).fail(function(){
// 			$layer.hide().html('');
// 			console.log(1);
// 		}).always(function(){
// 			console.log(2);
// 		});
// 	})

// 	// event bubble
// 	$layer.on('click', '.search-layer-item', function(){
// 		$input.val($(this).html());
// 		$form.submit();
// 	})

// 	// to remove the html tags in search items 
// 	function removeHtmlTags(str) {
//         return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
//     }

//     $input.on('focus',function(){
//     	$layer.show();
//     }).on('click', function(){
//     	return false;
//     });

//     $(document).on('click', function(){
//     	$layer.hide();
//     })
// })(jQuery);