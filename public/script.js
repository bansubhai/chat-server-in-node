/**
 * Created by pawan on 18/2/17.
 */

var name = prompt("Enter your Name");

var conn = io();

$(function () {

    conn.on("new_conn", function (data) {
        console.log(data);
        data.forEach(function (item) {
            $('#chat').append("<li>" + item.name + ": " + item.msg + "</li>")
        })
    })

    conn.emit("myevent", name);

    $('#send').click(function () {
        conn.emit("send_msg", {name : name, msg : $('#msg').val()});
    })

    conn.on("rcv_msg", function (data) {
        $('#chat').append("<li>" + data.name + ": " + data.msg + "</li>")
    })

})