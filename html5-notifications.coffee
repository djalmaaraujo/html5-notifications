###
  HTML5 Notifications
  - dependencies: jQuery

  @djalmaaraujo
###

$ = jQuery

class @Notifications
  constructor: (authorize) ->
    @checkForPermission() if authorize

  isAuthorized: ->
    return false unless @apiAvailable()

    window.webkitNotifications.checkPermission() == 0

  apiAvailable: ->
    window.webkitNotifications

  authorize: (cb) ->
    return false unless @apiAvailable()

    webkitNotifications.requestPermission(cb)

  show: (url, title, body) ->
    return false unless @apiAvailable()

    if @isAuthorized()
      popup = window.webkitNotifications.createNotification(url, title, body)
      popup.show()

      setTimeout (->
        popup.cancel()
      ), 5000

      true
    else
       @callForPermission => @show(url, title, body)

  checkForPermission: ->
    @callForPermission() unless @isAuthorized()

  callForPermission: (cb) ->
    return false unless @apiAvailable()

    authorizeBox = $('<div />').addClass('notifications-authorize')
                      .html('<p>Seu navegador possui suporte a notificações. Para solicitar uma permissão de notificação, clique no botão abaixo. Aperte "ALLOW" ou "PERMITIR" para a janela de notificação que irá aparecer. <input type="button" value="Ativar notificações" /></p>')

    $('body').append(authorizeBox);

    authorizeBox.find('input').on 'click', =>
      authorizeBox.remove()
      @authorize(cb)