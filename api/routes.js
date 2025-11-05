import { Router } from 'express';

const routes = Router();

import DevelopApiHelpers from "./develop/helpers";
const helpers = new DevelopApiHelpers();

routes.post(
  '/rabbit/send',
  (req, res) => {
    helpers.start(req, res)
  }
);
routes.post(
  '/rabbit/unnack',
  (req, res) => {
    helpers.unnack(req, res)
  }
);

routes.use(
  '*',
  (req, res) => {
    res.status(404).json(
      {
        code: 404,
        status: 'error',
        message: 'not_found'
      });
  }
);

export default routes;
