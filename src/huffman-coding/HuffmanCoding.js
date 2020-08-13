import { Node } from './Node';

export class HuffmanCoding {
    constructor() {
        this.charsFreq = {};
        this.charsCoding = {};
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
        return encodedStr;
    }

    decode(str) {}

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
        } else this.charsCoding[node] = code;
    }
}

export default HuffmanCoding;
