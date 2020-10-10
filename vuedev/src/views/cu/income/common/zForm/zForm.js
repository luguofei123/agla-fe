export default {
    formatter(form, item, value, callback) {
        switch (item.ruleType) {
            case 'phone':
                this.formatterPhone(item, value, callback);
                break;
            case 'email':
                this.formatterEmail(item, value, callback);
                break;
            case 'calculate':
                this.formatterCalculate(form, item, value, callback);
                break;
        }
    },
    formatterPhone(item, value, callback) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && !myreg.test(value)) {
            callback('请输入合法手机号！');
        }
    },
    formatterEmail(item, value, callback) {
        var myreg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (value && !myreg.test(value)) {
            callback('请输入合法邮箱！');
        }
    },
    formatterCalculate(form, item, value, callback) {
        let rules = [];
        if (item.ruleString) {
            item.ruleString.forEach(i=> {
                rules.push({
                    exp: this.getArray(i.exp),
                    msg: i.msg
                })
            })
        }
        let ruleResult;
        let nowKey = item.key;
        let ruleLastKey;
        let operator;
        let msg;
        for (let i=0; i < rules.length; i++) {
            ruleResult = this.calculateIng(rules[i].exp, form, item);
            ruleLastKey = rules[i].exp[rules[i].exp.length - 1];
            if (typeof ruleResult === 'number') { // number 表示公式结果为 计算 值
                if(nowKey === ruleLastKey && ruleResult !== form.getFieldValue(ruleLastKey)) { // 判断当前校验的是不是 结果 项
                    msg = rules[i].msg
                }
            }else if(typeof ruleResult === 'boolean') { // boolean 表示公式结果为 对比 值
                if(ruleResult === false) {
                    msg = rules[i].msg
                }
                operator = rules[i].exp.find(i=> i.indexOf('=')!=-1);
                if(operator && nowKey !== ruleLastKey) {
                    msg = null;
                }
            }
            if(msg) { // 有一项验证没通过，不继续验证
                break;
            }
        }
        if(msg) {
            callback(msg);
        }

    },
    calculateIng(calculate, form, item) {
        let calculateString = '';
        let fieldValue;
        let result;
        for (let i=0; i<calculate.length; i++) {
            if(calculate[i]==='=') {
                break
            }
            if(calculate[i].length > 2) {
                fieldValue = form.getFieldValue(calculate[i]);
                if(!fieldValue) {
                    fieldValue = 0;
                }
                calculateString = calculateString + fieldValue;
            }else if(calculate[i].length <= 2) {
                calculateString = calculateString + calculate[i];
            }
        }
        result = eval(calculateString);
        if(result === Infinity || result === 'NAN') {
            result = null
        }
        return result;
    },
    getArray(str) {
        let strArray = str.split(/\(|\)/).filter(i => i != "");
        return strArray
    }
}
