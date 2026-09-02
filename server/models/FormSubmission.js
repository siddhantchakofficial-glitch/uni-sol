import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: false,
    },
    formTitle: { type: String, default: 'Contact Form' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

formSubmissionSchema.index({ formId: 1 });
formSubmissionSchema.index({ status: 1 });

export const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);
export default FormSubmission;
