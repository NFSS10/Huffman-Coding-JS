import { HuffmanCoding } from '../..';

describe('Huffman Coding Tests', () => {
    it('should encode a string', () => {
        const huffmanCodingRes1 = HuffmanCoding.encode('Huffman');
        expect(huffmanCodingRes1.charsFreq).toEqual({ H: 1, a: 1, f: 2, m: 1, n: 1, u: 1 });
        expect(huffmanCodingRes1.charsCoding).toEqual({ H: '000', a: '011', f: '101', m: '010', n: '100', u: '001' });
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

        const huffmanCodingRes2 = HuffmanCoding.encode('Example of a random phrase.');
        expect(huffmanCodingRes2.encodedStr).toEqual(
            '000010001111110010110101101011101101011111101111111010011111011001001101110011101011001110011111001010100001'
        );

        const decodedStr2 = HuffmanCoding.decode(
            '000010001111110010110101101011101101011111101111111010011111011001001101110011101011001110011111001010100001',
            huffmanCodingRes2.charsCoding,
            huffmanCodingRes2.nBits
        );
        expect(decodedStr2).toEqual('Example of a random phrase.');
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

    it('should encode and decode a string with a variable number of chars as the key', () => {
        const res1 = HuffmanCoding.encode('Huffman', 2);
        expect(res1.charsFreq).toEqual({ Hu: 1, ff: 1, ma: 1, n: 1 });
        expect(res1.charsCoding).toEqual({ Hu: '00', ff: '01', ma: '10', n: '11' });
        expect(res1.nBits).toEqual(2);
        expect(res1.encodedStr).toEqual('00011011');

        const res1Decoded = HuffmanCoding.decode('00011011', res1.charsCoding, res1.nBits);
        expect(res1Decoded).toEqual('Huffman');

        const res2 = HuffmanCoding.encode('Example of a random phrase.', 2);
        expect(res2.charsFreq).toEqual({
            ' a': 1,
            ' r': 1,
            '.': 1,
            Ex: 1,
            am: 1,
            an: 1,
            do: 1,
            'e ': 1,
            'm ': 1,
            of: 1,
            ph: 1,
            pl: 1,
            ra: 1,
            se: 1
        });
        expect(res2.charsCoding).toEqual({
            ' a': '0101',
            ' r': '0110',
            '.': '1101',
            Ex: '0001',
            am: '0111',
            an: '0000',
            do: '1000',
            'e ': '0011',
            'm ': '1001',
            of: '0100',
            ph: '1010',
            pl: '0010',
            ra: '1011',
            se: '1100'
        });
        expect(res2.nBits).toEqual(4);
        expect(res2.encodedStr).toEqual('00010111001000110100010101100000100010011010101111001101');

        const res2Decoded = HuffmanCoding.decode(
            '00010111001000110100010101100000100010011010101111001101',
            res2.charsCoding,
            res2.nBits
        );
        expect(res2Decoded).toEqual('Example of a random phrase.');

        const res3 = HuffmanCoding.encode('8A2800A28A2800A28A2800A28A2800A2', 4);
        expect(res3.charsFreq).toEqual({ '00A2': 4, '8A28': 4 });
        expect(res3.charsCoding).toEqual({ '00A2': '1', '8A28': '0' });
        expect(res3.nBits).toEqual(1);
        expect(res3.encodedStr).toEqual('01010101');

        const res3Decoded = HuffmanCoding.decode(res3.encodedStr, res3.charsCoding, res3.nBits);
        expect(res3Decoded).toEqual('8A2800A28A2800A28A2800A28A2800A2');
    });
});
