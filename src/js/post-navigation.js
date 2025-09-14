// Import your component loader's init function
import { init as initLoader } from './component-loader.js';
// Import your modules' init function (we'll create this next)
import { init as initModules } from './modules/index.js';

export const reinitializeScripts = async () => {
    // 1. Run the component loader again
    await initLoader();
    // 2. Run your modules' logic again
    await initModules();
};