const phoneRegex = /^\+?[0-9]{7,15}$/;
const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isNumber() {
  return (val: string) => {
    if (Number.isNaN(val)) {
      return 'not type of number';
    }

    return null;
  }
}

export function isEmail() {
  return (val: string) => {
    if (!emailRegex.test(val)) {
      return 'not type of email';
    }

    return null;
  }
}

export function isPhoneNumber(val: string) {
  if (!phoneRegex.test(val)) {
    return 'not type of phone number';
  }

  return null;
}

export function min(len: number, empty: boolean = false) {
  return (val: string) => {
    if (empty && val.trim().length === 0) return null;

    if (val.length < len) {
      return `minimal ${len} characters`;
    }

    return null;
  }
}

export function max(len: number) {
  return (val: string) => {
    if (val.length > len) {
      return `maximal ${len} characters`;
    }

    return null;
  }
}
