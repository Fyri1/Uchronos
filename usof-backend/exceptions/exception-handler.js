import ApiError from "./api-execptions.js";

export default function (err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'NEPREDVIDENNII PRASAK' + err });
}