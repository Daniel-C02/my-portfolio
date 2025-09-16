/**
 * Calculates and provides the page load percentage.
 * This version tracks standard resources AND web fonts, and includes a robust fallback.
 * Fixes a race condition for cached stylesheets.
 *
 * @param {function(number)} onProgress - A callback function that will be invoked with the current load percentage (0-100).
 * @param {object} [options] - Optional configuration.
 * @param {string} [options.resourceQuery] - Query selector for resources to track.
 * @param {boolean} [options.logDetails] - Whether to log detailed loading information to theconsole.
 */
export function trackPageLoadPercentage(onProgress, options = {}) {

    /**
     * Dynamically ignores videos based on screen width before preloading.
     * CSS selectors cannot evaluate media queries, so we must use JS to
     * add an ignore attribute to the video that is not currently active.
     */
    try {
        const screenWidth = window.innerWidth;
        const desktopVideo = document.getElementById('desktopShowReelVideo');

        // If the screen is for desktop, ignore the mobile video.
        if (screenWidth < 576) {
            if (desktopVideo) desktopVideo.setAttribute('data-preloader-ignore', 'true');
        }
    } catch (error) {
        console.error('Preloader: Error filtering videos.', error);
    }

    // Array of script substrings to exclude from preloader tracking.
    const excludedScripts = [
        '@vite/client',
        'livewire.js',
        'app.js',
        '_preloader.js'
    ];

    // Dynamically build the script selector by adding a :not() for each excluded script.
    const scriptExclusionSelectors = excludedScripts.map(script => `:not([src*="${script}"])`).join('');
    const scriptSelector = `script[src]:not([data-preloader-ignore])${scriptExclusionSelectors}`;

    const settings = {
        resourceQuery: [
            'img:not([data-preloader-ignore])',
            'link[rel="stylesheet"]',
            'video:not([data-preloader-ignore])',
            'audio',
            'iframe',
            'lottie-player',
            scriptSelector // Use the dynamically generated selector
        ].join(','),
        logDetails: false,
        ...options
    };

    let totalResources = 0;
    let loadedResources = 0;
    let preloaderHasFinished = false; // Prevents the preloader from finishing multiple times

    function _updateAndCallback() {
        if (preloaderHasFinished && loadedResources < totalResources) {
            // If completion has been forced, ignore any further updates from late-firing events.
            return;
        }

        let percentage = 0;
        if (totalResources > 0) {
            percentage = Math.min(100, Math.round((loadedResources / totalResources) * 100));
        } else if (document.readyState === 'complete') {
            percentage = 100;
        }

        if (percentage === 100) {
            if (preloaderHasFinished) return; // Don't trigger the 100% logic twice
            preloaderHasFinished = true;
        }

        if (typeof onProgress === 'function') {
            onProgress(percentage);
        }
        if (settings.logDetails) console.log(`Page Load Progress: ${loadedResources}/${totalResources} (${percentage}%)`);
    }

    function _resourceHandled(resourceIdentifier) {
        // Only increment if the preloader hasn't already been forced to 100%.
        if (!preloaderHasFinished) {
            loadedResources++;
            if (settings.logDetails) console.log(`Loaded resource (${loadedResources}/${totalResources}): ${resourceIdentifier}`);

            _updateAndCallback();
        }
    }

    function _initializeTracking() {
        if (settings.logDetails) console.log('Initializing page load percentage tracking...');
        const resources = document.querySelectorAll(settings.resourceQuery);
        totalResources = resources.length;

        // --- FONT TRACKING ---
        if (document.fonts) {
            totalResources++; // Add one to the total for the font-ready signal.
            document.fonts.ready.then(() => {
                _resourceHandled('document.fonts.ready (event)');
            }).catch(error => {
                if (settings.logDetails) console.warn('Font loading failed (counted as handled):', error);
                _resourceHandled('document.fonts.ready (error)');
            });
        }

        if (settings.logDetails) console.log(`Found ${totalResources} trackable resources (including fonts).`);
        if (totalResources === 0) {
            _updateAndCallback();
            return;
        }

        resources.forEach(resource => {
            let eventName = 'load';
            let alreadyProcessed = false;
            const resourceIdentifier = resource.src || resource.href || resource.tagName;

            if (resource.tagName === 'IMG') {
                if (resource.complete) {
                    if (settings.logDetails) console.log('Image already complete:', resourceIdentifier);
                    _resourceHandled(resourceIdentifier + ' (already complete)');
                    alreadyProcessed = true;
                }
            } else if (resource.tagName === 'VIDEO' || resource.tagName === 'AUDIO') {
                eventName = 'loadeddata';
                if (resource.readyState >= 3) { // HAVE_FUTURE_DATA
                    if (settings.logDetails) console.log('Media already loaded:', resourceIdentifier);
                    _resourceHandled(resourceIdentifier + ' (already loaded)');
                    alreadyProcessed = true;
                }
            } else if (resource.tagName === 'LINK') {
                // Check if a cached stylesheet has already loaded
                if (resource.sheet) {
                    if (settings.logDetails) console.log('Stylesheet already loaded from cache:', resourceIdentifier);
                    _resourceHandled(resourceIdentifier + ' (already loaded)');
                    alreadyProcessed = true;
                }
            } else if (resource.tagName === 'IFRAME') {
                try {
                    if (resource.contentWindow && resource.contentWindow.document.readyState === 'complete') {
                        if (settings.logDetails) console.log('Iframe already loaded from cache:', resourceIdentifier);
                        _resourceHandled(resourceIdentifier + ' (already loaded)');
                        alreadyProcessed = true;
                    }
                } catch (e) {
                    if (settings.logDetails) console.log('Cannot check cross-origin iframe state, relying on event listener.');
                }
            } else if (resource.tagName === 'LOTTIE-PLAYER') {
                try {
                    if (resource.getLottie()) {
                        alreadyProcessed = true;
                        _resourceHandled(resourceIdentifier + ' (already loaded)');
                    }
                } catch (error) {
                    if (settings.logDetails) console.log('Error handling LOTTIE-PLAYER resource.');
                }
            }

            if (!alreadyProcessed) {
                const loadListener = () => {
                    _resourceHandled(resourceIdentifier + ' (event)');
                    cleanup();
                };
                const errorListener = () => {
                    if (settings.logDetails) console.warn('Failed to load (counted as handled):', resourceIdentifier);
                    _resourceHandled(resourceIdentifier + ' (error)');
                    cleanup();
                };
                const cleanup = () => {
                    resource.removeEventListener(eventName, loadListener);
                    resource.removeEventListener('error', errorListener);
                };

                resource.addEventListener(eventName, loadListener);
                resource.addEventListener('error', errorListener);
            }
        });
        _updateAndCallback(); // Initial call
    }

    // --- Final Completion Logic with Grace Period ---
    window.addEventListener('load', function() {
        const gracePeriodTimeout = 1000; // 1 seconds

        // This function will be called to guarantee the preloader finishes.
        function forceCompletion() {
            if (preloaderHasFinished) return;

            // debug preloader tracking
            const resources = document.querySelectorAll(settings.resourceQuery);
            debugPageLoadTracker(resources, settings);

            if (settings.logDetails) console.log('Preloader is forcing 100% completion.');

            // Manually set counts to guarantee 100%
            if (totalResources > 0) {
                loadedResources = totalResources;
            } else {
                totalResources = 1;
                loadedResources = 1;
            }
            _updateAndCallback();
        }

        // Check if media is holding things up.
        const mediaElements = document.querySelectorAll('video, audio');
        let isMediaPending = false;
        mediaElements.forEach(media => {
            if (!media.hasAttribute('data-preloader-ignore') && media.readyState < 3) {
                isMediaPending = true;
            }
        });

        if (isMediaPending) {
            if (settings.logDetails) console.log(`Window "load" fired but media is pending. Starting a ${gracePeriodTimeout/1000}-second grace period.`);
            setTimeout(forceCompletion, gracePeriodTimeout);
        } else {
            // If window.load has fired and no media is pending, something else might be stuck.
            // We'll force completion after a very short delay to allow any final events to fire.
            setTimeout(forceCompletion, 250);
        }
    });

    // --- Start Tracking ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initializeTracking);
    } else {
        _initializeTracking();
    }
}

