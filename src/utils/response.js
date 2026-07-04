export const ok = (res, data = null, message = 'OK', status = 200, meta) => {
  res.status(status).json({ success: true, message, data, meta });
};
