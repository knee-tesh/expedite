
import { App, Duration } from 'aws-cdk-lib';
import MainStack from './mainstack';

const app = new App({ context: { ROOT_DIRECTORY_PATH: `${__dirname}` } });
const stack = new MainStack(app, 'MyInfraStack', { rootDirectory: `${__dirname}`})