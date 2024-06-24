const envConfig = require('./env.json');
let pm2Config = {
    apps: [
        {
            name: 'my-app', // 应用名称
            script: 'app.js', // 应用的入口文件

            // 日志配置
            log_file: 'migpt.log', // 日志文件路径
            //error_file: 'migpt_error.log', // 错误日志文件路径
            //out_file: 'migpt_out.log', // 标准输出日志文件路径

            // 其他选项
            instances: 1, // 进程实例数
            autorestart: false, // 发生错误时自动重启
            watch: false, // 监视文件变化，自动重启
            max_memory_restart: '1G', // 内存超过1GB时自动重启
            env: {
                NODE_ENV: 'production',
                "OPENAI_MODEL": envConfig.OPENAI_MODEL,
                "OPENAI_API_KEY": envConfig.OPENAI_API_KEY,
                "OPENAI_BASE_URL": envConfig.OPENAI_BASE_URL,
                "OPENAI_API_VERSION": envConfig.OPENAI_API_VERSION,
            },
            env_production: {
                NODE_ENV: 'production',
                "OPENAI_MODEL": envConfig.OPENAI_MODEL,
                "OPENAI_API_KEY": envConfig.OPENAI_API_KEY,
                "OPENAI_BASE_URL": envConfig.OPENAI_BASE_URL,
                "OPENAI_API_VERSION": envConfig.OPENAI_API_VERSION,
            }
        }
    ]
};
if (envConfig.AUDIO_STATUS) {
    pm2Config.apps[0].env["AUDIO_SILENT"] = envConfig.AUDIO_SILENT;
    pm2Config.apps[0].env["AUDIO_BEEP"] = envConfig.AUDIO_BEEP;
    pm2Config.apps[0].env["AUDIO_ACTIVE"] = envConfig.AUDIO_ACTIVE;
    pm2Config.apps[0].env["AUDIO_ERROR"] = envConfig.AUDIO_ERROR;
}
if (envConfig.TTS_STATUS) {
    pm2Config.apps[0].env["TTS_BASE_URL"] = envConfig.TTS_BASE_URL;
}
module.exports = pm2Config;