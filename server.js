/**
 * Created by weimin on 16-10-23.
 */
var app = require("express")();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080)

app.use(require("express").static(path.join(__dirname)));

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"client.html"))
})

io.on("connection",function(socket){
    var username ='';
    socket.on("message",function(msg){
        if (username){
            io.emit("message",{user:username,content:msg});
        }else{
            username=msg;
            io.emit("message",{user:"系统",content:username+"加入聊天室"})
        }
    })
})


