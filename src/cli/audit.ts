import { URL } from 'url';
import chalk from 'chalk';

import { AuditResult, auditServer } from '../audits';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export async function audit(
  url: string,
  options: { output?: string; format?: string },
) {
  if (!isValidUrl(url)) {
    console.error('Invalid URL');
    process.exit(1);
  }

  console.log(options);

  const results = await auditServer({
    url: url,
    fetchFn: fetch,
  });

  type status = AuditResult['status'];

  const groupedResults: { [key in status]: AuditResult[] | undefined } =
    results.reduce(
      (acc, result) => {
        if (!acc[result.status]) {
          acc[result.status] = [];
        }

        acc[result.status]?.push(result);

        return acc;
      },
      {} as { [key in status]: AuditResult[] | undefined },
    );

  const statuses = Object.keys(groupedResults) as status[];

  statuses.forEach((status) => {
    const results = groupedResults[status];

    if (results) {
      console.log(chalk.bold(status));
      results.forEach((result) => {
        console.log(`- ${result.name}`);
      });
    }
  });
}
