(function($) {

	function ufTooltip(element, options) {
		//$.data($(this.bearer)[0],'tooltip',this.tooltip);
		this.bearer = element;
		this.options = options;
		this.delay;
	}

	ufTooltip.prototype = {
		constructor: ufTooltip,
		show: function() {
			//Close all other tooltips
			$('div.uf-tooltip').hide();
			window.clearTimeout(this.delay);
			this.tooltip.css('display', 'block');
			if(this.options.onShow) {
				this.options.onShow();
			}
		},

		hideTip: function() {
			this.tooltip.hide();
		},

		toggle: function() {
			if(this.tooltip.is(":visible")) {
				this.hideTip();
			} else {
				this.show();
			}
		},

		addAnimation: function() {
			switch(this.options.animation) {
				case 'none':
					break;
				case 'fadeIn':
					this.tooltip.addClass('animated');
					this.tooltip.addClass('fadeIn');
					break;
				case 'flipIn':
					this.tooltip.addClass('animated');
					this.tooltip.addClass('flipIn');
					break;
			}
		},

		setContent: function() {
			$(this.bearer).css('cursor', 'pointer');
			//Get tooltip content
			if(this.options.content) {
				this.content = this.options.content;
			} else if(this.bearer.attr("data-tooltip")) {
				this.content = this.bearer.attr("data-tooltip");
			} else {
				console.log("No content for tooltip: " + this.bearer.selector);
				return;
			}
			if(this.content.charAt(0) == '#') {
				$(this.content).hide();
				this.content = $(this.content);
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}
			var clIcon = '';
			if(this.icon == 'warning') {
				clIcon = 'ufma-yellow';
			} else if(this.icon == 'error') {
				clIcon = 'ufma-red';
			}
			//Create tooltip container
			this.tooltip = $("<div class = 'uf-tooltip " + this.options.theme + " " + this.options.size + " " + this.options.className + ' ' +
				this.options.gravity + "'><div class='uf-tooltip-content' style='text-align:left;'" + (clIcon == "" ? "" : "padding-left:20px;") + "'font-size:14px;'><span class='icon " + clIcon + "' style='position:absolute;left:16px;top:20px;'></span></div><div class = 'tip'></div></div>");
			if(this.contentType == 'html') {
				$(this.content).appendTo(this.tooltip.find('.uf-tooltip-content')).css({
					'display': 'inline-block'
				}).removeClass('none');
			} else {
				this.tooltip.find('.uf-tooltip-content').html(this.content);
			}
			this.tooltip.css({'z-index':2000});
			this.tip = this.tooltip.find(".tip");

			//$(this.bearer).parent().append(this.tooltip);
			$('body').append(this.tooltip); //相对于整个页面
			//Adjust size for html tooltip
			if(this.contentType == 'html') {
				this.tooltip.css('max-width', 'none');
			}
			this.tooltip.css('opacity', this.options.opacity);
			this.addAnimation();
			if(this.options.confirm) {
				this.addConfirm();
			}
			$.data($(this.bearer)[0], 'tooltip', this.tooltip);
		},

		setPositions: function() {
			var leftPos = 0;
			var topPos = 0;
			var tipLeftPos = 0;
			var bearerTop = this.bearer.offset().top;
			var bearerLeft = this.bearer.offset().left;
			switch(this.options.gravity) {
				case 'south':
					leftPos = bearerLeft + this.bearer.outerWidth(true) / 2 - this.tooltip.outerWidth(true) / 2;

					tipLeftPos = bearerLeft - leftPos + this.bearer.outerWidth() / 2;
					topPos = bearerTop - this.tooltip.outerHeight() - this.tip.outerHeight() / 2 - 8;
					break;
				case 'west':
					leftPos = bearerLeft + this.bearer.outerWidth() + this.tip.outerWidth() / 2;
					topPos = bearerTop + this.bearer.outerHeight() / 2 - (this.tooltip.outerHeight() / 2);
					break;
				case 'north':
					leftPos = bearerLeft + this.bearer.outerWidth(true) / 2 - (this.tooltip.outerWidth(true) / 2);

					topPos = bearerTop + this.bearer.outerHeight() + this.tip.outerHeight() / 2 + 8;
					break;
				case 'east':
					leftPos = bearerLeft - this.tooltip.outerWidth() - this.tip.outerWidth() / 2;
					topPos = bearerTop + this.bearer.outerHeight() / 2 - this.tooltip.outerHeight() / 2;
					break;
			}
			if(this.options.gravity == 'north' || this.options.gravity == 'south') {
				if(leftPos < 16) {
					leftPos = 16;
				} else if(leftPos + this.tooltip.outerWidth(true) > $(window).width() - 20) {
					leftPos = $(window).width() - this.tooltip.outerWidth() - 20;
				}
				tipLeftPos = bearerLeft - leftPos + this.bearer.outerWidth() / 2;
			}

			this.tooltip.css('left', leftPos);
			this.tooltip.css('top', topPos);
			if(tipLeftPos != 0) {
				this.tip.css('left', tipLeftPos);
			}

		},

		setEvents: function() {
			var dt = this;
			if(this.options.trigger == "hover" || this.options.trigger == "mouseover" || this.options.trigger == "onmouseover") {
				this.bearer.mouseover(function() {
					dt.setPositions();
					dt.show();
				}).mouseout(function() {
					dt.hideTip();
				});
			} else if(this.options.trigger == "click" || this.options.trigger == "onclik") {
				this.tooltip.click(function(e) {
					e.stopPropagation();
				});
				/*this.bearer.click(function(e) {
					e.preventDefault();
					dt.setPositions();
					dt.toggle();
					e.stopPropagation();
				});*/
				$('html').click(function(e) {
					var target = $(e.target);
					if(target.is(dt.bearer) || target.closest(dt.bearer).length>0){
						return false;
					}
					dt.hideTip();
				})
			}
		},

		activate: function() {
			this.setContent();
			if(this.content) {
				this.setEvents();
				
				this.setPositions();
				this.show();
			}
		},

		addConfirm: function() {
			this.tooltip.append("<div class = 'confirm' style='text-align:right;margin-top:15px;'><a class = 'btn btn-primary uf-tooltip-yes' style='margin-right:5px;height:26px;padding-top:2px;color:#fff;'>" +
				this.options.yes + "</a><a class = 'btn btn-default uf-tooltip-no' style='margin-right:5px;height:26px;padding-top:2px;'>" + this.options.no + "</a></div>");
			this.setConfirmEvents();
		},

		setConfirmEvents: function() {
			var t = this;
			this.tooltip.find('.uf-tooltip-yes').click(function(e) {
				t.onYes();
				e.stopPropagation();
			});
			this.tooltip.find('.uf-tooltip-no').click(function(e) {
				t.onNo();
				e.stopPropagation();
			});
		},

		finalMessage: function() {
			if(this.options.finalMessage) {
				var t = this;
				t.tooltip.find('div:first').html("<span class='icon icon-warning ufma-green' style='position:absolute;left:16px;top:20px;'></span>" + this.options.finalMessage);
				t.tooltip.find('.confirm').remove();
				t.setPositions();
				setTimeout(function() {
					t.hideTip();
					t.setContent();
				}, t.options.finalMessageDuration);
			} else {
				this.hideTip();
			}
		},

		onYes: function() {
			this.options.onYes(this.bearer);
			this.finalMessage();
		},

		onNo: function() {
			this.options.onNo(this.bearer);
			this.hideTip();
		}
	}

	$.fn.ufTooltip = function(options, param) {
		if(typeof options == 'string') {
			return $.fn.ufTooltip.methods[options](this, param);
		}
		this.each(function() {
			var setting = $.extend({}, $.fn.ufTooltip.defaults, options);
			$(this).on('click', function(e) {
				e.preventDefault();
				var tooltip = new ufTooltip($(this), setting);
				tooltip.activate();
			});
		});
	}
	$.fn.ufTooltip.methods = {
		hide: function(el) {
			$(el[0]).closest('.uf-tooltip').hide();
		}
	}
	$.fn.ufTooltip.defaults = {
		opacity: 1,
		content: '',
		size: 'medium',
		className: '',
		gravity: 'south',
		theme: 'light',
		trigger: 'click', //click|hover
		animation: 'none',
		confirm: true,
		yes: '是',
		no: '否',
		icon: '',
		finalMessage: '',
		finalMessageDuration: 1000,
		onYes: function() {},
		onNo: function() {},
		onShow: function() {}
	};
	$.fn.ufTooltip.Constructor = ufTooltip;

})(jQuery);