export const NAME_REGEX = /^[\u0600-\u06FF\s]{4,}|[a-zA-Z ]{4,}$/; 
export const MAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail+\.com|co|net{2,}$/;
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]){7,24}/; 