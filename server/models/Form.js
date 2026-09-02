import mongoose from 'mongoose';

const formFieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'email', 'phone', 'number', 'textarea', 'select', 'checkbox', 'radio', 'file'],
      required: true,
    },
    name: { type: String, required: true },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    submitButtonText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you for your submission!' },
    fields: [formFieldSchema],
    settings: {
      sendEmailNotification: { type: Boolean, default: true },
      notificationEmail: { type: String, default: 'info@unisparkinnovation.com' },
    },
  },
  { timestamps: true }
);

export const Form = mongoose.model('Form', formSchema);
export default Form;
