const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  registrant: [String],
  recipient: [String],
  description: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'inicial' },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: String,
      comment: String // New field for comments or modified descriptions
    }
  ],
  readBy: [
    {
      recipient: String,
      read: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Document', documentSchema);