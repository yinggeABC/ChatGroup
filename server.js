/**
 * Created by weimin on 16-10-23.
 */
var app = require("express")();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var status = {};
var sockets={};

server.listen(8080)

app.use(require("express").static(path.join(__dirname)));

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"client.html"))
})

io.on("connection",function(socket){
    io.emit("status",status);
    var username ='';
    var inRoom='';

    socket.on("join",function(room){
        inRoom = room;
        socket.join(room);
        status[username] = room;
        io.emit("status",status);
    })
    socket.on("leave",function(room){
        inRoom = '';
        socket.leave(room);
        status[username] = "outer";
        io.emit("status",status);
    })
    socket.on("message",function(msg){
        if (username){
            var ary = msg.match(/^@(.+):\s/);
            if (ary) {//@了某人
                socket.send({user:username,content:msg});
                sockets[ary[1]].emit("message",{user:username,content:msg});
                return;
            }
            if (inRoom){
                io.in(inRoom).emit("message",{user:username,content:msg});
            }else{
                io.emit("message",{user:username,content:msg})
            }
        }else{
            username=msg;
            sockets[username] = socket;//每新加入一个用户，就将其socket保存起来
            status[username]="outer";
            io.emit("message",{user:"系统",content:username+"加入聊天室"})
            io.emit("status",status);//将用户及其所对应的状态:在room1 / room2 / 大厅 返回给前台
        }
    })
})


