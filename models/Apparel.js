import mongoose from "mongoose";

const ApparelSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'Apparel'
    },
    section: {
      type: String,
      required: true,
      validate(str) {
        if (!str) {
          throw new Error('Apparel must include at least 1 section where it would display.')
        }
      }
    },
    colors: {
      type: Array,
      default: []
    },
    category: {
      type: Array,
      default: []
    },
    brand: {
      type: String
    },
    own: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
    }
  },
  { timestamps: true }
);

const Apparel = mongoose.model("Apparel", ApparelSchema);

export default Apparel;