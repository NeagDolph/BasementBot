const axios = require("axios");
const express = require("express");
const ngrok = require('ngrok');
const utils = require("./utils.js");

var shared_secret = "58HmnMNmDnFR"

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// var token = "NDcyMjc1NTkyNDk5Mjk4MzA3.XwNU2A.8-gFWM4P_BPl_1q_pS-lZuwDzWk";
var token = "";
var currentMembers;

function updateNumber(num) {
    if (currentMembers !== parseInt(num)) {
        currentMembers = parseInt(num);
        setStatus(`${currentMembers} Kid${currentMembers == 1 ? "" : "s"} In My Basement!`);
        return true

    } else return false
}

app.post("/updateMembers", function(req, res) {
    console.log("Recieved Update through API")
    if (req.body.secret !== shared_secret) {
        res.sendStatus(401)
        return
    };
    if (!token) return;

    let sentUpdate = updateNumber(req.body.count);

    if (sentUpdate) res.sendStatus(200);
    else res.sendStatus(202);
});

function handshakeURL(url) {
    return new Promise((res, rej) => {
        axios.post('https://basement.lemontree.dev/handshakeURL', {
            url, 
            secret: shared_secret
        })
            .then(resp => {
                console.log("Successfully sent endpoint to server")
                res(resp);
            })
            .catch(err => {
                console.log("Error", err);
                rej();
            })
    })
}

async function checkValid(token) {
    let valid;

    try {
        await axios.get('https://discord.com/api/v6/users/@me', {
            headers: {
                authorization: token
            }
        });
        valid = true;
    } catch (err) {
        if (err.response.status == 401) {
            valid = false;
        }
        else {
            utils.interaction.showData("Error", "Unknown Network Error!");
        }
    }

    return valid;
}

function setStatus(status) {
    axios({
        method: "patch",
        url: "https://discord.com/api/v6/users/@me/settings",
        headers: {
            "authorization": token,
            "content-type": "application/json",
        },
        data: `{"custom_status":{"text":"${status}","emoji_name":"🔥"}}`
    })
    .then(res => {
        console.log(`Updated status to: ${status}`);
    })
    .catch(res => {
        console.log("Error", res);
    });
}

async function initScript(callback) {
    let retrievedToken = utils.tokenfile.get();

    if (retrievedToken) {
        loadedToken = retrievedToken;
    } else {
        loadedToken = await utils.interaction.requestData("Discord Auth", "Enter your discord auth token");
        loadedToken = loadedToken.trim();
    }

    let validResponse = await checkValid(loadedToken);
    if (validResponse) {
        token = loadedToken;
        if (!retrievedToken) utils.tokenfile.set(loadedToken)
        console.log("Valid Token!");
        callback()
    } else {
        console.log("Invalid Token!");
        if (retrievedToken) utils.tokenfile.remove();
        initScript();
    }
}

app.listen(8083, () => {
    (async function() {
        await ngrok.authtoken("1ewPCQrJUT8RPYJtdz63zoIM6s4_24xrVZWYu7opRfQEC6WKU");
        let url = await ngrok.connect(8083);
        handshakeURL(url).then((resp) => {
            initScript(() => {
                updateNumber(resp.data);
            });
        });
        setInterval(handshakeURL, 3600000, url)
        console.log(`Started server on ${url}`);
    })();
});