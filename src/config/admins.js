// List of admin email addresses who can resolve predictions
// Update this array with the email addresses of your 4 friends
export const ADMIN_EMAILS = [
  'iansonbob@gmail.com',
  'bryankinrade@gmail.com',
  'stunna_aka_jpure@hotmail.com',
]

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase())
}
