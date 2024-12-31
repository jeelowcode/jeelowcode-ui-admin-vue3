export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}