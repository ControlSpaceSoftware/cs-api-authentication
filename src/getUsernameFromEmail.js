
export default function getUsernameFromEmail(email) {
	return email && email.replace(/@/, '+');
}
