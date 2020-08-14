import { Node } from './Node';
import { Utils } from '../utils';

export const HuffmanCoding = {
    encode(str) {
        const charsFreq = _calculateCharsFrequency(str);

        let treeNodes = _buildNodes(charsFreq);
        while (treeNodes.length !== 1) {
            treeNodes = _joinNodes(treeNodes);
        }

        const charsCoding = {};
        const charsCodingMatch = {};
        _encodeTree(treeNodes[0], '', charsCoding, charsCodingMatch);

        let encodedStr = '';
        for (let i = 0; i < str.length; i++) {
            encodedStr += charsCoding[str[i]];
        }
        const nBits = Math.floor(encodedStr.length / Object.keys(charsFreq).length);

        return {
            encodedStr: encodedStr,
            charsFreq: charsFreq,
            charsCoding: charsCoding,
            charsCodingMatch: charsCodingMatch,
            nBits: nBits
        };
    },
    encodeToBuffer(str) {
        const huffmanCodingRes = this.encode(str);
        const header = {
            isPadded: (huffmanCodingRes.encodedStr.length % 2) !== 0,
            nBits: huffmanCodingRes.nBits,
            nCodes: Object.keys(huffmanCodingRes.charsCoding).length,
            charsCoding: huffmanCodingRes.charsCoding
        };

        const headerBytes = _headerToBytes(header);
        const fullBytes = headerBytes + huffmanCodingRes.encodedStr;

        const buffersArr = [];
        for (let i = 0; i < fullBytes.length; i += 8) {
            let byte = Utils.getByte(fullBytes, i);
            if (i + 8 >= fullBytes.length) {
                byte = byte.length < 8 ? byte + '0'.repeat(8 - (byte.length % 8)) : byte;
            }

            buffersArr.push(Utils.byteToBuffer(byte));
        }

        const buffer = Buffer.concat(buffersArr);
        return buffer;
    },
    decode(encodedStr, charsCodingMatch, nBits) {
        if (!nBits) return null;

        let decodedStr = '';
        for (let i = 0; i < encodedStr.length; i += nBits) {
            const code = encodedStr.substring(i, i + nBits);
            decodedStr += charsCodingMatch[code];
        }

        return decodedStr;
    },
    decodeFromBuffer(buffer) {
        // TODO
    }
};

function _calculateCharsFrequency(str) {
    const charsFreq = {};
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        charsFreq[char] = charsFreq[char] ? charsFreq[char] + 1 : 1;
    }

    return charsFreq;
}

function _buildNodes(charsFreq) {
    const sortedChars = Object.keys(charsFreq).sort((a, b) => charsFreq[a] - charsFreq[b]);

    const nodes = [];
    for (let i = 0; i < sortedChars.length; i += 2) {
        const char1 = sortedChars[i] ? sortedChars[i] : null;
        const char2 = sortedChars[i + 1] ? sortedChars[i + 1] : null;

        const char1Freq = charsFreq[char1] ? charsFreq[char1] : 0;
        const char2Freq = charsFreq[char2] ? charsFreq[char2] : 0;

        const newNode = new Node(char1Freq + char2Freq, char1, char2);
        nodes.push(newNode);
    }

    return nodes;
}

function _joinNodes(nodes) {
    const joinedNodes = [];
    for (let i = 0; i < nodes.length; i += 2) {
        const node1 = nodes[i] ? nodes[i] : null;
        const node2 = nodes[i + 1] ? nodes[i + 1] : null;

        const n1Value = node1 ? node1.value : 0;
        const n2Value = node2 ? node2.value : 0;

        const joinedNode = new Node(n1Value + n2Value, node1, node2);
        joinedNodes.push(joinedNode);
    }

    return joinedNodes;
}

function _encodeTree(node, code, charsCoding, charsCodingMatch) {
    if (!node) return;

    if (node.left || node.right) {
        _encodeTree(node.left, `${code}0`, charsCoding, charsCodingMatch);
        _encodeTree(node.right, `${code}1`, charsCoding, charsCodingMatch);
    } else {
        charsCoding[node] = code;
        charsCodingMatch[code] = node;
    }
}

function _headerToBytes(header) {
    let bytesStr = '';

    bytesStr += header.isPadded ? '1' : '0'; // TODO maybe this won't be needed
    bytesStr += Utils.toByte(header.nBits);
    bytesStr += Utils.toByte(header.nCodes);
    Object.keys(header.charsCoding).forEach(key => {
        const keyBinary = Utils.toByte(key.charCodeAt(0));
        bytesStr += `${keyBinary}${header.charsCoding[key]}`;
    });

    const paddedBytesStr = bytesStr + '0'.repeat(8 - (bytesStr.length % 8));
    return paddedBytesStr;
}

function _bytesToHeader(headerBytes) {
    let bitIdx = 0;

    const isPadded = Boolean(parseInt(headerBytes[bitIdx]));
    bitIdx++;

    const nBits = parseInt(Utils.getByte(headerBytes, bitIdx), 2);
    bitIdx += 8;

    const nCodes = parseInt(Utils.getByte(headerBytes, bitIdx), 2);
    bitIdx += 8;

    const charsCoding = {};
    for (let i = 0; i < nCodes; i++) {
        const keyBinary = Utils.getByte(headerBytes, bitIdx);
        const keyCharCode = parseInt(keyBinary, 2);
        const key = String.fromCharCode(keyCharCode);
        bitIdx += 8;

        charsCoding[key] = Utils.getBits(headerBytes, bitIdx, bitIdx + nBits);
        bitIdx += nBits;
    }

    return {
        isPadded: isPadded,
        nBits: nBits,
        nCodes: nCodes,
        charsCoding: charsCoding
    };
}

export default HuffmanCoding;
