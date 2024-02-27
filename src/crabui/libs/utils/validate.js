/* 常见正则
 * 登录密码--由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间。
 * 邮箱
 * 手机号
 * 是否固定电话
 * 是否短信验证码
 * 面积
 * 姓名
 * 账号名
 * 验证身份证号码
 */
// 使用教程
/**
 * 调用校验 uni.$ca.validate('number', 13333333333)
 * 场景1：我要怎么新增我自己的校验规则？
 * 可以通过uni.$ca.validateCondition.add('custom', (str) => /s+/.test(str), '要插入在那个判断之前')，具体参数说明，请看方法描述
 * 场景2：系统校验有哪些？怎么查看？
 * 可以通过uni.$ca.validateCondition.list()，你就能够看到所有列表，如果你想看细节可以调用uni.$ca.validateCondition.get()
 * 场景3：系统校验太多了，我不需要。
 * 可以通过uni.$ca.validateCondition.reduce(['系统校验的规则名称','系统校验的规则名称'])
*/
class PatternListNode {
    /**
     * val {string} 校验的方法名称
     * pattern {function} 校验方法，返回boolearn值
     * next 下一个校验规则
    */
    constructor(val, pattern = () => { return true }, next = null) {
        this.val = val
        this.pattern = pattern
        this.next = next
    }
}
const conditionListNode = () => {
    // 存放所有的校验规则，这是一个哑结点，无任何作用，仅为了存头指针
    const dumbNode = new PatternListNode('头指针')
    let condition = dumbNode
    function getOrderList() {
        let temp = dumbNode.next
        const ans = []
        while (temp) {
            ans.push(temp.val)
            temp = temp.next
        }
        return ans
    }
    function getListNodeItem(val) {
        let temp = dumbNode.next
        while (temp) {
            if (temp.val === val) {
                return temp
            }
            temp = temp.next
        }
        return null
    }
    return {
        /**
         * name 插入的名称
         * pattern {function(str:any):Boolearn} 插入的表达式，默认会注入一个str
         * insetName 插入之前的节点
        */
        add(name, pattern, insetName) {
            const oldArr = getOrderList()
            if (insetName && oldArr.includes(insetName)) {
                const insertNode = getListNodeItem(insetName)
                insertNode.next = new PatternListNode(name, pattern, insertNode.next)
            } else {
                condition.next = new PatternListNode(name, pattern)
                condition = condition.next
            }
            return this
        },
        // 获取所有校验 条件
        get() {
            return dumbNode.next
        },
        // 对已有的校验条件进行排序或者缩减
        reduce(arr) {
            if (!arr.length) {
                return this
            }
            // 这边要拿到旧的跟传入的进行取并集
            const oldArr = getOrderList()
            const beMixedArr = arr.filter(o => oldArr.includes(o))
            // 生成条件链表
            const dumbTempNode = new PatternListNode(0)
            let temp = dumbTempNode
            beMixedArr.forEach(o => {
                const oListNode = getListNodeItem(o)
                temp.next = new PatternListNode(o, oListNode.pattern)
                temp = temp.next
            })
            dumbNode.next = dumbTempNode.next
            return this
        },
        // 获取校验列表
        list: getOrderList
    }
}
const validateCondition = conditionListNode()
    .add('idcard', checkIdCard)
    .add('password', (str) => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(str))
    .add('email', (str) => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str))
    .add('mobile', (str) => /^1[3456789]\d{9}$/.test(str))
    .add('landline', (str) => /^\d{3,4}-\d{7,8}(-\d{3,4})?$/.test(str))
    .add('verify', (str) => /^\d{6}$/.test(str))
    .add('verify4', (str) => /^\d{4}$/.test(str))
    .add('number', (str) => /^[0-9]*$/.test(str))
    .add('area', (str) => /^[0-9]{2,4}$/.test(str))
    .add('bank', (str) => /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/.test(str ? str.replace(/\s+/g, '') : ''))
    .add('name', (str) => /^[\u4e00-\u9fa50-9A-Za-z]{2,20}$/.test(str))
    .add('userName', (str) => /^[A-Za-z0-9_]{4,10}$/.test(str))
    .add('enNumber', (str) => /^[0-9a-zA-Z]+$/.test(str))
    .add('car', (str) => /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(str))
    .add('notnull', (str) => !!str)

export {
    validateCondition
}

export default function validate(type, str) {
    let validate = false
    // 获取条件
    let condition = validateCondition.get()
    while (condition) {
        if (condition.val === type) {
            validate = condition.pattern(str)
            break
        }
        condition = condition.next
    }
    return {
        validate,
        message: !validate ? (str ? '格式错误' : '不能为空') : '校验正确'
    }
}

function checkIdCard(idCard) {
    // 15位和18位身份证号码的正则表达式
    const regIdCard =
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length === 18) {
            const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
            const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
            let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
            for (let i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
            }
            const idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
            const idCardLast = idCard.substring(17) // 得到最后一位身份证号码
            // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod === 2) {
                if (['x', 'X'].includes(idCardLast)) {
                    return true
                } else {
                    return false
                }
            } else {
                // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast === idCardY[idCardMod]) {
                    return true
                } else {
                    return false
                }
            }
        }
        return true
    } else {
        return false
    }
}
