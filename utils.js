var shell = require('node-powershell');
const fs = require('fs');
const os = require("os");


var ps;

var interaction = {
    requestData(title, message) {
        if (!shell) ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        ps.addCommand("[void][Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic')");
        ps.addCommand(`$text = [Microsoft.VisualBasic.Interaction]::InputBox('${message}', '${title}')`);
        ps.addCommand("echo $text");
        return ps.invoke();
    },
    showData(title, message) {
        if (!shell) ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        ps.addCommand("Add-Type -AssemblyName System.Windows.Forms");
        ps.addCommand(`[System.Windows.Forms.MessageBox]::Show('${message}', '${title}')`);
    }
}

var tokenfile = {
    set(token) {
        fs.writeFile(os.tmpdir() + "\\basement_bot_token_store", token, err => {
            if (err) return console.log(err);
        });
    },
    get() {
        try { 
            return fs.readFileSync(os.tmpdir() + "\\basement_bot_token_store", 'utf8');
        } catch (err) {
            
            if (err.code === 'ENOENT') {
                return undefined;
            } else {
                throw err;
            }
        }
    },
    remove() {
        fs.unlink(os.tmpdir() + "\\basement_bot_token_store", Function());
    },
}

module.exports.tokenfile = tokenfile;
module.exports.interaction = interaction;