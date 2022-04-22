export const patchT = (t) => {
  const f = (...args) => t(...args).replaceAll(/dai/gi, "USXD");

  f._polyglot = t._polyglot;

  return f;
};
