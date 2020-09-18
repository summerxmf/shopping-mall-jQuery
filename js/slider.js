(function(){
	'user strict';
	function Slider($elem, options){
		this.$elem = $elem;
		this.options = options;
		this.$items = $elem.find('.slider-item');
		this.$indicators = $elem.find('.slider-indicator');
		this.$controls = this.$elem.find('.slider-control');

		this.itemNum = this.$items.length;
		this.curIndex = this._getCorrectIndex(this.options.activeIndex);
		console.log(this.curIndex);

		this._init();
	}
	Slider.DEFAULTS = {
		css3: false,
		js: false,
		animation: 'fade', //slide
		activeIndex: 0,
		interval: 0
	}
	Slider.prototype._init = function() {
		var self = this;
		// init show
		this.$indicators.removeClass('slider-indicator-active');
		this.$indicators.eq(this.curIndex).addClass('slider-indicator-active');
		// init to
		if(this.options.animation==='slide'){
			this.$elem.addClass('slider-slide');
			this.$items.eq(this.curIndex).css('left',0);	

			// send message
			this.$items.on('move moved', function(e){
				var index = self.$items.index(this);
				if(e.type === 'move'){
					if(index === self.curIndex){
						self.$elem.trigger('slider-hide', [index, this]);
					}else{
						self.$elem.trigger('slider-show', [index, this]);
					}

				}else{ // moved
					if(index === self.curIndex){
						self.$elem.trigger('slider-shown', [index, this]);
					}else{
						self.$elem.trigger('slider-hidden', [index, this]);
					}
				}
			});			

			// move init
			this.$items.move(this.options);

			this.itemWidth = this.$items.eq(0).width();	
			this.transitionClass = this.$items.eq(0).hasClass('transition')?'transition':'';

			this.to = this._slide;
		}else{
			this.$elem.addClass('slider-fade');
			this.$items.eq(this.curIndex).show();

			// send message
			this.$items.on('show shown hide hidden', function(e){
				self.$elem.trigger('slider-'+ e.type, [self.$items.index(this), this]);
			});

			// showHide init
			this.$items.showHide(this.options);

			this.to = this._fade;
		}			


		// bind event
		this.$elem
		.hover(function(){
			self.$controls.show();			
		}, function(){
			self.$controls.hide();			
		}).on('click','.slider-control-left', function(){
			self.to(self._getCorrectIndex(self.curIndex-1), 1);

		}).on('click','.slider-control-right', function(){			
			self.to(self._getCorrectIndex(self.curIndex+1), -1);

		}).on('click', '.slider-indicator',function(){
			self.to(self._getCorrectIndex(self.$indicators.index(this)));
		});	
		// auto
		if(this.options.interval && !isNaN(Number(this.options.interval))){
			this.auto();
			this.$elem.hover($.proxy(self.pause, self), $.proxy(self.auto, self));
		}
		
					
	};

	Slider.prototype. _getCorrectIndex = function(index) {
		if(isNaN(Number(index))) return 0;
		if(index<0) return this.itemNum-1;
		if(index>this.itemNum-1) return 0;
		return index;
	};

	Slider.prototype._activateIndicators = function(index){
		// 激活indicator
		this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active');
		this.$indicators.eq(index).addClass('slider-indicator-active');
	};
	
	Slider.prototype._fade = function(index){
		index = this._getCorrectIndex(index);
		if(this.curIndex === index) return;
		this.$items.eq(this.curIndex).showHide('hide');
		this.$items.eq(index).showHide('show');

		this._activateIndicators(index);
		

		this.curIndex = index;

	};
	Slider.prototype._slide = function(index, direction){
		if(this.curIndex === index) return;

		var self= this;

		// 确定滑入滑出的方向
		if(!direction){ // click indicators
			if(this.curIndex < index){
				direction = -1; // 向左滑动
			}else if(this.curIndex > index){
				direction = 1; // 向右滑动
			}
		}

		// 指定滑入幻灯片的初始位置
		this.$items.eq(index).removeClass(this.transitionClass).css('left', -1*direction*this.itemWidth);


		// 当前幻灯片(this.curIndex)滑出可视区域, 指定幻灯片(index)滑入可视区域
		setTimeout(function() {
			self.$items.eq(self.curIndex).move('x',direction*self.itemWidth);
			self.$items.eq(index).addClass(self.transitionClass).move('x',0);
			self.curIndex = index;
		}, 20);		

		this._activateIndicators(index);

		
	};
	Slider.prototype.auto = function(){
		var self = this;
		this.intervalId= setInterval(function(){
			self.to( self._getCorrectIndex(self.curIndex+1), -1);
		}, this.options.interval);

	};
	Slider.prototype.pause = function(){
		clearInterval(this.intervalId);

	};
	

	$.fn.extend({
		slider:function(option){			
			return this.each(function(){
				var $this = $(this),
					slider = $this.data('slider'),
					options = $.extend({}, Slider.DEFAULTS, $this.data(), typeof option==='object'&&option);
				if(!slider){ // first time
					$this.data('slider',slider= new Slider($this,options));
				}				
				
				if(typeof slider[option]==='function'){
					slider[option]();
				}
			})
		}
	})
})(jQuery)