function debugPageLoadTracker(resources, settings) {
    resources.forEach(resource => {
        let alreadyProcessed = true;
        const resourceIdentifier = resource.src || resource.href || resource.tagName;

        if (resource.tagName === 'IMG') {
            if (! resource.complete) {
                alreadyProcessed = false;
            }
        } else if (resource.tagName === 'VIDEO' || resource.tagName === 'AUDIO') {
            if (! (resource.readyState >= 3)) { // HAVE_FUTURE_DATA
                alreadyProcessed = false;
            }
        } else if (resource.tagName === 'LINK') {
            if (! resource.sheet) {
                alreadyProcessed = false;
            }
        } else if (resource.tagName === 'IFRAME') {
            try {
                if (! (resource.contentWindow && resource.contentWindow.document.readyState === 'complete')) {
                    alreadyProcessed = false;
                }
            } catch (e) {
                if (settings.logDetails) console.log('Cannot check cross-origin iframe state, relying on event listener.');
            }
        } else if (resource.tagName === 'LOTTIE-PLAYER') {
            try {
                if (!resource.getLottie()) {
                    alreadyProcessed = false;
                }
            } catch (error) {
                if (settings.logDetails) console.log('Error handling LOTTIE-PLAYER resource.');
            }
        }

        if (!alreadyProcessed) {
            if (settings.logDetails) console.error(`Resource tracked unsuccessfully: ${resourceIdentifier}`)
        }
    });
}
