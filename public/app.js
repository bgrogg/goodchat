
document.addEventListener("DOMContentLoaded", function(){


  const input = document.getElementById('input');
  const log = document.getElementById('messages');
  const form = document.getElementById('form');
  const usernameInput = document.getElementById('user-input');
  const userList = document.getElementById('user-list');
  var modal = document.getElementById('myModal');

  // const username = document.getElementById('username');
  var conn;
  let user = null;

  conn = new WebSocket('ws://' + window.location.host + '/ws');
  window.conn = conn;

//
  function appendLog(item) {
    let doScroll = log.scrollTop === log.scrollHeight - log.clientHeight;
    log.insertBefore(item, log.firstChild);
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }
//
//

  document.getElementById('user-form').onsubmit = function(){
    if(!conn){
      return false;
    }

    user = usernameInput.value;
    conn.send(JSON.stringify({newuser: user}));
    console.log("send:" + user);
    document.getElementById('user-title').innerHTML = "Hiya " + user + "!";
    modal.style.display = "none";

    return false
  }

  document.getElementById('form').onsubmit = function () {
    console.log("clicked");
    window.msg = input.value;
    window.conn = conn;
      if (!conn) {
          return false;
      }

        conn.send(JSON.stringify({username: user, message: input.value}));
        console.log("Send: " + input.value);



      return false;
  };

    function renderUser(list, username){
      var item = document.createElement("div");
      item.id = "user-item";
      item.innerHTML = username;
      list.appendChild(item);
    }

    function removeUser(username){
      var item = document.getElementById(username);
      item.remove();
    }

    function renderMsg(username, msg) {
      var item = document.createElement("div");
      item.classList.add('message');
      var user = document.createElement("h2");
      user.innerHTML = username;
      var msgItem = document.createElement("div");
      msgItem.innerHTML = msg;
      item.appendChild(user);
      item.appendChild(msgItem);
      return item;
    }


    console.log("websocket", window["WebSocket"]);


    if (window["WebSocket"]) {
      console.log("in websocket");
        conn = new WebSocket('ws://' + window.location.host + '/ws');
        window.conn = conn;


        conn.onclose = function (evt) {
          console.log("in onclose");

            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };


        window.onbeforeunload = function(e){
          conn.send(JSON.stringify({userleft: user}));

        }

        const onmessage = function (evt) {

          var broadcast = JSON.parse(evt.data);
          window.broadcast = broadcast;
          console.log("in onmessage", broadcast);
          if (broadcast.CurrentUsers) {
            userList.innerHTML = '';
            broadcast.CurrentUsers.forEach(function(user){
              renderUser(userList, user);
            });
            console.log("currentusers", broadcast.CurrentUsers);

          } else {
                var item = renderMsg(broadcast.username, broadcast.message)
                appendLog(item);
          }
        };


        conn.addEventListener('message', onmessage);


    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
//
});
