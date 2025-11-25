const DEFAULT_API_BASE = "https://migrapanel.com";

export const API_BASE =
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_API_URL ||
	import.meta.env.VITE_API_BASE ||
	DEFAULT_API_BASE;
