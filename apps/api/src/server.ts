import http from 'http';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { socketService } from './services/socketService';

async function startServer() {
  await connectDB();

  const server = http.createServer(app);
  socketService.init(server);

  server.listen(config.port, () => {
    console.log(`=================================================`);
    console.log(`  AI Insurance Platform REST API Server Running`);
    console.log(`  URL: ${config.apiUrl}`);
    console.log(`  Environment: ${config.env}`);
    console.log(`  Active AI Provider: ${config.aiProvider}`);
    console.log(`=================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
