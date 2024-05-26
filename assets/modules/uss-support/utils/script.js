"use strict";

$(function() {

	let lastChat = $('#dt-support .chat-box').last();
	
	if( lastChat.length ) {
		let offsetTop = lastChat.offset().top - lastChat.height();
		document.documentElement.style.scrollBehavior = 'auto';
		setTimeout(function() {
			document.documentElement.scrollTop = offsetTop;
			document.documentElement.style.scrollBehavior = null;
		}, 200);
	};
	
	$("#dt-support").click(function(e) {
		
		let el = e.target;
		while( el && !el.hasAttribute('data-action') ) el = el.parentElement;
		if( !el ) return;
		
		e.preventDefault();
		
		let box = $(el).parents('.chat-box').get(0);
		let key = parseInt(atob(box.dataset.key));
		
		switch( el.dataset.action ) {
			
			case 'reply':
					
					let msg = $(box).find('[data-msg]').html();
					let frame = $(".chat-input-frame"); 
					frame.find(".reply-note").html( msg );
					frame.addClass('show').get(0).scrollIntoView();
					frame.find('form [name="parent_id"]').val( key );
					frame.find('.pointer').attr('data-seek', `#${box.id}`);
					
				break;
				
			case 'delete':
			
					bootbox.confirm({
						message: 'Are you sure you want to delete the message?',
						size: 'small',
						className: 'text-center',
						centerVertical: true,
						closeButton: false,
						buttons: {
							cancel: { 
								label: 'No',
								className: 'btn-primary'
							},
							confirm: { 
								label: 'Yes',
								className: 'btn-danger'
							}
						},
						callback: function(yes) {
							if( !yes ) return;
							$(box).addClass('opacity-50');
							$.ajax({
								url: Uss['ud-ajax'],
								data: {
									id: key,
									nonce: Uss.Nonce,
									route: 'uss-helpdesk-delete-chat'
								},
								method: 'post',
								success: function(response) {
									try {
										let result = JSON.parse( response );
										let type = result.status ? 'warning' : 'error';
										if( result.status ) {
											$(box).fadeOut(function() {
												this.parentElement.removeChild(this);
											});
										} else $(box).removeClass('opacity-50');
										toastr[type]( result.message );
									} catch(e) {
										toastr.error( 'The request Failed' )
										$(box).removeClass('opacity-50');
									}
								}
							});
						}
					});
			
				break;
		};
		
	});
	
	
	$(".chat-input-frame .reply-cancel").click(function() {
		$(".chat-input-frame .reply-note").html( '' );
		$('.chat-input-frame form [name="parent_id"]').val( '' );
		$('.chat-input-frame').removeClass('show');
	});
	
	
	$("[data-seek]").each(function() {
		
		let waiter;
		
		$(this).click(function(e) {
			
			e.preventDefault();
			
			let el = $( this.dataset.seek );
			
			if( el.length ) {
				
				// Scroll Into View;
				el.get(0).scrollIntoView();
				
				// Blink the seeked object;
				let animation = 'animate__flash bg-warning bg-opacity-50';
				if( waiter !== undefined ) return;
				waiter = true;
				
				setTimeout(function() {
					el.addClass( animation );
					setTimeout(function() {
						el.removeClass( animation );
						waiter = undefined;
					}, 1000);
				}, 1000);
				
			};
		
		});
		
	});

});