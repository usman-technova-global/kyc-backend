function serveSuccess(req, res) {
  return res.sendFile('success.html');
}
function serveFailure(req, res) {
  return res.sendFile('cancel.html');
}
module.exports = {
  serveSuccess,
  serveFailure,
};
