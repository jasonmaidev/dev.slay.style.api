import mongoose from "mongoose";

const StyleSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Style'
    },
    headwear: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    shorttops: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    longtops: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    outerwear: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    onepiece: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    pants: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    shorts: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    footwear: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Apparel"
    },
    occasions: {
      type: Array,
      default: []
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Style = mongoose.model("Style", StyleSchema);

export default Style;