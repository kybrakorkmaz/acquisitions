export const formatValidationError = errors => {
  if (!errors || !errors.issues) return 'validation failed'; // No errors

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(', ');

  return JSON.stringify(errors);
};
