// Import your component loader's init function
import { init as initLoader } from './component-loader.js';
// Import your modules' init function (we'll create this next)
import { init as initModules } from './modules/index.js';

export const reinitializeScripts = async () => {
    // Run the component loader
    await initLoader();
    // Run our modules' logic
    await initModules();
};