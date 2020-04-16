const RULES = {
  minLength(value, min) {
    return value.length >= min
  },

  maxLength(value, max) {
    return value.length <= max
  },

  pattern(value, patten) {
    return patten.test(value)
  }
}

export const PATTERNS = {
  word: /^\w+$/
}

export default (value, rules) => {
  for(let rule of rules) {
    const result = RULES[rule.name](value, rule.param)
    if(!result) return { valid: false, message: rule.message } 
  }

  return { valid: true }
}
