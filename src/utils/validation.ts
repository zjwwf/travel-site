export function isEmail(v: string){ return /\S+@\S+\.\S+/.test(v); }
export function isPhone(v: string){ if(!v) return true; return /^\+?[0-9\- ]{6,16}$/.test(v); }
