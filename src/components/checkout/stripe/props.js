export default {
  stripe: {
    type: [String, Object], // stripe key or instance
    required: true
  },
  value: {
    type: String,
    required: false
  },
  options: {
    type: Object,
    required: false
  }
}
