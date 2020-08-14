import { HuffmanCoding } from '../..';

describe('Huffman Coding Tests', () => {
    it('should encode a string', () => {
        const huffmanCodingRes1 = HuffmanCoding.encode('Huffman');
        expect(huffmanCodingRes1.charsFreq).toEqual({
            H: 1,
            a: 1,
            f: 2,
            m: 1,
            n: 1,
            u: 1
        });
        expect(huffmanCodingRes1.charsCoding).toEqual({
            H: '000',
            a: '011',
            f: '101',
            m: '010',
            n: '100',
            u: '001'
        });
        expect(huffmanCodingRes1.nBits).toEqual(3);
        expect(huffmanCodingRes1.encodedStr).toEqual('000001101101010011100');

        const huffmanCodingRes2 = HuffmanCoding.encode('Example of a random phrase.');
        expect(huffmanCodingRes2.encodedStr).toEqual(
            '000010001111110010110101101011101101011111101111111010011111011001001101110011101011001110011111001010100001'
        );
        expect(huffmanCodingRes2.nBits).toEqual(4);
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
        // eslint-disable-next-line no-undef
        expect(buffer).toEqual(Buffer.from([3, 6, 72, 14, 165, 181, 48, 182, 232, 205, 64, 6, 212, 224]));
    });

    it('should decode from a buffer', () => {
        // eslint-disable-next-line no-undef
        const buffer = Buffer.from([3, 6, 72, 14, 165, 181, 48, 182, 232, 205, 64, 6, 212, 224]);

        const decodedBufferContents = HuffmanCoding.decodeFromBuffer(buffer);
        expect(decodedBufferContents).toEqual('Huffman');
    });
});
