// (function($){
// 	'user strict';	
	
// 	function Dropdown($elem, options){
// 		this.$elem = $elem;
// 		this.options = options;
// 		this.$layer = this.$elem.find('.dropdown-layer')
// 		this.activeClass= options.active + '-active';
// 		this.init();	
		
// 	}
// 	Dropdown.prototype.init= function(){
// 		var self = this;
// 		this.$layer.on('show shown hide hidden', function(e){			
// 			self.$elem.trigger('dropdown-'+ e.type);
			
// 		});	
// 		this.$layer.showHide(this.options);		
		
// 		if(this.options.event==='click'){
// 			this.$elem.on('click', function(e){
// 				self.show();
// 				e.stopPropagation();
// 			});
// 			$(document).on('click', function(){
// 				self.hide();
// 			});
// 		}else{
// 			this.$elem.hover(function(){
// 				self.show();								
// 			}, function(){
// 				self.hide();				
// 			});
// 		}		
// 	}
// 	Dropdown.prototype.show = function(){
// 		var self = this;
// 		if(this.options.delay){
// 			this.timer = setTimeout(function() {
// 				self.$elem.addClass(this.activeClass);
// 				self.$layer.showHide('show');
// 			}, this.options.delay);	
// 		}else{
// 			self.$elem.addClass(self.activeClass);
// 			self.$layer.showHide('show');
// 			}			
// 	};
// 	Dropdown.prototype.hide = function(){
// 		if(this.options.delay){
// 			clearTimeout(this.timer);
// 		}
// 		this.$elem.removeClass(this.activeClass);
// 		this.$layer.showHide('hide');		
// 	};
// 	Dropdown.DEFAULTS = {
// 		event: 'hover',
// 		css3: false,
// 		js: false,
// 		active:'menu',
// 		animation: 'fade',		
// 		delay: 200
// 	};	


// 	$.fn.extend({
// 			'dropdown': function(option){
// 				return this.each(function(){	
// 					var $this = $(this),
// 						dropdown = $this.data('dropdown');
// 					if(!dropdown){
// 						var options = $.extend({}, Dropdown.DEFAULTS, $this.data(), typeof option==='object'&& option);								
// 						dropdown = new Dropdown($this, options);	
// 						$this.data('dropdown', dropdown);

// 					}
// 					if(typeof dropdown[option]=== 'function'){
// 						dropdown[option]();
// 					}
					

// 				});				
// 			}
// 	});	

	
// })(jQuery)

(function($){
	'use strict';

	function Dropdown($elem, options){
		
		this.$elem = $elem;
		this.options = options;
		this.$layer = this.$elem.find('.dropdown-layer');
		this.activeClass = options.active +'-active';
		this.init();
	
	}
	Dropdown.DEFAULTS = {
		event:'hover', //click
		css3: false,
		js: false,
		animation: 'fade',
		delay:0,
		active: 'dropdown'

	}; 
	Dropdown.prototype.init = function(){

		var self = this;
		this.$layer.showHide(this.options);
		this.$layer.on('show shown hide hidden', function(e){
			self.$elem.trigger('dropdown-'+ e.type);
		})
		
		if(this.options.event === 'click'){
			this.$elem.on('click', function(e){
				self.show();
				e.stopPropagation();
			});
			// 老师，既然var self = this， 为什么这里$.proxy(this.hide, this)不能退直接写成self.hide?
			// 我这么执行了，报错, 但我想不出为什么不能这么写？ self.show || self.hide
			$(document).on('click', $.proxy(this.hide, this));

		}else{
			this.$elem.hover($.proxy(this.show, this), $.proxy(this.hide, this));
		}
	};
	Dropdown.prototype.show = function(){
		var self = this;

		if(this.options.delay){
			
			this.timer = setTimeout(function(){
				_show();
			},this.options.delay);
		
		}else{
			_show();
		}
		function _show(){
			self.$elem.addClass(self.activeClass);		
			self.$layer.showHide('show');
		}
		

	};
	Dropdown.prototype.hide = function(){
		var self = this;
		if(this.options.delay){
			clearTimeout(this.timer);
		}
		self.$elem.removeClass(self.activeClass);
		self.$layer.showHide('hide');
	};

	
	

	$.fn.extend({
		dropdown:function(option){			
			return this.each(function(){
				var $this = $(this),
					dropdown = $this.data('dropdown'),
					options = $.extend({}, Dropdown.DEFAULTS, $this.data(), typeof option==='object'&&option);
				if(!dropdown){
					$this.data('dropdown',dropdown= new Dropdown($this,options));
				}				
				
				if(typeof dropdown[option]==='function'){
					dropdown[option]();
				}
			})

		}
	})
	// $('.dropdown').dropdown();

})(jQuery);
