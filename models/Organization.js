const mongoose = require('mongoose');

const org_whatsapp_numberSchema = new mongoose.Schema({
   message: { type: String, required: true },
    tag: { type: String, required: true },
    mobile: { type: Number, required: true },
  });

  const org_call_numberSchema = new mongoose.Schema({
    tag: { type: String, required: true },
    mobile: { type: Number, required: true },
  });

const organizationSchema = new mongoose.Schema({
  organization_uuid: String,
  organization_title: String,
  organization_whatsapp_number: { type: Number, unique: true },
  organization_call_number: { type: Number, unique: true },
  organization_whatsapp_message: String,
  domains: [String],
 login_password: String,
 login_username: String,
  organization_logo: String,
  theme_color: String,
 org_whatsapp_number: {
  number: String
},
org_call_number: {
  number: String
}

});

module.exports = mongoose.model('Organization', organizationSchema);
