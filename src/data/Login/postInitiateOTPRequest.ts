/**
 * This file provides a mock API for initiate OTP request.
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

interface IResponse {
  responseCode: number;
  content?: {
    requestId: string;
    codeExpireAt: Date;
    shouldRenewToken?: boolean;
  };
}

/**
 * Simulates an API call to initiate OTP Request.
 * @param {string} email email address
 * @param {'signup'|'signin'|'sudo'} purpose purpose of this OTP request
 * @return {Promise<IResponse>} A promise that resolves to response of initiate
 *   OTP Request API call.
 */
export default function postInitiateOTPRequest(
  email: string,
  purpose: 'signup' | 'signin' | 'sudo',
): Promise<IResponse> {
  console.log(`Sending OTP Request for ${email} with purpose of ${purpose}`);

  return new Promise((resolve, reject) => {
    if (email === 'notexisting@wisc.edu') {
      setTimeout(() => resolve({ responseCode: 401 }), 1000);
    } else if (email === 'alreadyexisting@wisc.edu' && purpose === 'signup') {
      setTimeout(() => resolve({ responseCode: 403 }), 1000);
    } else {
      const expDate = new Date();
      expDate.setMinutes(expDate.getMinutes() + 3);
      setTimeout(
        () =>
          resolve({
            responseCode: 201,
            content: { requestId: 'someId', codeExpireAt: expDate },
          }),
        1000,
      );
    }
  });
}
