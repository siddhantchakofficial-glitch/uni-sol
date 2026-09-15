import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // hero, about, features, services, stats, gallery, testimonials, team, blog, faq, cta, contact, form, spacer, divider, custom
    name: { type: String, default: 'Section' },
    hidden: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    styles: { type: mongoose.Schema.Types.Mixed, default: {} },
    animation: { type: String, default: 'none' }, // fade, slide, scale, none
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

const pageVersionSchema = new mongoose.Schema(
  {
    sections: [sectionSchema],
    seo: { type: seoSchema, default: () => ({}) },
    layoutSettings: { type: mongoose.Schema.Types.Mixed, default: {} },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Admin',
    },
    draftVersion: {
      type: pageVersionSchema,
      default: () => ({ sections: [], seo: {} }),
    },
    publishedVersion: {
      type: pageVersionSchema,
      default: () => ({ sections: [], seo: {} }),
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

pageSchema.index({ status: 1 });

export const Page = mongoose.model('Page', pageSchema);
export default Page;
