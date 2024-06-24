<script setup>
import { ref, onMounted, watch } from 'vue';
import { start, end, set, get, init, log } from './assets/request';

let userId = ref("")
let password = ref("")
let did = ref("")
let wakeUpKeywords = ref("")
let callAIKeywords = ref("")
let exitKeywords = ref("")
let onEnterAI = ref("")
let onExitAI = ref("")
let typeDefault = ref("speaker")
let logs = ref("")
let initStatus = ref("")
let OPENAI_MODEL = ref("")
let OPENAI_API_KEY = ref("")
let OPENAI_BASE_URL = ref("")
let OPENAI_API_VERSION = ref("")
const activeName = ref('first')
let act = ref("")
//待获取的参数
let postData = ref({})
//检测输入框的变化 如果和get请求后获得的值有变化则 传入到params

//组件加载前
onMounted(async () => {
  let initRes = await init()
  initStatus.value = initRes.msg
  let res = await get("speaker")
  if (res.status == true) {
    //获取小米I D
    userId.value = res.data.userId
    //获取小米密码
    password.value = res.data.password
    did.value = res.data.did
    //获取AI唤醒词
    wakeUpKeywords.value = res.data.wakeUpKeywords
    callAIKeywords.value = res.data.callAIKeywords
    exitKeywords.value = res.data.exitKeywords
    onEnterAI.value = res.data.onEnterAI
    onExitAI.value = res.data.onExitAI
  }
})
async function startButton() {
  let res = await start()
  if (res.status == true) {
    alert("启动成功")
  }
}
async function setButton() {
  let res = await set(typeDefault.value, { "userId": userId.value, "password": password.value })
  if (res.status == true) {
    alert("修改成功")
  }
}
async function endButton() {
  let res = await end()
  if (res.status == true) {
    alert("停止成功")
  }
}

const handleClick = async (tab, Event) => {
  act.value = tab.props.label
  if (tab.props.label.indexOf("log") != -1) {
    let res = await log()
    if (res.status) {
      logs.value = res.data
    }
  } else if (tab.props.label.indexOf("env") != -1) {
    let res = await get("env")
    if (res.status == true) {
      OPENAI_BASE_URL.value = res.data.OPENAI_BASE_URL
      OPENAI_API_KEY.value = res.data.OPENAI_API_KEY
      OPENAI_BASE_URL.value = res.data.OPENAI_BASE_URL
    }
  }
  console.log(tab.props.label)
}
</script>


<template>
  <el-tabs v-model="activeName" class="" @tab-click="handleClick">
    <el-tab-pane label="speaker音箱设置" name="first">
      小米I D:<el-input type="text" v-model="userId" />
      小米密码:<el-input type="password" v-model="password" />
      小爱音箱did:<el-input type="text" v-model="did" />
      AI唤醒词:<el-input type="text" v-model="wakeUpKeywords" />
      调用AI回复命令词:<el-input type="text" v-model="callAIKeywords" />
      AI退出命令:<el-input type="text" v-model="exitKeywords" />
      AI进入欢迎词:<el-input type="text" v-model="onEnterAI" />
      AI退出结束词:<el-input type="text" v-model="onExitAI" />
    </el-tab-pane>
    <el-tab-pane label="env环境变量" name="second">
      OPENAI_BASE_URL:<el-input type="text" v-model="OPENAI_BASE_URL" />
      OPENAI_API_KEY:<el-input type="password" v-model="OPENAI_API_KEY" />
      OPENAI_MODEL:<el-input type="text" v-model="OPENAI_MODEL" />
    </el-tab-pane>
    <el-tab-pane label="system系统设置" name="third"></el-tab-pane>
    <el-tab-pane label="log日志查看" name="fourth">
      <!--<span v-for="(log, index) in logs" :key="index">{{ log + "\n" }}</span>-->

      <span v-for="(log, index) in logs" :key="index">{{ log = log + "\n" }}</span>

    </el-tab-pane>
    <el-tab-pane label="about关于" name="fifth"></el-tab-pane>
  </el-tabs>
  <br>
  <el-text v-if="initStatus == '未运行'" class="mx-1" type="danger">{{ initStatus }}</el-text>
  <el-text v-if="initStatus == '运行中'" class="mx-1" type="success">{{ initStatus }}</el-text>

  <br v-if="act.indexOf('speaker') != -1 || act.indexOf('env') != -1">
  <el-button v-if="act.indexOf('speaker') != -1 || act.indexOf('env') != -1" @click="setButton">修改</el-button>
  <br>
  <el-button @click="startButton">启动</el-button>
  <br>
  <el-button @click="endButton">停止</el-button>
</template>

<style scoped></style>
