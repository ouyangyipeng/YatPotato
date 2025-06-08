/**
 * StringRef - 类似 Rust 字符串引用的 JavaScript 实现
 * 提供安全的字符串操作和不可变性保证
 */
class StringRef {
    constructor(str) {
        if (typeof str !== 'string') {
            throw new TypeError('StringRef 只能包装字符串类型');
        }
        this._value = str;
        Object.freeze(this);
    }

    // 获取原始字符串值
    value() {
        return this._value;
    }

    // 字符串长度
    len() {
        return this._value.length;
    }

    // 检查是否为空
    isEmpty() {
        return this._value.length === 0;
    }

    // 字符串切片 (类似 Rust 的 &str[start..end])
    slice(start, end) {
        const sliced = this._value.slice(start, end);
        return new StringRef(sliced);
    }

    // 获取指定位置的字符
    charAt(index) {
        if (index < 0 || index >= this._value.length) {
            return null;
        }
        return this._value.charAt(index);
    }

    // 查找子字符串位置
    find(substr) {
        const index = this._value.indexOf(substr);
        return index === -1 ? null : index;
    }

    // 检查是否包含子字符串
    contains(substr) {
        return this._value.includes(substr);
    }

    // 检查是否以指定字符串开始
    startsWith(prefix) {
        return this._value.startsWith(prefix);
    }

    // 检查是否以指定字符串结束
    endsWith(suffix) {
        return this._value.endsWith(suffix);
    }

    // 分割字符串
    split(separator) {
        return this._value.split(separator).map(s => new StringRef(s));
    }

    // 去除首尾空白字符
    trim() {
        return new StringRef(this._value.trim());
    }

    // 转换为小写
    toLowerCase() {
        return new StringRef(this._value.toLowerCase());
    }

    // 转换为大写
    toUpperCase() {
        return new StringRef(this._value.toUpperCase());
    }

    // 替换字符串
    replace(searchValue, replaceValue) {
        return new StringRef(this._value.replace(searchValue, replaceValue));
    }

    // 全局替换
    replaceAll(searchValue, replaceValue) {
        return new StringRef(this._value.replaceAll(searchValue, replaceValue));
    }

    // 重复字符串
    repeat(count) {
        return new StringRef(this._value.repeat(count));
    }

    // 字符串匹配 (返回匹配结果)
    match(regexp) {
        return this._value.match(regexp);
    }

    // 测试正则表达式
    test(regexp) {
        return regexp.test(this._value);
    }

    // 字符串比较
    equals(other) {
        if (other instanceof StringRef) {
            return this._value === other._value;
        }
        return this._value === other;
    }

    // 字符串连接 (返回新的 StringRef)
    concat(...others) {
        const concatenated = others.reduce((acc, curr) => {
            if (curr instanceof StringRef) {
                return acc + curr._value;
            }
            return acc + curr;
        }, this._value);
        return new StringRef(concatenated);
    }

    // 填充字符串开头
    padStart(targetLength, padString = ' ') {
        return new StringRef(this._value.padStart(targetLength, padString));
    }

    // 填充字符串结尾
    padEnd(targetLength, padString = ' ') {
        return new StringRef(this._value.padEnd(targetLength, padString));
    }

    // 转换为字符数组
    chars() {
        return Array.from(this._value);
    }

    // 字节长度 (UTF-8)
    byteLength() {
        return new TextEncoder().encode(this._value).length;
    }

    // 安全的字符串访问 (返回 Option 类型的模拟)
    get(index) {
        if (index < 0 || index >= this._value.length) {
            return { isSome: false, isNone: true, value: null };
        }
        return { isSome: true, isNone: false, value: this._value[index] };
    }

    // 迭代器支持
    [Symbol.iterator]() {
        let index = 0;
        const value = this._value;
        return {
            next() {
                if (index < value.length) {
                    return { value: value[index++], done: false };
                }
                return { done: true };
            }
        };
    }

    // toString 方法
    toString() {
        return this._value;
    }

    // JSON 序列化
    toJSON() {
        return this._value;
    }

    // 类型检查
    static isStringRef(obj) {
        return obj instanceof StringRef;
    }

    // 从其他类型创建 StringRef
    static from(value) {
        if (value instanceof StringRef) {
            return value;
        }
        return new StringRef(String(value));
    }

    // 获取今天的日期，格式为 "YYYY-M-D"
    static today() {
        const now = new Date();
        const epoch = new Date(1970, 0, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysSinceEpoch = Math.floor((now.getTime() - epoch.getTime()) / msPerDay);
        return new StringRef(daysSinceEpoch.toString());
    }
}

// module.exports = StringRef;
export default StringRef
