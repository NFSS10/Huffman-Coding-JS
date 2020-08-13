import { Node } from './Node';

// TODO refactor this
// TODO fix padding problems e talvez nao usar o valor decimal, mas sim hex
const testNumbers = [];

export class HuffmanCoding {
    constructor() {
        this.charsFreq = {};
        this.charsCoding = {};
        this.charsCodingMatch = {};
        this.nBits = 0;
        this.fileHeader = {};
    }

    encode(str) {
        this._calculateCharFrequency(str);

        let treeNodes = this._buildNodes();
        while (treeNodes.length !== 1) {
            treeNodes = this._joinNodes(treeNodes);
        }

        this._encodeTree(treeNodes[0], '');

        let encodedStr = '';
        for (let i = 0; i < str.length; i++) {
            encodedStr += this.charsCoding[str[i]];
        }
        this.nBits = Math.floor(encodedStr.length / Object.keys(this.charsFreq).length);

        return encodedStr;
    }

    encodeToBuffer(str) {
        const encodedStr = this.encode(str);

        const isPadded = encodedStr.length % 2 !== 0;

        this.fileHeader = {
            isPadded: isPadded,
            nBits: this.nBits,
            nCodes: Object.keys(this.charsCoding).length,
            charsCoding: this.charsCoding
        };

        const fileHeaderStr = this._encodeFileHeader(this.fileHeader);
        // const parsedFileHeader = this._parseFileHeader(fileHeaderStr);
        // console.log('\n\n\n');
        // console.log('fileHeaderStr:', fileHeaderStr);
        // console.log('this.fileHeader:', this.fileHeader);
        // console.log('parsedFileHeader:', parsedFileHeader);

        const buffersArr = [];
        for (let i = 0; i < fileHeaderStr.length; i += 8) {
            const byte = fileHeaderStr.substring(i, i + 8);
            buffersArr.push(this._byteStrToBuffer(byte));
        }

/*         for (let i = 0; i < encodedStr.length; i += 8) {
            const byte = encodedStr.substring(i, i + 8);
            buffersArr.push(this._byteStrToBuffer(byte));
        } */

        const buffer = Buffer.concat(buffersArr);
        console.log("fileHeaderStr:", fileHeaderStr);
        console.log("testNumbers:", testNumbers)
        console.log('buffer:', buffer);
    }

    _byteStrToBuffer(byteStr) {
        const number = parseInt(byteStr, 2);
        const hexValue = number.toString(16);
        const normalizedHex = hexValue.length === 1 ? `0${hexValue}` : hexValue; 
        testNumbers.push(normalizedHex);
        return Buffer.from(normalizedHex, 'hex');
    }


    bufferToBits(buffer) {

    }

    _encodeFileHeader(fileHeader) {
        let encFileHeaderStr = '';

        encFileHeaderStr += fileHeader.isPadded ? '1' : '0';
        encFileHeaderStr += ('00000000' + this.fileHeader.nBits.toString(2)).substr(-8);
        encFileHeaderStr += ('00000000' + this.fileHeader.nCodes.toString(2)).substr(-8);
        Object.keys(fileHeader.charsCoding).forEach(key => {
            const keyBinary = ('00000000' + key.charCodeAt(0).toString(2)).substr(-8);
            encFileHeaderStr += `${keyBinary}${fileHeader.charsCoding[key]}`;
        });
        if (fileHeader.isPadded) encFileHeaderStr += '0';

        return encFileHeaderStr;
    }

    _parseFileHeader(headerStr) {
        let headerInx = 0;
        const isPadded = Boolean(parseInt(headerStr[headerInx]));
        headerInx++;
        const nBits = parseInt(headerStr.substring(headerInx, headerInx + 8), 2);
        headerInx = 9;
        const nCodes = parseInt(headerStr.substring(headerInx, headerInx + 8), 2);
        headerInx = 17;
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
    }

    decode(encodedStr) {
        if (!this.nBits) return null;

        let decodedStr = '';
        for (let i = 0; i < encodedStr.length; i += this.nBits) {
            const code = encodedStr.substring(i, i + this.nBits);
            decodedStr += this.charsCodingMatch[code];
        }

        return decodedStr;
    }

    _calculateCharFrequency(str) {
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            this.charsFreq[char] = this.charsFreq[char] ? this.charsFreq[char] + 1 : 1;
        }
    }

    _buildNodes() {
        const sortedChars = Object.keys(this.charsFreq).sort((a, b) => this.charsFreq[a] - this.charsFreq[b]);

        const nodes = [];
        for (let i = 0; i < sortedChars.length; i += 2) {
            const char1 = sortedChars[i] ? sortedChars[i] : null;
            const char2 = sortedChars[i + 1] ? sortedChars[i + 1] : null;

            const char1Freq = this.charsFreq[char1] ? this.charsFreq[char1] : 0;
            const char2Freq = this.charsFreq[char2] ? this.charsFreq[char2] : 0;

            const newNode = new Node(char1Freq + char2Freq, char1, char2);
            nodes.push(newNode);
        }

        return nodes;
    }

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
    }

    _encodeTree(node, code) {
        if (!node) return;

        if (node.left || node.right) {
            this._encodeTree(node.left, `${code}0`);
            this._encodeTree(node.right, `${code}1`);
        } else {
            this.charsCoding[node] = code;
            this.charsCodingMatch[code] = node;
        }
    }
}

export default HuffmanCoding;
