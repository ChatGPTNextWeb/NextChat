// From https://gist.github.com/guillermodlpa/f6d955f838e9b10d1ef95b8e259b2c58
// From https://gist.github.com/stevendesu/2d52f7b5e1f1184af3b667c0b5e054b8

// To ensure cross-browser support even without a proper SubtleCrypto
// impelmentation (or without access to the impelmentation, as is the case with
// Chrome loaded over HTTP instead of HTTPS), this library can create SHA-256
// HMAC signatures using nothing but raw JavaScript

/* eslint-disable no-magic-numbers, id-length, no-param-reassign, new-cap */

// By giving internal functions names that we can mangle, future calls to
// them are reduced to a single byte (minor space savings in minified file)
const uint8Array = Uint8Array;
const uint32Array = Uint32Array;
const pow = Math.pow;

// Will be initialized below
// Using a Uint32Array instead of a simple array makes the minified code
// a bit bigger (we lose our `unshift()` hack), but comes with huge
// performance gains
const DEFAULT_STATE = new uint32Array(8);
const ROUND_CONSTANTS: number[] = [];

// Reusable object for expanded message
// Using a Uint32Array instead of a simple array makes the minified code
// 7 bytes larger, but comes with huge performance gains
const M = new uint32Array(64);

// After minification the code to compute the default state and round
// constants is smaller than the output. More importantly, this serves as a
// good educational aide for anyone wondering where the magic numbers come
// from. No magic numbers FTW!
function getFractionalBits(n: number) {
  return ((n - (n | 0)) * pow(2, 32)) | 0;
}

let n = 2;
let nPrime = 0;
while (nPrime < 64) {
  // isPrime() was in-lined from its original function form to save
  // a few bytes
  let isPrime = true;
  // Math.sqrt() was replaced with pow(n, 1/2) to save a few bytes
  // var sqrtN = pow(n, 1 / 2);
  // So technically to determine if a number is prime you only need to
  // check numbers up to the square root. However this function only runs
  // once and we're only computing the first 64 primes (up to 311), so on
  // any modern CPU this whole function runs in a couple milliseconds.
  // By going to n / 2 instead of sqrt(n) we net 8 byte savings and no
  // scaling performance cost
  for (let factor = 2; factor <= n / 2; factor++) {
    if (n % factor === 0) {
      isPrime = false;
    }
  }
  if (isPrime) {
    if (nPrime < 8) {
      DEFAULT_STATE[nPrime] = getFractionalBits(pow(n, 1 / 2));
    }
    ROUND_CONSTANTS[nPrime] = getFractionalBits(pow(n, 1 / 3));

    nPrime++;
  }

  n++;
}

// For cross-platform support we need to ensure that all 32-bit words are
// in the same endianness. A UTF-8 TextEncoder will return BigEndian data,
// so upon reading or writing to our ArrayBuffer we'll only swap the bytes
// if our system is LittleEndian (which is about 99% of CPUs)
const LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0];

function convertEndian(word: number) {
  if (LittleEndian) {
    return (
      // byte 1 -> byte 4
      (word >>> 24) |
      // byte 2 -> byte 3
      (((word >>> 16) & 0xff) << 8) |
      // byte 3 -> byte 2
      ((word & 0xff00) << 8) |
      // byte 4 -> byte 1
      (word << 24)
    );
  } else {
    return word;
  }
}

function rightRotate(word: number, bits: number) {
  return (word >>> bits) | (word << (32 - bits));
}

