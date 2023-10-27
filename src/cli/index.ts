import { Command, Option } from 'commander'; // add this line
import figlet from 'figlet';

import { audit } from './audit';

const program = new Command();

program
  .command('audit <url>')
  .description('Audit a GraphQL HTTP server')
  .option('-o, --output <path>', 'Output path for audit report')
  .addOption(
    new Option('-f, --format <format>', 'Output format').choices([
      'html',
      'json',
    ]),
  )
  .action(audit);

console.log(figlet.textSync('GraphQL HTTP', { horizontalLayout: 'full' }));
program.parse(process.argv);
