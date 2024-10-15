import { createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';

const isPlainObject = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};

const serializableCheck = createSerializableStateInvariantMiddleware({
  isSerializable: (value: any) => {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      // C'est probablement une date ISO
      return true;
    }
    return isPlainObject(value) || Array.isArray(value) || ['string', 'number', 'boolean', 'undefined'].includes(typeof value);
  },
});

export default serializableCheck;
