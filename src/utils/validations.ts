export function validateEcuadorianID(id: string): boolean {
  const validLengths = [10]; // Valid ID lengths for Ecuadorian ID

  // Remove dashes and whitespace from the ID
  const cleanID = id.replace(/[-\s]/g, "");

  // Check if the ID has a valid length
  if (!validLengths.includes(cleanID.length)) {
    return false;
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(cleanID)) {
    return false;
  }

  // Validate the checksum digit
  const checksumDigit = Number(cleanID[cleanID.length - 1]);
  const digits = cleanID.slice(0, -1).split("").map(Number);
  const weights = validLengths.includes(13)
    ? [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
    : [2, 1, 2, 1, 2, 1, 2, 1, 2];

  const sum = digits
    .map((digit, index) => digit * weights[index])
    .reduce(
      (accumulator, currentValue) =>
        accumulator + Math.floor(currentValue / 10) + (currentValue % 10),
      0
    );

  const calculatedChecksum = 10 - (sum % 10 === 0 ? 10 : sum % 10);

  return checksumDigit === calculatedChecksum;
}

export function isLatinOrSpanishString(str: string): boolean {
  // Regular expression pattern to match Latin and Spanish characters
  const latinSpanishRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;

  return latinSpanishRegex.test(str);
}

export function isValidEmail(email: string): boolean {
  // Regular expression pattern to match email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export function isValidWorkAge(age: number): boolean {
  return age >= 18 && age <= 65;
}

export function isDateGreaterThanToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
}
