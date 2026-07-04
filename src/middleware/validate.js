export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!parsed.success) return res.status(422).json({ success: false, message: 'Validation failed', details: parsed.error.flatten() });
  req.body = parsed.data.body ?? req.body;
  req.params = parsed.data.params ?? req.params;
  req.query = parsed.data.query ?? req.query;
  next();
};
