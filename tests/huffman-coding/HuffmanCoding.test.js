import { HuffmanCoding } from '../..';

describe('Huffman Coding Tests', () => {
    it('should encode a string', () => {
        const huffmanCodingRes = HuffmanCoding.encode('Huffman');
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

    it('should decode a string', () => {
        const huffmanCodingRes = HuffmanCoding.encode('Huffman');
        expect(huffmanCodingRes.encodedStr).toEqual('000001101101010011100');

        const decodedStr = HuffmanCoding.decode(
            '000001101101010011100',
            huffmanCodingRes.charsCoding,
            huffmanCodingRes.nBits
        );
        expect(decodedStr).toEqual('Huffman');
    });

    it('should encode to a buffer', () => {
        const buffer = HuffmanCoding.encodeToBuffer('Huffman');
        expect(buffer).toEqual(Buffer.from([129, 131, 36, 7, 82, 218, 152, 91, 116, 102, 160, 6, 212, 224]));
    });

    it('should decode from a buffer', () => {
        const buffer = Buffer.from([129, 131, 36, 7, 82, 218, 152, 91, 116, 102, 160, 6, 212, 224]);
        
        const decodedBufferContents = HuffmanCoding.decodeFromBuffer(buffer);
        expect(decodedBufferContents).toEqual('Huffman');
    });

});
