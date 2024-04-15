/**
 * This file provides a mock API response for getting user profile.
 * @author  Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */
  
export interface IProfileResponse {
  responseCode: number;
  content?: {
      nickname: string;
      nicknameChanged: string;
      major: string;
      graduationYear: number;
  };
}

export default function getUserProfile(email: string): Promise<IProfileResponse> {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              responseCode: 200,
              content: {
                  nickname: "Bucky",
                  nicknameChanged: "2024-04-14T14:48:00.000Z",
                  major: "Computer Science",
                  graduationYear: 2028,
              }
          });
      }, 1000);
  });
}