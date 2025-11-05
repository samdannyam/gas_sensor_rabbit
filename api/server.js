import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import routes from 'api/routes';
import { startAmqp } from '../module/connection.js'

const port = process.env.PORT || 3553;

const server = express();  
server.use(cors());
server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(compression());

server.use(routes);

server.listen(port, () => {
  console.log(`> API started on http://localhost:${port}`)
    startAmqp();
  }
);
