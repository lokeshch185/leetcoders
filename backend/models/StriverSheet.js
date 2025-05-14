/**
 * Striver Sheet Model Module
 * Defines the schema for coding problems in the Striver Sheet
 * The Striver Sheet is a curated list of coding problems for practice
 */

import mongoose from 'mongoose';

/**
 * Sheet Schema
 * Represents a coding problem in the Striver Sheet
 * @property {String} _id - Unique identifier for the problem
 * @property {String} quesLink - URL link to the problem on LeetCode
 * @property {String} quesName - Name/title of the problem
 * @property {String} specialTag - Special category or tag for the problem
 * @property {String[]} tags - Array of tags associated with the problem
 */
const sheetSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  quesLink: { type: String, required: true },
  quesName: { type: String, required: true },
  specialTag: { type: String, required: true },
  tags: { type: [String], required: true },
});

export const StriverSheet = mongoose.model("striversheet", sheetSchema);
