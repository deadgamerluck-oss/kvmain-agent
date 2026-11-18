import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🚀 [Server] Backend running at http://localhost:${config.port}`);
  console.log(`🏥 [Health] Check status at http://localhost:${config.port}/api/health`);
});
