const {resolve} = require('node:path');
const express = require('express');

const uploadPath = resolve(__dirname, '..', '..', 'uploads');

const fileRouteConfig = express.static(uploadPath)
// static - arquivo que não muda

module.exports = fileRouteConfig