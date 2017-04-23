const chalk = require('chalk');
const semver = require('semver');
const packageConfig = require('../package.json');
const childProcess = require('child_process');

function exec(cmd) {
  return childProcess.execSync(cmd).toString().trim();
}

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node,
  },
  {
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm,
  },
];

module.exports = function () {
  const warnings = [];
  /* eslint-disable array-callback-return */
  versionRequirements.map((mod) => {
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(`${mod.name}:${chalk.red(mod.currentVersion)} should be 
      ${chalk.green(mod.versionRequirement)}`);
    }
  });

  if (warnings.length) {
    console.log(`\n${chalk.yellow('To start this app, you must update following to modules:')}\n`);
    warnings.map(warning => console.log(`  ${warning}`));
    console.log();
    process.exit(1);
  }
};
