export declare function cryptText(plainText: string): any;
export declare function decryptText(ciphertext: any): string;
export declare function randomHash(length?: number): string;
export declare function hashFromUUI(): string;
export declare function hashPassword(plainText: string): string;
export declare function compareText(plainText: string, hashText: string): boolean;
export declare function comparePassword(plainPassword: string, hashPassword: string): boolean;
