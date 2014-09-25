var connect = require('connect')
var serveStatic = require('serve-static')

var app = connect();

app.use(serveStatic('.', {'index': ['index.html', 'index.htm']}))
app.listen(9010);