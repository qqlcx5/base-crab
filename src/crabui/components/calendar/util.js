import CALENDAR from './calendar.js'

class Calendar {
    constructor({
        selected,
        startDate,
        endDate,
        type,
        formatter,
        weekTexts = ['日', '一', '二', '三', '四', '五', '六']
    } = {}) {
        // 当前日期
        this.date = this.getDate(new Date()) // 当前初入日期
        // 打点信息
        this.selected = selected || []
        // 范围开始
        this.startDate = startDate
        // 范围结束
        this.endDate = endDate
        // 是否启动范围
        this.type = type
        // 清除多选状态
        this.resetRangeStatus()
        // 面板上的所有日期
        this.weeks = {}
        // 所有日期信息
        this.calender = []
        this.weekTexts = weekTexts
        this.selectDate = {}
        this.formatter = formatter
    }

    setProp(pro, proVal) {
        this[pro] = proVal
        this.resetRangeStatus()
    }

    /**
     * 设置日期
     * @param {Object} date
     */
    setDate(date) {
        const selectDate = this.getDate(date)
        date && (this.selectDate = selectDate)
        this._getWeek(selectDate.fullDate)
    }

    /**
     * 清理多选状态
     */
    resetRangeStatus() {
        this.multipleStatus = {
            before: '',
            after: '',
            dates: []
        }
        this.selectDate = {}
    }

    /**
     * 重置开始日期
     */
    setSatrtDate(startDate) {
        // 范围开始
        this.startDate = startDate
    }

    /**
     * 重置结束日期
     */
    setEndDate(endDate) {
        // 范围结束
        this.endDate = endDate
    }

    /**
     * 获取任意时间
     */
    getDate(date, AddDayCount = 0, str = 'day') {
        if (!date) {
            date = new Date()
        }
        if (typeof date !== 'object') {
            date = date.replace(/-/g, '/')
        }
        const dd = new Date(date)
        switch (str) {
            case 'day':
                dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
                break
            case 'month':
                dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
                break
            case 'year':
                dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
                break
        }
        const y = dd.getFullYear()
        const m = dd.getMonth() + 1 // 获取当前月份的日期
        const d = dd.getDate() // 获取当前几号
        return {
            fullDate: `${y}-${this._zeroFill(m)}-${this._zeroFill(d)}`,
            year: y,
            month: m,
            date: d,
            day: dd.getDay()
        }
    }

    /**
     * 获取上月剩余天数
     */
    _getLastMonthDays(firstDay, date) {
        const dateArr = []
        const full = this.getDate(date, -1, 'month')
        for (let i = firstDay; i > 0; i--) {
            dateArr.push(this._formatDay(`${full.year}-${this._zeroFill(full.month)}-${this._zeroFill(new Date(full.year, full.month, -i + 1).getDate())}`, true))
        }
        return dateArr
    }

    /**
     * 获取本月天数
     */
    _currentMonthDys(dateData, date) {
        const dateArr = []
        const full = this.getDate(date)
        for (let i = 1; i <= dateData; i++) {
            dateArr.push(this._formatDay(`${full.year}-${this._zeroFill(full.month)}-${this._zeroFill(i)}`))
        }
        return dateArr
    }

    /**
     * 获取下月天数
     */
    _getNextMonthDays(surplus, date) {
        const dateArr = []
        const full = this.getDate(date, 1, 'month')
        for (let i = 1; i < surplus + 1; i++) {
            dateArr.push(this._formatDay(`${full.year}-${this._zeroFill(full.month)}-${this._zeroFill(i)}`, true))
        }
        return dateArr
    }

    // 0填充
    _zeroFill(num) {
        return String(num > 9 ? num : `0${num}`)
    }

    /**
     * 组装日期格式
     */
    _formatDay(nowDate, isGrey = false) {
        const fullDate = this.date.fullDate
        const full = this.getDate(nowDate)
        // 是否今天
        const isDay = fullDate === nowDate
        // 获取打点信息
        const extraInfo = this.selected && this.selected.find((item) => this.dateEqual(nowDate, item.date))

        // 日期禁用
        let disableBefore = true
        let disableAfter = true
        if (this.startDate) {
            disableBefore = this.dateCompare(this.startDate, nowDate)
        }

        if (this.endDate) {
            disableAfter = this.dateCompare(nowDate, this.endDate)
        }
        const checked = this.multipleStatus.dates.findIndex((item) => {
            return this.dateEqual(item, nowDate)
        }) !== -1
        const date = Number(full.date)
        const isBefore = this.dateEqual(this.multipleStatus.before, nowDate)
        const isAfter = this.dateEqual(this.multipleStatus.after, nowDate)
        // 是否是头尾节点
        const isheadOrTail = isBefore || isAfter
        const type = !(disableBefore && disableAfter) ? 'disabled' : (isBefore ? 'start' : this.getDateLocation(nowDate, this.multipleStatus.dates))
        const multiple = this.type !== 'single' ? checked : false
        const data = {
            fullDate: nowDate,
            year: full.year,
            date,
            multiple,
            type,
            range: multiple && type === 'middle',
            month: full.month,
            lunar: this.getlunar(full.year, full.month, date),
            isGrey,
            isDay,
            checked: this.type !== 'single' ? (checked || isheadOrTail) : this.selectDate.fullDate === nowDate,
            extraInfo
        }
        return this.formatter?.(data) || data
    }

