// generate-password.js
// Usage examples at bottom.

const crypto = require('crypto');

/**
 * Generate a cryptographically secure random password.
 * @param {number} length - password length (default: 16)
 * @param {object} options - options object
 *   options = {
 *     upper: true,
 *     lower: true,
 *     numbers: true,
 *     symbols: true,
 *     strict: true  // ensure at least one char from each selected group
 *   }
 * @returns {string} password
 */
function generatePassword(length = 16, options = {}) {
  const opts = {
    upper: options.upper !== undefined ? options.upper : true,
    lower: options.lower !== undefined ? options.lower : true,
    numbers: options.numbers !== undefined ? options.numbers : true,
    symbols: options.symbols !== undefined ? options.symbols : true,
    strict: options.strict !== undefined ? options.strict : true,
  };

  if (length <= 0) throw new Error('Length must be a positive integer.');

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMS = '0123456789';
  const SYMS = '!@#$%^&*()-_=+[]{};:,.<>?';

  let groups = [];
  if (opts.upper) groups.push(UPPER);
  if (opts.lower) groups.push(LOWER);
  if (opts.numbers) groups.push(NUMS);
  if (opts.symbols) groups.push(SYMS);

  if (groups.length === 0) {
    throw new Error('At least one character group must be enabled (upper/lower/numbers/symbols).');
  }

  // If strict and length < number of groups, we cannot guarantee one from each group
  if (opts.strict && length < groups.length) {
    throw new Error(`Length must be >= ${groups.length} when strict mode is on.`);
  }

  // Helper: secure random integer in [0, max)
  function randInt(max) {
    // crypto.randomInt is available in Node.js >= 12.10.0
    return crypto.randomInt(0, max);
  }

  const charset = groups.join('');
  const passwordChars = [];

  // If strict, first ensure at least one character from each selected group
  if (opts.strict) {
    for (const grp of groups) {
      const ch = grp[randInt(grp.length)];
      passwordChars.push(ch);
    }
  }

  // Fill remaining characters
  while (passwordChars.length < length) {
    const ch = charset[randInt(charset.length)];
    passwordChars.push(ch);
  }

  // Shuffle the result to avoid predictable group positions
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}


module.exports = { generatePassword };
