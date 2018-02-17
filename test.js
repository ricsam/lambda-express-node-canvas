const { writeFile, mkdirSync } = require('fs');
const { exec } = require('child_process');
const path = require('path');

const command = `sls invoke local -f api --data '{ "path": "/test" }'`;

const ps = exec(command);

const getData = new Promise((resolve, reject) => {
  ps.stdout.on('data', (data) => {
    resolve(JSON.parse(data));
    ps.kill();
  });
  ps.on('error', (error) => {
    try {
      reject();
      ps.kill();
    } catch (err) {}
  });
});

const writePNG = ({ body }) =>
  new Promise((resolve, reject) => {
    const dataURL = `data:image/png;base64,${body}`;
    // console.log(dataURL);

    const tmpDirectory = path.join(__dirname, 'testing_tmp');

    try {
      mkdirSync(tmpDirectory);
    } catch (err) {
      /* folder exists */
    }

    const pngPath = path.join(tmpDirectory, 'test.png');
    const pngData = Buffer.from(body, 'base64');
    writeFile(pngPath, pngData, (err) => {
      resolve(pngPath);
    });
  });

getData
  .then(writePNG)
  .then((path) => {
    const openChromeCommand = `open -a "Preview" ${path}`;
    exec(openChromeCommand, () => {});
  })
  .catch((err) => {
    console.log(err);
  });
