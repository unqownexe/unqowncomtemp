const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const fs = require('fs')
const PORT = process.env.PORT || 3000;

let firstCall = `allcategory`
app.get("/", (req, res) => {
    let file = fs.readFileSync(path.join(__dirname, `/index/indexs/${firstCall}.html`), { encoding: "utf-8" })
    let leftpanel = fs.readFileSync(path.join(__dirname, '/index/leftpanel.html'), { encoding: "utf-8" })
    let headerpanel = fs.readFileSync(path.join(__dirname, '/index/header.html'), { encoding: "utf-8" })
    let template = fs.readFileSync(path.join(__dirname, '/index/template.html'), { encoding: "utf-8" })
    res.send(template
        .replace(/APP_PANEL/g, file)
        .replace(/LEFT_PANEL/g, leftpanel)
        .replace(/HEADER_PANEL/g, headerpanel)
    )
})
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on("navigate", data => {
        let date = data.request * 2
        if ((Date.now() - date) <= 30000) {
            console.log(data)
            let checkFile = fs.existsSync(path.join(__dirname, `/index/indexs/${data.type}.html`), { encoding: "utf-8" })
            if (checkFile) {
                let file = fs.readFileSync(path.join(__dirname, `/index/indexs/${data.type}.html`), { encoding: "utf-8" })
                let leftpanel = fs.readFileSync(path.join(__dirname, '/index/leftpanel.html'), { encoding: "utf-8" })
                let headerpanel = fs.readFileSync(path.join(__dirname, '/index/header.html'), { encoding: "utf-8" })
                let template = fs.readFileSync(path.join(__dirname, '/index/template.html'), { encoding: "utf-8" })
                socket.emit(`navigateSuccess`, template
                    .replace(/APP_PANEL/g, file)
                    .replace(/LEFT_PANEL/g, leftpanel)
                    .replace(/HEADER_PANEL/g, headerpanel)
                )
            } else {
                socket.emit(`error`, `Görünüşe göre F12 çılgınlığı yapmaya çalışıyorsun, yapma :)`)
                setTimeout(() => {
                    socket.emit("contactSuccess", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                }, 2000);
            }
        } else {
            socket.emit(`error`, `Görünüşe göre F12 çılgınlığı yapmaya çalışıyorsun, yapma :)`)
            setTimeout(() => {
                socket.emit("contactSuccess", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }, 2000);
        }
    })

    socket.on("contact", data => {
        let date = data.request * 2
        console.log(Date.now() - date)
        if ((Date.now() - date) <= 30000) {
            console.log(data)
            let json = require("./ayarlar.json").contact
            if (json[data.type]) {
                socket.emit("contactSuccess", json[data.type])
            } else {
                socket.emit(`error`, `Görünüşe göre F12 çılgınlığı yapmaya çalışıyorsun, yapma :)`)
                setTimeout(() => {
                    socket.emit("contactSuccess", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                }, 2000);
            }
        } else {
            socket.emit(`error`, `Görünüşe göre F12 çılgınlığı yapmaya çalışıyorsun, yapma :)`)
            setTimeout(() => {
                socket.emit("contactSuccess", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }, 2000);
        }
    })


});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});