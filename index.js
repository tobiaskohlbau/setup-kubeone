const tc = require('@actions/tool-cache');
const core = require('@actions/core');
const os = require('os');

async function run() {
  try {
    const version = core.getInput('version');

    const platform = os.platform();
    let arch = os.arch();

    // rename arch for x64 to amd64
    if (arch === 'x64') {
      arch = 'amd64';
    }

    core.debug(`Downloading releases for Kubeone CLI version ${version}`);
    const url = `https://github.com/kubermatic/kubeone/releases/download/v${version}/kubeone_${version}_${platform}_${arch}.zip`;

    const pathToCLIZip = await tc.downloadTool(url);
    let pathToCLI = '';

    core.debug('Extracting Kubeone CLI file');
    pathToCLI = await tc.extractZip(pathToCLIZip);

    if (!pathToCLIZip || !pathToCLI) {
      throw new Error(`Unable to download kubeone cli from ${url}`);
    }

    core.addPath(pathToCLI);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
