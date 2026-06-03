export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function maskIdentityNumber(identityNumber: string) {
  return `${identityNumber.slice(0, 2)}*******${identityNumber.slice(-2)}`;
}