import { LayersType } from '../@types/layersType.js';
import { generateApiLayer } from './api.js';
import { generateApplicationLayer } from './application.js';
import { generateDomainLayer } from './domain.js';
import { generateInfraestructureLayer } from './infrastructure.js';
import { generateIOCLayer } from './ioc.js';
import { generateTestLayer } from './test.js';

export function generateLayers(captalizedName: string): LayersType[] {
  return [
    generateApiLayer(captalizedName),
    generateApplicationLayer(),
    generateDomainLayer(captalizedName),
    generateInfraestructureLayer(captalizedName),
    generateIOCLayer(captalizedName),
    generateTestLayer(),
  ];
}
