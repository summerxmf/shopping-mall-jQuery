
(function(){
	'user strict';
	var transitionEndEventName = {
		transition:'transitionend',
		MozTransition:'transitionend',
		WebkitTransition:'WebkitTransitionEnd',
		OTransiton:'OTransitonend'
	};
	var isSupport = false,
		transitionEnd='';
	for(var k in transitionEndEventName){
		if(document.body.style[k]!==undefined){
			isSupport = true;
			transitionEnd = transitionEndEventName[k];
			break;
		}
	}
	window.mt = window.mt||{};
	window.mt.transition ={
		isSupport : isSupport,
		end:transitionEnd
	};

})(jQuery)