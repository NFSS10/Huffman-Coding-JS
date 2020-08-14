import { HuffmanCoding } from '../..';

describe('Huffman Coding Tests', () => {
    it('should encode a string', () => {
        const huffmanCoding = new HuffmanCoding();

        const huffmanCodingRes = huffmanCoding.encode('Huffman');
        expect(huffmanCodingRes.charsFreq).toEqual({
            H: 1,
            a: 1,
            f: 2,
            m: 1,
            n: 1,
            u: 1
        });
        expect(huffmanCodingRes.charsCoding).toEqual({
            H: '000',
            a: '011',
            f: '101',
            m: '010',
            n: '100',
            u: '001'
        });
        expect(huffmanCodingRes.encodedStr).toEqual('000001101101010011100');
    });

    /*     it('should decode a string', () => {
        const huffmanCoding = new HuffmanCoding();

        const encodedStr = huffmanCoding.encode('Huffman');
        expect(encodedStr).toEqual('000001101101010011100');

        const decodedStr = huffmanCoding.decode('000001101101010011100');
        expect(decodedStr).toEqual('Huffman');
    }); */
});
