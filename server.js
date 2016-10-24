/**
 * Created by weimin on 16-10-23.
 */
var app = require("express")();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var sockets ={};

server.listen(8080)

app.use(require("express").static(__dirname));

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"client.html"))
})

io.on("connection",function(socket){
    var username ='';
    socket.on("message",function(msg){
        if (username){
            var ary = msg.match(/^@(.+):\s/);
            if (ary) {//@了某人
                socket.send({user:username,content:msg});
                sockets[ary[1]].emit("message",{user:username,content:msg});
            }else{
                io.emit("message",{user:username,content:msg});
            }

        }else{
            username=msg;
            sockets[username] = socket;//每新加入一个用户，就将其socket保存起来
            io.emit("message",{user:"系统",content:username+"加入聊天室"})
        }
    })
})


