// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const noteSchema = new Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   tags: { type: [String], default: false },
//   isPinned: { type: String, required: true },
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// userId:{type:String, required: true}
//   createdOn: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Note", noteSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] }, // Changed default to an empty array
  isPinned: { type: Boolean, default: false }, // Changed to Boolean with default false
  //   userId: { type: String, required: true }, // Moved to correct position
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model

  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
