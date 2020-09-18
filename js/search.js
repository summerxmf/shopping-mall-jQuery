// (function(){
// 	'user strict';
// 	function Search($elem, options){
// 		this.$elem = $elem;
// 		this.options = options;
// 		this.$form = this.$elem.find('form');
// 		this.$input = this.$elem.find('.search-inputbox');
// 		this.$layer = this.$elem.find('.search-layer');
// 		this.loaded= false;
// 		this.$elem.on('click', '.search-btn', $.proxy(this.submit, this));
// 		if(this.options.autocomplete){
// 			this.autocomplete();
// 		}
// 	}

// 	Search.DEFAULT = {
// 		autocomplete: true,
// 		url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1567945573646_835&callback=jsonp836&k=1&area=c2c&bucketid=19&q=',
// 		css3: false,
// 		js: false,
// 		animation: 'fade',
// 		getDataInterval: 200		
// 	};
// 	Search.prototype.submit= function(){
// 		if(this.getInputVal()===''){
// 			return false;
// 		} 
// 		this.$form.submit();
// 	};
	
// 	Search.prototype.autocomplete = function(){
// 			var self = this,
// 				timer = null;
// 		this.$input
// 			.on('input', function(){
// 				if(self.options.getDataInterval){
// 					clearTimeout(timer);
// 					timer = setTimeout(function() {self.getData();}, self.options.getDataInterval);
// 				}else{
// 					self.getData();
// 				}
				
				
// 			})
// 			.on('focus', $.proxy(this.showLayer, this))
// 			.on('click', function(){
// 				return false;
// 			});
// 		$(document).on('click', $.proxy(this.hideLayer, this));
// 		this.$layer.showHide(this.options);				
// 	};
// 	Search.prototype.getData= function(){
// 		var self = this;
// 		var inputVal = this.getInputVal();
// 		if(inputVal==='') return self.$elem.trigger('search-noData');

// 		if(this.jqXHR) this.jqXHR.abort();
// 		this.jqXHR = $.ajax({
// 			url: this.options.url + encodeURIComponent(inputVal),
// 			dataType: 'jsonp'
// 		}).done(function(data){
// 			console.log(data);
// 			self.$elem.trigger('search-getData', [data]);
// 		}).fail(function(){
// 			self.$elem.trigger('search-noData');
// 		}).always(function(){
// 			self.jqXHR = null;
// 		});
// 	};
// 	Search.prototype.appendLayer = function(html){
// 		this.$layer.html(html);	
// 		this.loaded = !!html;	
// 	}
// 	Search.prototype.showLayer = function(){
// 		if(!this.loaded) return;
// 		this.$layer.showHide('show');
// 	};
// 	Search.prototype.hideLayer = function(){
// 		this.$layer.showHide('hide').data('');
// 	};
// 	Search.prototype.getInputVal= function() {
// 		return $.trim(this.$input.val())
// 	};
// 	Search.prototype.setInputVal = function(val) {
// 		this.$input.val(removeHtmlTags(val));
// 	}


// 	$.fn.extend({
// 		search: function(options, value){
// 			return this.each(function(){
// 				var $this = $(this),
// 					search = $this.data('search'),
// 					option = $.extend({}, Search.DEFAULT,$this.data(), typeof options==='object'&&options);
// 				if(!search){
// 					$this.data('search', search= new Search($this, option));
// 					console.log(search);
// 				}
// 				if(typeof search[options]==='function'){
// 					search[options](value);
// 				}

// 			});
// 		}
// 	});	
// })(jQuery)
// (function(){
// 	'user strict';
// 	var $search = $('.search'),
// 		$input = $search.find('.search-inputbox'),
// 		$btn = $search.find('.search-btn'),
// 		$layer = $search.find('.search-layer'),
// 		$form = $search.find('.search-form');
// 	// 验证
// 	$form.on('submit', function(){
// 		if($.trim($input.val())==='') return false;
// 	}); 
// 	// 自动完成
// 	$input.on('input', function(){
// 		var url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1568874957749_671&callback=jsonp672&k=1&area=c2c&bucketid=19&q='+ encodeURIComponent($.trim($input.val()));
// 		var maxNum = 5;
// 		$.ajax({
// 			url: url,
// 			dataType: 'jsonp'
// 		}).done(function(data){			
// 			var result = data['result'],
// 				html = '';	
// 			if(result.length ===0){
// 				$layer.hide().html('');
// 				return;
// 			}		
// 			for(var i =0; i< result.length; i++){
// 				if(i>= maxNum) break;
// 				html += '<li class="search-layer-item text-ellipsis">'+ result[i][0] +'</li>';
// 			}
// 			$layer.html(html).show();
// 		}).fail(function(){
// 			$layer.hide().html('');
// 		}).always(function(){

