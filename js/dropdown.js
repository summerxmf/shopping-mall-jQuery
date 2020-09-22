(function($){
	'use strict';

	function Dropdown($elem, options){
		this.$elem = $elem;
		this.$layer = this.$elem.find('.dropdown-layer');
		this.activeClass = options.active + '-active';
		this.options = options;

		this._init();		
	}

	Dropdown.prototype._init = function(){
		var self = this;

		this.$layer.showHide(this.options);

		this.$layer.on('show shown hide hidden', function(e){
			self.$elem.trigger('dropdown-' + e.type)
		})

		if(this.options.event === 'click'){
			this.$elem.on('click', function(e){
				self.show();
				e.stopPropagation();
			});
			$(document).on('click', $.proxy(this.hide, this));
		}else {
			this.$elem.hover($.proxy(this.show, this),$.proxy(this.hide, this));
		}
	};

	Dropdown.prototype.show = function(){
		var self = this;

		if(this.options.delay){
			this.timer = setTimeout(function(){
				_show();
			},this.options.delay);
		}else {
			_show();
		}

		function _show(){
			self.$elem.addClass(self.activeClass);
			self.$layer.showHide('show');
		}
		
	};

	Dropdown.prototype.hide = function(){
		if(this.options.delay){
			clearTimeout(this.timer);
		}
		this.$elem.removeClass(this.activeClass);
		this.$layer.showHide('hide');
	};

	Dropdown.DEFAULTS = {
		event: 'hover',
		css3: false,
		js: false,
		animation: 'fade',
		active: 'dropdown',
		delay:0
	};

	// function dropdown(elem){
	// 	var $elem = $(elem),
	// 		$layer = $elem.find('.dropdown-layer'),
	// 		activeClass = $elem.data('active') + '-active';

	// 	$layer.showHide();

	// 	$elem.hover(function(){
	// 		$elem.addClass(activeClass);
	// 		$layer.showHide('show');
	// 	},function(){
	// 		$elem.removeClass(activeClass);
	// 		$layer.showHide('hide');
	// 	});

	// }

	$.fn.extend({
		dropdown: function(option){
			return this.each(function(){
				var $this = $(this),
					dropdown = $this.data('dropdown'),
					options = $.extend({},Dropdown.DEFAULTS,$(this).data(), typeof option === 'object' && option);
				
				//singleton
				if(!dropdown){
					dropdown = $this.data('dropdown', dropdown = new Dropdown($this,options));
				}

				if(typeof dropdown[option] === 'function'){
					dropdown[option]();
				}
			});
		}
	});

	
})(jQuery);