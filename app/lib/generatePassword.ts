export interface PasswordOptions {
    length: number;
    count: number;
    includeNumbers: boolean;
    includeLowercase: boolean;
    includeUppercase: boolean;
    includeSymbols: boolean;
    selectedSymbols: string[];
    excludeSimilar: boolean;
    firstCharType: 'any' | 'uppercase' | 'lowercase' | 'number';
}

export const AVAILABLE_SYMBOLS = ['/', '*', '-', '+', '.', ',', '!', '#', '$', '%', '&', '(', ')', '~', '|', '_'];

const NUMBERS = '0123456789';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SIMILAR_CHARS = 'Il1Oo0';

function getCharacterPool(options: PasswordOptions): string {
    let pool = '';

    if (options.includeNumbers) {
        pool += NUMBERS;
    }
    if (options.includeLowercase) {
        pool += LOWERCASE;
    }
    if (options.includeUppercase) {
        pool += UPPERCASE;
    }
    if (options.includeSymbols && options.selectedSymbols.length > 0) {
        pool += options.selectedSymbols.join('');
    }

    if (options.excludeSimilar) {
        pool = pool.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
    }

    return pool;
}

function getFirstCharPool(options: PasswordOptions): string {
    let pool = '';

    switch (options.firstCharType) {
        case 'uppercase':
            pool = UPPERCASE;
            break;
        case 'lowercase':
            pool = LOWERCASE;
            break;
        case 'number':
            pool = NUMBERS;
            break;
        default:
            pool = getCharacterPool(options);
    }

    if (options.excludeSimilar) {
        pool = pool.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
    }

    return pool;
}

function getSecureRandomIndex(max: number): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

export function generatePassword(options: PasswordOptions): string {
    const pool = getCharacterPool(options);
    const firstCharPool = getFirstCharPool(options);

    if (pool.length === 0) {
        throw new Error('少なくとも1つの文字種を選択してください');
    }

    if (firstCharPool.length === 0) {
        throw new Error('選択された頭文字タイプの文字がありません');
    }

    let password = '';

    // First character
    password += firstCharPool[getSecureRandomIndex(firstCharPool.length)];

    // Remaining characters
    for (let i = 1; i < options.length; i++) {
        password += pool[getSecureRandomIndex(pool.length)];
    }

    return password;
}

export function generatePasswords(options: PasswordOptions): string[] {
    const passwords: string[] = [];

    for (let i = 0; i < options.count; i++) {
        passwords.push(generatePassword(options));
    }

    return passwords;
}
