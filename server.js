const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'obvius.agent@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, package: pkg, message } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email y nombre son requeridos' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'obvius.agent@gmail.com',
    to: 'obvius.agent@gmail.com',
    subject: `Nuevo contacto de patrocinio: ${name} - ${company}`,
    html: `
      <h2>Nuevo formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Empresa:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
      <p><strong>Paquete:</strong> ${pkg || 'No seleccionado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ error: 'Error al enviar el email' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});