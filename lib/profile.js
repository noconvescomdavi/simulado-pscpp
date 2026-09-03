function text(value, max) {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(0, max) : null;
}

function digits(value, max) {
  const normalized = String(value || "").replace(/\D/g, "").slice(0, max);
  return normalized || null;
}

export function normalizeCpf(value) {
  const cpf = digits(value, 11);
  if (!cpf) return null;
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) throw new Error("CPF inválido.");

  const validateDigit = (length) => {
    const sum = cpf.slice(0, length).split("").reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return (remainder === 10 ? 0 : remainder) === Number(cpf[length]);
  };
  if (!validateDigit(9) || !validateDigit(10)) throw new Error("CPF inválido.");
  return cpf;
}

export function formatCpf(value) {
  const cpf = String(value || "").replace(/\D/g, "");
  return cpf.length === 11 ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;
}

export function sanitizeProfile(input) {
  const birthDate = text(input.birth_date, 10);
  if (birthDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("Data de nascimento inválida.");
    const date = new Date(`${birthDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate || date.getTime() > Date.now()) {
      throw new Error("Data de nascimento inválida.");
    }
  }
  const state = text(input.state, 2)?.toUpperCase() || null;
  if (state && !/^[A-Z]{2}$/.test(state)) throw new Error("UF inválida.");

  return {
    full_name: text(input.full_name, 180),
    cpf: normalizeCpf(input.cpf),
    birth_date: birthDate,
    phone: digits(input.phone, 14),
    whatsapp: digits(input.whatsapp, 14),
    address_line: text(input.address_line, 240),
    address_number: text(input.address_number, 30),
    address_extra: text(input.address_extra, 120),
    district: text(input.district, 120),
    city: text(input.city, 120),
    state,
    postal_code: digits(input.postal_code, 8),
    instagram: text(input.instagram, 160),
    linkedin: text(input.linkedin, 240),
  };
}
