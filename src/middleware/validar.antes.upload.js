import fs from "fs";

const validarAntesDeFicheiro = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    if (req.file) fs.unlinkSync(req.file.path); // apaga só se houver erro
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

export default validarAntesDeFicheiro;