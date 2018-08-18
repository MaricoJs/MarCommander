function MarCMD() {
    let setNullFun = (name) => { return () => { console.log(`You registed an action named "${name}", but did not set a handler`) } }
    this.taskList = this.getQueue();
    this.funRegisted = {}
    /**
     * function cmd, regist an action
     * @param {string} arg required,the action name
     * @param {string} des the description of the action 
     * @param {function} callbackFun the action handler
     */
    this.cmd = (arg, des, callbackFun) => {
        let cmdObj = { des: '' }
        if (!arg || arg === null) {
            console.error('Could not set arg name of null or empty string')
        }
        cmdObj.cmd = arg;
        if (des && typeof des === "string") {
            cmdObj.des = des
        } else if (des && typeof des === "function" && !callbackFun) {
            cmdObj.callbackFun = des
        }
        if (callbackFun && typeof callbackFun === "function" && typeof des != "function") {
            cmdObj.callbackFun = callbackFun
        }
        if (!cmdObj.callbackFun) {
            cmdObj.callbackFun = setNullFun(cmdObj.cmd)
        }
        this.funRegisted[cmdObj.cmd] = cmdObj
        return this;
    }
    /**
     * function alias , set an alias name of an action
     * @param {string} aliasName required the alias of the last registed action
     */
    this.alias = (aliasName) => {
        if (aliasName && typeof aliasName === 'string') {
            let index = this.funRegisted.length - 1
            if (index >= 0) {
                let cmdObj = Object.assign({}, this.funRegisted[index])
                cmdObj.cmd = aliasName
                this.funRegisted.push(cmdObj)
            }
        } else {
            console.error('aliasName should be a string')
        }
        return this;
    }
    /**
     * run the action handlers the commander used 
     */
    this.run = () => {
        this.start(this);
    }
}
/**
 * get the arguments of the commander
 * @returns {Object} argsObj , an object contains all the arguments in the commander
 */
MarCMD.prototype.getQueue = () => {
    let args = process.argv;
    return splitArgs(args);
    /**
     * parse node command Array to formatted array
     * @param {Array} argArr 
     */
    function splitArgs(argArr) {
        let splitedArr = []
        let argsObj = {}
        argArr.forEach((v, k) => {
            if (k > 1) {
                if (v.indexOf('--') == 0) {
                    argsObj[getKeyFromCommand(v, '--')] = null
                } else if (v.indexOf('-') == 0) {
                    let paramVal = argArr[k + 1];
                    if (paramVal && paramVal.indexOf('-') != 0) {
                        argsObj[getKeyFromCommand(v, '-')] = paramVal
                    } else {
                        argsObj[getKeyFromCommand(v, '-')] = null
                    }
                }
            } else {
                //break;
            }

        });
        return argsObj;


    }
    /**
     * get paramName or Key from node args which contains the key
     * @param {String} command 
     * @param {String} splitStr 
     */
    function getKeyFromCommand(command, splitStr) {
        return command.replace(splitStr, '')
    }

    /**
     * get the object like {k:v}
     * @param {String} k 
     * @param {String|null} v 
     */
    function getObj(k, v = null) {
        let obj = {}
        obj[k] = v;
        return obj;
    }
}
/**
 * start the action handlers
 */
MarCMD.prototype.start = (marcmd) => {    
    let taskList = marcmd.taskList;
    let funs = marcmd.funRegisted;  
    for (let item in taskList) {
        if (funs[item]) {
            funs[item].callbackFun(taskList[item])
        }
    }
}

module.exports = { MarCMD: new MarCMD() }