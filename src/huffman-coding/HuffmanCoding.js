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

        const isPadded = huffmanCodingRes.encodedStr.length % 2 !== 0;

        const fileHeader = {
            isPadded: isPadded,
            nBits: huffmanCodingRes.nBits,
            nCodes: Object.keys(huffmanCodingRes.charsCoding).length,
            charsCoding: huffmanCodingRes.charsCoding
        };

        const fileHeaderStr = _encodeFileHeader(fileHeader);
        const paddedFileHeader = fileHeaderStr + '0'.repeat(8 - (fileHeaderStr.length % 8));

        const fullBinaryStr = paddedFileHeader + huffmanCodingRes.encodedStr;

        const buffersArr = [];
        for (let i = 0; i < fullBinaryStr.length; i += 8) {
            const byte = fullBinaryStr.substring(i, i + 8);
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

function _encodeFileHeader(fileHeader) {
    let encFileHeaderStr = '';

    encFileHeaderStr += fileHeader.isPadded ? '1' : '0';
    encFileHeaderStr += Utils.toByte(fileHeader.nBits);
    encFileHeaderStr += Utils.toByte(fileHeader.nCodes);
    Object.keys(fileHeader.charsCoding).forEach(key => {
        const keyBinary = Utils.toByte(key.charCodeAt(0));
        encFileHeaderStr += `${keyBinary}${fileHeader.charsCoding[key]}`;
    });

    return encFileHeaderStr;
}
function _parseFileHeader(headerStr) {
    let headerInx = 0;
    const isPadded = Boolean(parseInt(headerStr[headerInx]));
    headerInx++;
    const nBits = parseInt(Utils.getByte(headerStr, headerInx), 2);
    headerInx += 8;
    const nCodes = parseInt(Utils.getByte(headerStr, headerInx), 2);
    headerInx += 8;
    const charsCoding = {};
    for (let i = 0; i < nCodes; i++) {
        const keyBinary = Utils.getByte(headerStr, headerInx);
        headerInx += 8;

        const keyCharCode = parseInt(keyBinary, 2);
        const key = String.fromCharCode(keyCharCode);

        charsCoding[key] = Utils.getBits(headerStr, headerInx, headerInx + nBits);
        headerInx += nBits;
    }

    return {
        isPadded: isPadded,
        nBits: nBits,
        nCodes: nCodes,
        charsCoding: charsCoding
    };
}

export default HuffmanCoding;
