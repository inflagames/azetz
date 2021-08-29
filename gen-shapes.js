const fs = require("fs");
const path = require("path");

if (process.argv.length > 2) {
  const filePath = process.argv[2];
  const resultFile = path.join(__dirname, process.argv[2] || "result.out");
  console.log(filePath, resultFile);
  const file = fs.readFileSync(process.argv[2], {encoding: "utf8"});

  extractPath(file);
}


function extractPath(file) {
  let a = 0, b = 0;

  const paths = [];

  while (true) {
    a = file.indexOf("<path", b);
    if (a === -1) {
      break;
    }
    b = file.indexOf(">", a);
    paths.push(cleanPath(file.substring(a, b + 1)));
  }

  const shapes = [];

  for (let p of paths) {
    const values = new Map();
    let subs = '', value = false, key = '';
    for (let i = 5; i < p.length; i++) {
      if (p[i] === ' ' && !value) {
        continue;
      }
      if (p[i] === '=' && !value) {
        key = subs;
        subs = '';
        value = true;
        i+=2;
      } else if (value && p[i] === '"') {
        values.set(key, subs);
        value = false;
        subs = '';
        continue;
      }
      subs += p[i];
    }

    console.log(values);
    shapes.push({
      points: extractMesh(values.get('d'))
    });

    // console.log(shapes);
  }
}


function cleanPath(p) {
  return p.replace(/\n/g, '').replace(/\s+/g, ' ');
}

function extractMesh(d) {
  const values = d.split(' ');
  const points = [];
  for (let i=0;i< values.length;) {
    let sn = [];
    console.log(points)
    let lp = points.length > 0 ? points[points.length - 1] : null;
    switch (values[i]) {
      case 'l':
      case 'L':
      case 'M':
      case 'm':
        // line to; todo: this can be improve
        // move to
        // m 107.90441,153.47225 8.30323,-2.43043 0.38303,-6.32265 -8.81989,4.6104 z
        i++;
        sn = [];
        while (/^\d.*/.test(values[i][0])) {
          sn = [...sn, ...getPoint(values[i])];
          console.log()
          if (sn.length === 2) {
            points.push({x: sn[0], y: sn[1]});
            sn = [];
          }
          i++;
        }
        break;
      case 'z':
        // close curve
        i++;
        break;
      case 'h':
      case 'H':
        // horizontal movement
        i++;
        sn = getPoint(values[i]);
        points.push({x: lp.x + sn[0], y: lp.y});
        break;
      case 'v':
      case 'V':
        // vertical movement
        i++;
        sn = getPoint(values[i]);
        points.push({x: lp.x, y: lp.y + sn[0]});
        break;
      case 'C':
      case 'c':
      case 'S':
      case 's':
      case 'Q':
      case 'q':
      case 'T':
      case 't':
        // curves, not implemented
        i++;
        break;
      case 'A':
      case 'a':
        // elliptical arc, not implemented
        i++;
        break;
      default:
        // get point
        i++;
    }
  }
  return points;
}

function getPoint(text) {
  if (text.includes(',')) {
    const subr = text.split(',');
    return [+subr[0], +subr[1]];
  }
  return [+text];
}
