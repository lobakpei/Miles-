#!/usr/bin/env node
'use strict';

/*
 * Compatibility entry point from the first remote Outcome First spike.
 * Keep one browser workflow as the source of truth: browser-qa.js now covers
 * v6.79.0-draft home, calculator, planner gateway, article, privacy, sharing
 * and RTW regression checks across 360/390/430/768/1440 viewports.
 */
require('./browser-qa.js');
