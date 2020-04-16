export default (str, data) => {
  Object.keys(data).forEach(key => {
    str = str.replace(`%${key}%`, data[key])
  })
  return str
}
