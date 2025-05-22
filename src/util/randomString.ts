const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
const randomString = (length = 5, prefix = "", suffix = "") =>
	prefix +
	Array.from(crypto.getRandomValues(new Uint8Array(length)))
		.map((char) => charset[char % charset.length])
		.join("") +
	suffix;

export default randomString;