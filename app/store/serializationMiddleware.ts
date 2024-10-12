import { Middleware } from 'redux';

const serializeDate = (value: any): any => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeDate);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, serializeDate(val)])
    );
  }
  return value;
};

const serializationMiddleware: Middleware = () => next => action => {
  const serializedAction = serializeDate(action);
  return next(serializedAction);
};

export default serializationMiddleware;