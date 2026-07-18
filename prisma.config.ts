import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: 'file:./.prisma-cli/unused.db',
  },
  schema: 'prisma/schema.prisma',
});
