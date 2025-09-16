import { trackPageLoadPercentage } from '@js/preloader/_track_page_load_percentage.js';
import {lockScroll, unlockScroll} from "@js/utilities/scroll_helpers.js";

/**
 * Manages the preloader display and subsequent animation.
 * This script tracks the page load percentage and ensures the preloader
 * is visible for a minimum defined duration before revealing the page content.
 */
(function() {

    // -----------------------------------------------------------------------------------------------------------------
    // --- CONFIGURATION ---
    // -----------------------------------------------------------------------------------------------------------------

    // Set the preloader bar width before full expansion | note its responsive
    const window_width = window.innerWidth;
    let preloader_width_var  = 0.6;
    window_width >= 576  ? preloader_width_var = 0.44 : null;
    window_width >= 1200 ? preloader_width_var = 0.34 : null;
    const PRELOADER_WIDTH_BEFORE_EXPANSION = window_width * preloader_width_var;
    // Document Element & Body
    const html = document.documentElement;
    const body = document.body;
    // Show only the quick version of the preloader
    let QUICK_PRELOADER = body.classList.contains('quick_preloader');
    // Log details to the console
    const logDetails = body.classList.contains('is_testing_env');

    // Before locking scroll, we need to position the page to the top | only for standard preloader pages
    if(!QUICK_PRELOADER) {
        if (history.scrollRestoration) { history.scrollRestoration = 'manual'; }
        window.scrollTo(0, 0);
    } else {
        history.scrollRestoration = 'auto';
    }

    // Lock scroll
    lockScroll(html, body);

    // --- State Variables for Smooth Animation ---
    let displayedPercentage = 0; // The percentage currently visible on screen.
    let targetPercentage = 0;    // The actual percentage reported by the loader.
    let animationFrameId = null;   // To control the animation loop.
    let isComplete = false;      // Ensures the completion logic runs only once.

    // --- Smart Timeout Variables ---
    let smartTimeoutId = null; // To hold the ID of our failsafe timer.
    let isSmartTimeoutRunning = false; // Flag to ensure the timer is only set once.

    // -----------------------------------------------------------------------------------------------------------------
    // --- INITIAL SETUP ---
    // -----------------------------------------------------------------------------------------------------------------

    // Early exit if the preloader is disabled on the body element.
    if (body.classList.contains('preloader_disabled')) { return; }

    // Get references to all the necessary DOM elements.
    const loader_ctn = document.querySelector('#s_preloader');

    // Gracefully handle cases where the preloader element might be missing.
    if (!loader_ctn) {
        console.error('Preloader container #s_preloader not found.');
        return;
    }

    const loader = loader_ctn.querySelector('.loader');
    const loader_text_ctn = loader_ctn.querySelector('.loader_text_ctn');
    const loader_text = loader_ctn.querySelector('.loader_text');
    let preloaderFinished = false;

    // -----------------------------------------------------------------------------------------------------------------
    // --- CORE FUNCTIONS ---
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Handles the final animation sequence to hide the preloader and show page content.
     */
    function endPreloader() {
        // configuration
        const loader_width_t = 400;
        const loader_height_t = 300;
        const expansion_buffer_t = 120;
        const fade_t = 500;

        // Prevent the function from running more than once.
        if (preloaderFinished) return;
        preloaderFinished = true;

        // --- Clear the smart timeout if the preloader ends correctly. ---
        // This is crucial to prevent it from firing after the preloader has already closed.
        if (smartTimeoutId) {
            clearTimeout(smartTimeoutId);
        }

        // Sequence Step 1: Expand the loader bar to full width, then full height.
        if (loader && !QUICK_PRELOADER) {
            loader.classList.add('animate');

            loader.style.left = 0;
            loader.style.width = '100%';

            setTimeout(() => {
                loader.style.top = 0;
                loader.style.height = '100vh';
            }, loader_width_t); // This delay should match the width transition time.
        }

        // Sequence Step 2: After the expansion animation, fade out the entire preloader.
        const expansionTime =
            QUICK_PRELOADER
                ? 0 // immediately show
                : loader_width_t + loader_height_t + expansion_buffer_t; // width + height + buffer transition time.

        // Fade out the entire preloader.
        setTimeout(() => {
            loader_ctn.style.opacity = 0;

            // Fade in the main page content simultaneously.
            body.classList.remove('preloader_active');

            // Sequence Step 3: After the fade-out is complete, hide the preloader permanently.
            setTimeout(() => {
                loader_ctn.style.display = 'none';
                // Unlock scroll
                unlockScroll(html, body);
                // Emit the Page finished loading event
                window.dispatchEvent(new CustomEvent('preloader-loaded'));
            }, fade_t); // This delay should match the opacity transition time.

        }, expansionTime);
    }

    /**
     * The core animation loop that runs every frame to smoothly update the visuals.
     */
    function runAnimation() {
        // Check for completion FIRST, and make it more robust.
        if (targetPercentage >= 100 && !isComplete) {
            isComplete = true; // Mark as complete immediately.

            // Snap the visuals to 100% to ensure they are correct before finishing.
            if (loader_text) {
                loader_text.textContent = '100%';
            }
            if (loader) {
                loader.style.width = PRELOADER_WIDTH_BEFORE_EXPANSION + 'px';
            }

            // end the preloader
            endPreloader();

            // Stop the animation loop since we are done.
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            return;
        }

        // If not complete, continue the animation as before.
        if (displayedPercentage >= targetPercentage && targetPercentage > 0) {
            animationFrameId = null;
            return;
        }

        displayedPercentage += (targetPercentage - displayedPercentage) * 0.08;
        const roundedPercent = Math.min(100, Math.round(displayedPercentage));

        if (loader_text) {
            loader_text.textContent = roundedPercent + '%';
        }

        if (loader) {
            const updatedWidth = Math.min(displayedPercentage, 100) / 100 * PRELOADER_WIDTH_BEFORE_EXPANSION;
            loader.style.width = updatedWidth + 'px';
        }

        // Request the next frame.
        animationFrameId = requestAnimationFrame(runAnimation);
    }

    /**
     * The callback function called by the tracker on every progress update.
     * It checks if the conditions are met to start the failsafe timer.
     * @param {number} percentage - The current page load percentage (0-100).
     */
    function updatePreloader(percentage) {
        // Set the new target, ensuring it never goes backwards.
        targetPercentage = Math.max(targetPercentage, percentage);

        // Start the animation loop if it's not already running.
        if (!animationFrameId && !isComplete) {
            animationFrameId = requestAnimationFrame(runAnimation);
        }

        // Clear the smart timeout if we've received another request to update the preloader
        clearTimeout(smartTimeoutId);
        isSmartTimeoutRunning = false;

        // --- Smart Timeout Logic ---
        // Conditions:
        // 1. Load percentage is at 82% or higher.
        // 2. The failsafe timer isn't already running.
        // 3. The preloader hasn't already completed its cycle.
        if (percentage >= 82 && !isSmartTimeoutRunning && !isComplete) {
            // Set the flag to true so this block only ever runs once.
            isSmartTimeoutRunning = true;

            if(logDetails) console.log('Preloader at 82%+. Starting 3-second failsafe timer.');

            // Start the 3-second timer.
            smartTimeoutId = setTimeout(() => {
                if(logDetails) console.warn('Preloader appears stuck near completion. Forcing end via smart timeout.');
                // Stop the animation loop since we are done.
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                // set the target percentage to completion
                targetPercentage = 100;
                // run the animation to end the preloader
                runAnimation();
            }, 3000); // 3 seconds
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // --- INITIALIZATION ---
    // -----------------------------------------------------------------------------------------------------------------

    // debugging
    if(logDetails) {
        trackPageLoadPercentage(
            (percentage) => {},
            {
                logDetails: true // <--- ENABLE THIS FOR DEBUGGING
            }
        );
    }

    // for the our work page, we need to enable the quick preloader on mobile
    if(window.innerWidth < 576 && document.querySelector('#s_projects_overview')) {
        QUICK_PRELOADER = true;
        body.classList.add('quick_preloader');
    }

    // Handle the preloader logic based on environment and device width
    if (QUICK_PRELOADER) {
        // Immediately end preloader if QUICK_PRELOADER mode is enabled
        endPreloader();

    } else if (window.innerWidth < 576 && document.querySelector('#home #s_hero')) {
        /**
         * On mobile devices (<576px): Wait for the homepage showreel video to
         * fully load before attempting autoplay. End preloader when video starts.
         */
        const video = document.getElementById('mobileShowReelVideo');
        if (!video) {
            console.error('The mobile ShowReel video could not be found in the DOM. Therefore we will end the preloader.');
            endPreloader();
        } else {
            handleMobileVideoPlayback(video);
        }

    } else {
        /**
         * On larger screens: Show preloader text after a
         * brief delay, then track page loading progress
         */
        setTimeout(() => {
            loader_text_ctn.style.display = 'block';

            // Begin tracking page load percentage with our custom update function
            trackPageLoadPercentage(updatePreloader);
        }, 320); // Slight delay to allow preloader styles to initialize
    }

    /**
     * Attempts to autoplay the given video element. If autoplay fails (due to browser restrictions),
     * waits for user interaction to manually trigger play. Calls `endPreloader()` when playback starts.
     *
     * @param {HTMLVideoElement} video - The mobile showreel video element
     */
    function handleMobileVideoPlayback(video) {
        // This function contains the core playback logic
        const attemptPlay = () => {
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Autoplay successful
                        endPreloader();
                    })
                    .catch(() => {
                        // Autoplay blocked – wait for user interaction
                        console.warn('Autoplay failed. Initialise manual page load...');
                        trackPageLoadPercentage(updatePreloader);
                    });
            } else {
                console.warn('Autoplay playPromise returned undefined. Initialise manual page load...');
                trackPageLoadPercentage(updatePreloader);
            }
        };

        // Check if the video is already in a state where it can play
        // HAVE_ENOUGH_DATA (readyState 4) means the 'canplay' event has likely already fired
        if (video.readyState >= 4) {
            if(logDetails) console.log('Video already playable. Attempting to play immediately.');
            attemptPlay();
        } else {
            // Otherwise, wait for the 'canplay' event
            if(logDetails) console.log('Video not ready. Waiting for the "canplay" event.');
            video.addEventListener('canplay', attemptPlay, { once: true });
        }
    }

})(); // IIFE (Immediately Invoked Function Expression) to avoid global scope pollution.
