import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
    children: [
      {
        id: { type: String },
        label: { type: String },
        url: { type: String },
        target: { type: String, default: '_self' },
      },
    ],
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // 'header', 'footer', 'sidebar'
    },
    title: { type: String, required: true },
    items: [menuItemSchema],
  },
  { timestamps: true }
);

export const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
