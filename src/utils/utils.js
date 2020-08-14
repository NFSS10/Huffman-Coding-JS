export const Utils = {
    toByteStr(value) {
        return ('00000000' + value.toString(2)).substr(-8);
    },
    byteStrToBuffer(byteStr) {
        const number = parseInt(byteStr, 2);
        const hexValue = number.toString(16);
        const normalizedHex = hexValue.length === 1 ? `0${hexValue}` : hexValue;

        return Buffer.from(normalizedHex, 'hex');
    },
    bufferToByteStr(buffer) {
        let bitsStr = '';
        for (const hex of buffer) {
            const hexAsBinary = ('00000000' + hex.toString(2)).substr(-8);
            bitsStr += hexAsBinary;
        }

        return bitsStr;
    }
};

export default Utils;
