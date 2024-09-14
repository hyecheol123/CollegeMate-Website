/**
 * This file provides a mock API for enter OTP Code.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

interface IResponse {
  responseCode: number;
  content?: {
    verificationExpiresAt?: Date;
    shouldRenewToken?: boolean;
    needNewTNCAccpet?: boolean;
  };
}

/**
 * Simulates an API call to enter OTP Code.
 * @param {string} requestId id of OTP Request
 * @param {string} email email address
 * @param {string} passcode OTP Code
 * @returns {Promise<IResponse>} A promise that resolves to response of
 *   enter OTP Code API Call.
 */
export default function postEnterOTPCode(
  requestId: string,
  email: string,
  passcode: string,
): Promise<IResponse> {
  console.log(
    `Sending OTP Code (${passcode}) for request ${requestId} owned by ${email}`,
  );

  return new Promise((resolve) => {
    if (requestId === 'signinRequestId' || requestId === 'signupRequestId') {
      if (passcode === '000000') {
        // Mismatch code
        setTimeout(() => resolve({ responseCode: 499 }), 1000);
      } else if (passcode === '111111') {
        // Expired Code
        setTimeout(() => resolve({ responseCode: 409 }), 1000);
      } else if (passcode === '222222') {
        // Correct code & Need to accept new terms and condition
        setTimeout(
          () =>
            resolve({ responseCode: 201, content: { needNewTNCAccpet: true } }),
          1000,
        );
      } else {
        // Correct code
        setTimeout(() => resolve({ responseCode: 201 }), 1000);
      }
    }
  });
}
