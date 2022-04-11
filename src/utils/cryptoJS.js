import CryptoJS from "crypto-js";

/**
 *
 * 第一个参数word是待加密或者解密的字符串；
 * 第二个参数keyStr是aes加密需要用到的16位字符串的key；
 * 第三个参数是初始化向量 iv。
 */

export default {
    // 加密
    encrypt(word, keyStr, ivStr) {
        const key = CryptoJS.enc.Latin1.parse(keyStr);
        const iv = CryptoJS.enc.Latin1.parse(ivStr);
        return CryptoJS.AES.encrypt(word, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            adding: CryptoJS.pad.ZeroPadding
        }).toString();
    },

    // 解密
    decrypt(word, keyStr, ivStr) {
        const keyStrNew = keyStr;
        const ivStrNew = ivStr;
        const key = CryptoJS.enc.Utf8.parse(keyStrNew);
        let iv = CryptoJS.enc.Utf8.parse(ivStrNew);

        let decrypt = CryptoJS.AES.decrypt(word, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return decrypt.toString(CryptoJS.enc.Utf8);
    }
};
