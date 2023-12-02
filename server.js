const http = require('http');
const fs = require('fs');
const delaunay = require("delaunay-triangulate");
const voronoi = require("voronoi");

let server = http.createServer(function (req, res) {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(jsonData);

        
        if (jsonData.method == "delaunay") {
          let points = [];
          jsonData.points.forEach((value) => {
            points.push([value.x, value.y]);
          });

          let triangles = delaunay(points);
          console.log(triangles);
          res.end(JSON.stringify(triangles));
        } else if (jsonData.method == "voronoi") {
          let diagram = new voronoi();
          diagram = diagram.compute(jsonData.points, {xl: 0, xr: 760, yt: 0, yb: 560});

          console.log(diagram);
          res.end(JSON.stringify(diagram.cells));
        }
        res.statusCode = 200;
      } catch (error) {
        console.error(error);
        res.statusCode = 400;
        res.end('Invalid JSON data');
      }
    });

    req.on('error', (error) => {
      console.error(error);
      res.statusCode = 500;
      res.end('Internal server error');
    });
  } else {
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
});

server.listen(3000, 'localhost', () => {
  console.log('Server is running on http://localhost:3000/');
});