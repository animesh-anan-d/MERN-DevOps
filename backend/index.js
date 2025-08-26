const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
PORT = process.env.PORT
const conn = require('./conn')
app.use(express.json())
app.use(cors())

const tripRoutes = require('./routes/trip.routes')

app.use('/trip', tripRoutes) // http://localhost:3001/trip --> POST/GET/GET by ID

app.get('/hello', (req,res)=>{
    res.send('Hello World!')
})

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})
/* ===== Prometheus metrics (added for assignment) ===== */
try {
  const client = require('prom-client');
  const register = new client.Registry();

  // collect nodejs default metrics (cpu, memory, event loop)
  client.collectDefaultMetrics({ register });

  // custom metrics
  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method','route','status_code'],
    buckets: [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2,5]
  });
  register.registerMetric(httpRequestDuration);

  const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method','route','status_code']
  });
  register.registerMetric(httpRequestsTotal);

  const httpRequestErrorsTotal = new client.Counter({
    name: 'http_request_errors_total',
    help: 'Total HTTP error responses (>=500)',
    labelNames: ['method','route','status_code']
  });
  register.registerMetric(httpRequestErrorsTotal);

  // timing middleware — uses existing `app`
  if (typeof app !== 'undefined') {
    app.use((req, res, next) => {
      const start = process.hrtime();
      res.on('finish', () => {
        const diff = process.hrtime(start);
        const seconds = diff[0] + diff[1] / 1e9;
        const route = (req.route && req.route.path) ? req.route.path : req.path;
        httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(seconds);
        httpRequestsTotal.labels(req.method, route, String(res.statusCode)).inc();
        if (res.statusCode >= 500) {
          httpRequestErrorsTotal.labels(req.method, route, String(res.statusCode)).inc();
        }
      });
      next();
    });

    // add /metrics endpoint
    app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
      } catch (err) {
        res.status(500).end(err);
      }
    });
  } else {
    console.warn('Prometheus: `app` not found — metrics not mounted on same express instance.');
  }
} catch (err) {
  console.error('Prometheus setup error:', err);
}
/* ===== End Prometheus metrics block ===== */
