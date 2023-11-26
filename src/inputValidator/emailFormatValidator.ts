/**
 * Validate user input - email format
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export const emailFormatValidator = addFormats(new Ajv()).compile({
  type: 'string',
  format: 'email',
});