    /**
     * 获取当前日期详情
     * @param {Object} date
     */
    getInfo(date) {
        date = date || new Date()
        const dateInfo = this.calender.find(item => item.fullDate === this.getDate(date).fullDate)
        return dateInfo
    }

    /**
     * @description:
     * @param {String} date 日期
     * @param {Array} dates 日期组
     * @return {String} 可能值是 selected（选中，无相邻） | start（开头，无上选中节点有下个选中节点） | end（结尾，有上选中节点，无下选中节点） | middle（中间，有头尾节点在两边）
     */
    getDateLocation(date, dates) {
        date = Number(date.replace(/-/g, ''))
        const newDates = dates.map(o => Number(o.replace(/-/g, ''))).sort((a, b) => a - b)
        // 分组
        const groupArr = []
        newDates.forEach(o => {
            const last = groupArr.slice(-1)[0] || []
            // 说明相邻，插入到当前项中
            if (last.slice(-1)[0] + 1 === o) {
                last.push(o)
                groupArr.splice(-1, 1, last)
            } else {
                groupArr.push([o])
            }
        })
        // 分组中找所在位置
        for (const list of groupArr) {
            const exitIndex = list.findIndex(o => o === date)
            if (exitIndex !== -1) {
                if (exitIndex === 0) {
                    if (list.length === 1) {
                        return 'selected'
                    } else {
                        return 'start'
                    }
                } else {
                    return list.length === exitIndex + 1 ? 'end' : 'middle'
                }
            }
        }
    }

    /**
     * 比较时间大小
     */
    dateCompare(startDate, endDate) {
        // 计算截止时间
        startDate = new Date(startDate.replace(/-/g, '/'))
        // 计算详细项的截止时间
        endDate = new Date(endDate.replace(/-/g, '/'))
        if (startDate.getTime() <= endDate.getTime()) {
            return true
        } else {
            return false
        }
    }

    /**
     * 比较时间是否相等
     */
    dateEqual(before, after) {
        if (before.replace(/-/g, '/') === after.replace(/-/g, '/')) {
            return true
        } else {
            return false
        }
    }

    /**
     * 获取日期范围内所有日期
     * @param {Object} begin
     * @param {Object} end
     */
    geDateAll(begin, end) {
        const arr = []
        if (!begin || !end) return arr
        const ab = begin.split('-')
        const ae = end.split('-')
        const db = new Date()
        db.setFullYear(ab[0], ab[1] - 1, ab[2])
        const de = new Date()
        de.setFullYear(ae[0], ae[1] - 1, ae[2])
        const unixDb = db.getTime() - 24 * 60 * 60 * 1000
        const unixDe = de.getTime() - 24 * 60 * 60 * 1000
        for (let k = unixDb; k <= unixDe;) {
            k = k + 24 * 60 * 60 * 1000
            arr.push(this.getDate(new Date(parseInt(k))).fullDate)
        }
        return arr
    }

    /**
     * 计算阴历日期显示
     */
    getlunar(year, month, date) {
        return CALENDAR.solar2lunar(year, month, date)
    }

    /**
     * 设置打点
     */
    setSelectInfo(data, value) {
        this.selected = value
        this._getWeek(data)
    }

    /**
    *  设置范围状态
    */
    setRange(fullDate) {
        if (this.type !== 'range') return
        if (!this.multipleStatus.before || this.multipleStatus.after) {
            this.multipleStatus.before = fullDate
            this.multipleStatus.after = ''
        } else {
            // 如果日期相等，则不做处理
            if (this.dateEqual(this.multipleStatus.before, fullDate)) return
            if (this.dateCompare(this.multipleStatus.before, fullDate)) {
                this.multipleStatus.after = fullDate
            } else {
                this.multipleStatus.after = this.multipleStatus.before
                this.multipleStatus.before = fullDate
            }
        }
        this.multipleStatus.dates = this.geDateAll(this.multipleStatus.before, this.multipleStatus.after)
        this._getWeek(fullDate)
    }

    /**
    *  设置多选状态
    */
    setMultiple(fullDate) {
        const exitIndex = this.multipleStatus.dates.findIndex(o => o === fullDate)
        if (exitIndex === -1) {
            this.multipleStatus.dates.push(fullDate)
        } else {
            this.multipleStatus.dates.splice(exitIndex, 1)
        }
        this._getWeek(fullDate)
    }

    /**
     * 获取每周数据
     * @param {Object} dateData
     */
    _getWeek(dateData) {
        const {
            year,
            month
        } = this.getDate(dateData)
        const firstDay = new Date(year, month - 1, 1).getDay()
        const currentDay = new Date(year, month, 0).getDate()
        this.calender = [].concat(
            this._getLastMonthDays(firstDay, dateData), // 上个月末尾几天
            this._currentMonthDys(currentDay, dateData), // 本月天数
            this._getNextMonthDays(42 - firstDay - currentDay, dateData)// 下个月开始几天
        )
        this.weeks = this._setArrData(this.calender, 7)
    }

    /**
     * 一维数组转多维数组
     * @parmas arr { Array } 需要转化的原数组
     * @parmas num { Number } 一个维度几个
     * @return { Array }
     */
    _setArrData(arr = [], num = 2) {
        const len = Math.ceil(arr.length / num)
        const temp = new Array(len)
        for (let i = 0; i < len; i++) {
            temp[i] = arr.slice(i * num, (i + 1) * num)
        }
        return temp
    }
}
export default Calendar
