/**
 * HTML5 Notifications
 * - dependencies: jQuery only if you want to use callForPermission() and checkForPermission() methods.
 *
 * @djalmaaraujo
 * @wilkerlucio
 */ 
var Notifications = {
	apiAvailable: function() {
		if(window.webkitNotifications) {
			return true;
		} else {
			return false;
		}
	},

	isAuthorized: function() {
		if (!this.apiAvailable()) return false;

		return window.webkitNotifications.checkPermission() > 0 ? false : true;
	},

	authorize: function(callback) {
		var self = this;
		if (!this.apiAvailable()) return false;

		window.webkitNotifications.requestPermission(function() {
			if (self.isAuthorized()) {
				callback();
			}
		});
	},

	show: function(url, title, body) {
		if (!this.apiAvailable()) return false;

		var self = this;

		if (this.isAuthorized()) {
			var popup = window.webkitNotifications.createNotification(url, title, body);
			popup.show();
			setTimeout(function(){
				popup.cancel();
			}, 5000);
		} else {
			this.authorize(function() { 
				//console.log(arguments); 
				self.show(url, title, body); 
			});
		}
	},
	
	checkForPermission: function() {
		if (!this.isAuthorized()) this.callForPermission();
	},
	
	callForPermission: function() {
		
		var authorizeBox = jQuery('<div />').addClass('notifications-authorize')
											.html('<p>Seu navegador possui suporte a notificações. Para solicitar uma permissão de notificação, clique no botão abaixo. Aperte "ALLOW" ou "PERMITIR" para a janela de notificação que irá aparecer. <input type="button" value="Ativar notificações" /></p>')
										
		jQuery('body').append(authorizeBox);
		
		jQuery('div.notifications-authorize input').click(function(){
			jQuery(this).remove(); 
			Notifications.authorize();
		});
	}
};

$(function() {
	Notifications.checkForPermission();
});