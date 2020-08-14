export const Utils = {
    toByte(value) {
        return ('00000000' + value.toString(2)).substr(-8);
    },
    getBits(bitsStr, startBitIndex, endBitIndex) {
        return bitsStr.substring(startBitIndex, endBitIndex);
    },
    getByte(bytesStr, bitIndex) {
        return this.getBits(bytesStr, bitIndex, bitIndex + 8);
    },
    byteToBuffer(byteStr) {
        const number = parseInt(byteStr, 2);
        const hexValue = number.toString(16);
        const normalizedHex = hexValue.length === 1 ? `0${hexValue}` : hexValue;

        return Buffer.from(normalizedHex, 'hex');
    },
    bufferToBytes(buffer) {
        let byteStr = '';
        for (const hex of buffer) {
            byteStr += this.toByte(hex);
        }

        return byteStr;
    }
};

export default Utils;
