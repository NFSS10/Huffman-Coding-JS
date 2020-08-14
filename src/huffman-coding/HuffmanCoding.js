import { Node } from './Node';
import { Utils } from '../utils';

// TODO fix padding problems e talvez nao usar o valor decimal, mas sim hex
const testNumbers = [];

export const HuffmanCoding = {
    encode(str) {
        const charsFreq = this._calculateCharsFrequency(str);

        let treeNodes = this._buildNodes(charsFreq);
        while (treeNodes.length !== 1) {
            treeNodes = this._joinNodes(treeNodes);
        }

        const charsCoding = {};
        const charsCodingMatch = {};
        this._encodeTree(treeNodes[0], '', charsCoding, charsCodingMatch);

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

        const fileHeaderStr = this._encodeFileHeader(fileHeader);
        const paddedFileHeader = fileHeaderStr + '0'.repeat(8 - (fileHeaderStr.length % 8));

        const fullBinaryStr = paddedFileHeader + huffmanCodingRes.encodedStr;

        const buffersArr = [];
        for (let i = 0; i < fullBinaryStr.length; i += 8) {
            const byte = fullBinaryStr.substring(i, i + 8);
            buffersArr.push(Utils.byteStrToBuffer(byte));
        }

        const buffer = Buffer.concat(buffersArr);
        return buffer;
    },
    _encodeFileHeader(fileHeader) {
        let encFileHeaderStr = '';

        encFileHeaderStr += fileHeader.isPadded ? '1' : '0';
        encFileHeaderStr += Utils.toByteStr(fileHeader.nBits);
        encFileHeaderStr += Utils.toByteStr(fileHeader.nCodes);
        Object.keys(fileHeader.charsCoding).forEach(key => {
            const keyBinary = Utils.toByteStr(key.charCodeAt(0));
            encFileHeaderStr += `${keyBinary}${fileHeader.charsCoding[key]}`;
        });

        return encFileHeaderStr;
    },
    _parseFileHeader(headerStr) {
        let headerInx = 0;
        const isPadded = Boolean(parseInt(headerStr[headerInx]));
        headerInx++;
        const nBits = parseInt(headerStr.substring(headerInx, headerInx + 8), 2);
        headerInx += 8;
        const nCodes = parseInt(headerStr.substring(headerInx, headerInx + 8), 2);
        headerInx += 8;
        const charsCoding = {};
        for (let i = 0; i < nCodes; i++) {
            const keyBinary = headerStr.substring(headerInx, headerInx + 8);
            headerInx += 8;

            const keyCharCode = parseInt(keyBinary, 2);
            const key = String.fromCharCode(keyCharCode);

            charsCoding[key] = headerStr.substring(headerInx, headerInx + nBits);
            headerInx += nBits;
        }

        return {
            isPadded: isPadded,
            nBits: nBits,
            nCodes: nCodes,
            charsCoding: charsCoding
        };
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
    _calculateCharsFrequency(str) {
        const charsFreq = {};
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            charsFreq[char] = charsFreq[char] ? charsFreq[char] + 1 : 1;
        }

        return charsFreq;
    },
    _buildNodes(charsFreq) {
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
    },
    _joinNodes(nodes) {
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
    },
    _encodeTree(node, code, charsCoding, charsCodingMatch) {
        if (!node) return;

        if (node.left || node.right) {
            this._encodeTree(node.left, `${code}0`, charsCoding, charsCodingMatch);
            this._encodeTree(node.right, `${code}1`, charsCoding, charsCodingMatch);
        } else {
            charsCoding[node] = code;
            charsCodingMatch[code] = node;
        }
    }
};

export default HuffmanCoding;
