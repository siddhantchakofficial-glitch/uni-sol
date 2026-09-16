import mongoose from 'mongoose';

const translationCacheSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      index: true,
    },
    sourceText: {
      type: String,
      required: true,
    },
    targetLang: {
      type: String,
      required: true,
      index: true,
    },
    translatedText: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      default: 'google',
    },
  },
  { timestamps: true }
);

// Compound index to guarantee fast string cache lookups
translationCacheSchema.index({ hash: 1, targetLang: 1 }, { unique: true });

export const TranslationCache = mongoose.model('TranslationCache', translationCacheSchema);
export default TranslationCache;
