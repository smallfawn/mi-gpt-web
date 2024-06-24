const { exec } = require('child_process');
const express = require('express');
const { Bucket } = require('./Function');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3344;
app.use(bodyParser.json());

function execDo(shell) {
    return new Promise((resolve, reject) => {
        exec(shell, (error, stdout, stderr) => {
            if (error) {
                console.log(`执行出错: ${error}`);
                reject(false);
            } else {
                console.log(`执行成功: ${stdout}`);

                resolve(stdout);
            }
        });
    });


}
app.get('/api/start', async (req, res) => {
    let a = await execDo('pm2 start pm2.config.js');
    res.send({ status: a ? true : false, data: null, msg: a ? '启动成功' : '启动失败' });
});
app.get('/api/end', async (req, res) => {
    let a = await execDo('pm2 stop pm2.config.js');
    res.send({ status: a ? true : false, data: null, msg: a ? '停止成功' : '停止失败' });
});
app.get('/api/get', (req, res) => {
    const { type } = req.query
    if (type === "env" || type === "speaker") {
        const filePath = type === "env" ? "./env.json" : "./speaker.json";

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.send({ status: false, data: null, msg: `读取文件失败` });
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    res.send({ status: true, data: jsonData, msg: `获取成功` });
                } catch (error) {
                    console.error('JSON 解析错误:', error);
                    res.send({ status: false, data: null, msg: `JSON 解析错误` });
                }
            }
        });
    } else {
        res.send({ status: false, data: null, msg: `获取失败` });
    }
});
app.post('/api/set', (req, res) => {
    const { type } = req.query;
    const data = req.body;
    if (type == "env") {
        const envBucket = new Bucket('./env.json');
        for (let key in data) {
            envBucket.set(key, data[key]);
        }
        res.send({ status: true, data: null, msg: `设置成功` });
    } else if (type == "speaker") {
        const speakerBucket = new Bucket('./speaker.json');
        for (let key in data) {
            speakerBucket.set(key, data[key]);
        }
        res.send({ status: true, data: null, msg: `设置成功` });
    } else {
        res.send({ status: false, data: null, msg: `设置失败` });

    }



});
app.get('/api/log', (req, res) => {
    fs.readFile('./migpt-0.log', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.send({ status: false, data: null, msg: `读取日志文件出错` });
        } else {
            res.send({ status: true, data: data.replaceAll(" ", "").trim().split("\n"), msg: `读取日志文件成功` });
        }
    });
});
app.get('/api/init', async (req, res) => {
    let stdout = await execDo('pm2 ls');
    for (let i = 0; i < stdout.split('\n').length; i++) {
        if (stdout.split('\n')[i].includes('my-app')) {
            if (stdout.indexOf("stopped") != -1) {
                res.send({ status: true, data: null, msg: `未运行` });
                return
            }
            if (stdout.indexOf("online") != -1) {
                res.send({ status: true, data: null, msg: `运行中` });
                return
            }
        }
    }
    res.send({ status: false, data: null, msg: `未找到进程` });


});
app.listen(port, () => {
    console.log(`后端运行在 ${port}`);
});

