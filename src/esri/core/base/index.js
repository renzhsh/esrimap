import esri from './esri';
import EsriMap from './esriMap';
import { ModuleLoader, loader } from './loader';
import EsriConfig from './config';

EsriMap.use(ModuleLoader);
EsriMap.use(EsriConfig);

export { esri, EsriMap, loader };