const Joi = require("joi");

const pharmacyValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Pharmacy name is required.',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Address is required.',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required.',
  }),
  state: Joi.string().required().messages({
    'any.required': 'State is required.',
  }),
  zipCode: Joi.string().required().messages({
    'any.required': 'Zip code is required.',
  }),
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  ownerName: Joi.string().required().messages({
    'any.required': 'Owner name is required.',
  }),
  latitude: Joi.number().required().messages({
    'any.required': 'Latitude is required.',
  }),
  longitude: Joi.number().required().messages({
    'any.required': 'Longitude is required.',
  }),
}).options({ allowUnknown: true }); // Allow unknown fields in case of extra fields in request body

module.exports = pharmacyValidationSchema;
