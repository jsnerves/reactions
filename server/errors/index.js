export default (message='Something went wrong', code=500, additional) => {
  // expess res.status(code) sens error with code and default message for this code
  // res.status(code).send(payload) sends additional payload wich is plain object
  // so this method returns plain object to be used in .send()
  // this errors passed to errors middleware by next(createError())

  return {
    _custom: true,
    message,
    code,
    ...additional
  }
}