// 		});		
// 	}).on('focus', function(){
// 		$layer.show();		
// 	}).on('click', function(){
// 		return false;
// 	});

// 	$(document).on('click', function(){
// 		$layer.hide();
// 	})

// 	$layer.on('click', '.search-layer-item', function(){
// 		$input.val(removeHtmlTags($(this).html()));
// 		$form.submit();

// 	});


// 	function removeHtmlTags(str){
// 		return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g ,'');
// 	}
// })(jQuery)

(function(){
	'user strict';
	function Search($elem, options){
		var self = this;
		this.$elem = $elem;
		this.options = options;
		this.$input = this.$elem.find('.search-inputbox');
		this.$layer = this.$elem.find('.search-layer');
		this.$form = this.$elem.find('.search-form');	
		this.html='';
		this.$elem.on('click', '.search-btn', $.proxy(this.submit, this));
		if(this.options.autocomplete){
			this.autocomplete();
		}

	}
	Search.DEFAULTs = {
		autocomplete: false,		
		url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1567945573646_835&callback=jsonp836&k=1&area=c2c&bucketid=19&q=',
		css3: false,
		js: false,
		animation: 'fade',
		timeInterval: 200
	};
	
	Search.prototype.submit= function(){
		if($.trim(this.$input.val())==='') return false;
		this.$form.submit();
	};
	Search.prototype.autocomplete = function(){
		// this.$layer.showHide(this.options);
		var self = this,
			maxNum = 5,
			html ='',
			timer = null;
		this.$layer.showHide(this.options);
		this.$input.on('click', function(){					
			return false;
		}).on('input', function(){
			if(self.options.timeInterval){
				clearTimeout(timer);			
				timer = setTimeout(function() {
					self.getData();
				}, self.options.timeInterval);
			}else{
				self.getData();
			}						
				
			
		}).on('focus', function(){
			if(html) self.showLayer(html);
		});
		this.$elem.on('search-getData', function(e, data){
			html = createHeaderSearchLayer(data, maxNum);
			if(html){
				self.showLayer(html);
			}else{
				self.hideLayer();
			}
		}).on('search-noData', $.proxy(this.hideLayer, this)
		).on('click', '.search-layer-item', function(){			
			self.$input.val(removeHtmlTags($(this).html()));
			self.submit();
		});		
		
		$(document).on('click', $.proxy(this.hideLayer, this));


	};
	Search.prototype.getData = function(){
		var self = this;
		var inputVal = this.getInputVal();
		if(inputVal==='') {
			return this.$elem.trigger('search-noData');
		}
		if(this.jqXHR) this.jqXHR.abort();

		this.jqXHR = $.ajax({
			url : this.options.url + encodeURIComponent(inputVal),			
			dataType: 'jsonp'
		}).done(function(data){		
			console.log(data);	
			self.$elem.trigger('search-getData',[data]);
		}).fail(function(){
			self.$elem.trigger('search-noData');
		}).always(function(){
			self.jqXHR = null;
		});
	};
	Search.prototype.showLayer = function(html){
		this.$layer.html(html).showHide('show');				
	};
	Search.prototype.hideLayer = function(){
		this.$layer.showHide('hide').html('');
	};
	Search.prototype.getInputVal = function(){
		return $.trim(this.$input.val());
	}
	
	function removeHtmlTags(str){
		return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g ,'');
	}

	function createHeaderSearchLayer(data, maxNum){
		var result = data['result'],
			html = '';
		if(result.length ===0){
			return html ='';

		}		
		for(var i =0; i< result.length; i++){
			if(i>= maxNum) break;
			 html += '<li class="search-layer-item text-ellipsis">'+ result[i][0] +'</li>';
		}	
		return html;	
		
	}
	$.fn.extend({
			search: function(option){
				return this.each(function(){	
					var $this = $(this),
						search = $this.data('search');
					if(!search){// first time
						var options = $.extend({}, Search.DEFAULTs, $this.data(), typeof option==='object'&& option);								
						search = new Search($this, options);	
						$this.data('search', search);
					}
					if(typeof search[option]=== 'function'){
						search[option]();
					}	
				});				
			}
	});	

})(jQuery)