function sha256(data: Uint8Array) {
  // Copy default state
  const STATE = DEFAULT_STATE.slice();

  // Caching this reduces occurrences of ".length" in minified JavaScript
  // 3 more byte savings! :D
  const legth = data.length;

  // Pad data
  const bitLength = legth * 8;
  const newBitLength = 512 - ((bitLength + 64) % 512) - 1 + bitLength + 65;

  // "bytes" and "words" are stored BigEndian
  const bytes = new uint8Array(newBitLength / 8);
  const words = new uint32Array(bytes.buffer);

  bytes.set(data, 0);
  // Append a 1
  bytes[legth] = 0b10000000;
  // Store length in BigEndian
  words[words.length - 1] = convertEndian(bitLength);

  // Loop iterator (avoid two instances of "var") -- saves 2 bytes
  let round;

  // Process blocks (512 bits / 64 bytes / 16 words at a time)
  for (let block = 0; block < newBitLength / 32; block += 16) {
    const workingState = STATE.slice();

    // Rounds
    for (round = 0; round < 64; round++) {
      let MRound;
      // Expand message
      if (round < 16) {
        // Convert to platform Endianness for later math
        MRound = convertEndian(words[block + round]);
      } else {
        const gamma0x = M[round - 15];
        const gamma1x = M[round - 2];
        MRound =
          M[round - 7] +
          M[round - 16] +
          (rightRotate(gamma0x, 7) ^
            rightRotate(gamma0x, 18) ^
            (gamma0x >>> 3)) +
          (rightRotate(gamma1x, 17) ^
            rightRotate(gamma1x, 19) ^
            (gamma1x >>> 10));
      }

      // M array matches platform endianness
      M[round] = MRound |= 0;

      // Computation
      const t1 =
        (rightRotate(workingState[4], 6) ^
          rightRotate(workingState[4], 11) ^
          rightRotate(workingState[4], 25)) +
        ((workingState[4] & workingState[5]) ^
          (~workingState[4] & workingState[6])) +
        workingState[7] +
        MRound +
        ROUND_CONSTANTS[round];
      const t2 =
        (rightRotate(workingState[0], 2) ^
          rightRotate(workingState[0], 13) ^
          rightRotate(workingState[0], 22)) +
        ((workingState[0] & workingState[1]) ^
          (workingState[2] & (workingState[0] ^ workingState[1])));
      for (let i = 7; i > 0; i--) {
        workingState[i] = workingState[i - 1];
      }
      workingState[0] = (t1 + t2) | 0;
      workingState[4] = (workingState[4] + t1) | 0;
    }

    // Update state
    for (round = 0; round < 8; round++) {
      STATE[round] = (STATE[round] + workingState[round]) | 0;
    }
  }

  // Finally the state needs to be converted to BigEndian for output
  // And we want to return a Uint8Array, not a Uint32Array
  return new uint8Array(
    new uint32Array(
      STATE.map(function (val) {
        return convertEndian(val);
      }),
    ).buffer,
  );
}

function hmac(key: Uint8Array, data: ArrayLike<number>) {
  if (key.length > 64) key = sha256(key);

  if (key.length < 64) {
    const tmp = new Uint8Array(64);
    tmp.set(key, 0);
    key = tmp;
  }

  // Generate inner and outer keys
  const innerKey = new Uint8Array(64);
  const outerKey = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    innerKey[i] = 0x36 ^ key[i];
    outerKey[i] = 0x5c ^ key[i];
  }

  // Append the innerKey
  const msg = new Uint8Array(data.length + 64);
  msg.set(innerKey, 0);
  msg.set(data, 64);

  // Has the previous message and append the outerKey
  const result = new Uint8Array(64 + 32);
  result.set(outerKey, 0);
  result.set(sha256(msg), 64);

  // Hash the previous message
  return sha256(result);
}

// Convert a string to a Uint8Array, SHA-256 it, and convert back to string
const encoder = new TextEncoder();

export function sign(
  inputKey: string | Uint8Array,
  inputData: string | Uint8Array,
) {
  const key =
    typeof inputKey === "string" ? encoder.encode(inputKey) : inputKey;
  const data =
    typeof inputData === "string" ? encoder.encode(inputData) : inputData;
  return hmac(key, data);
}

export function hex(bin: Uint8Array) {
  return bin.reduce((acc, val) => {
    const hexVal = "00" + val.toString(16);
    return acc + hexVal.substring(hexVal.length - 2);
  }, "");
}

export function hash(str: string) {
  return hex(sha256(encoder.encode(str)));
}

export function hashWithSecret(str: string, secret: string) {
  return hex(sign(secret, str)).toString();
}
