/*
 * Global Form Submission Handler
 */
import { fireSweetalert } from "../utilities/sweetalert.js";
import {isMobile} from "@js/utilities/is_mobile.js"; // Ensure this path is correct

export const init = () => {
    // Get the contact form
    const form = document.querySelector('form.contact-form');
    if (!form) return; // No forms to initialize

    const errorElements = new Map();

    // Find all input and textarea elements within this specific form
    form.querySelectorAll('input, textarea').forEach((inputEl) => {
        // Find the corresponding error element (ID format like 'name_error')
        const errorEl = form.querySelector(`#${inputEl.name}_error`);

        if (errorEl) {
            errorElements.set(inputEl.name, errorEl);

            // Add event listener to clear error on input
            inputEl.addEventListener('input', () => {
                errorEl.classList.remove('show');
                errorEl.textContent = '';
            });
        }
    });

    const toggleSubmitterState = (btn, disabled, loader) => {
        disabled
            ? btn.classList.add('disabled')
            : btn.classList.remove('disabled');
        loader
            ? btn.classList.add('loader')
            : btn.classList.remove('loader');
    }

    // Attach the submit event listener to the form
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default browser submission

        // Find the submit button
        const submitButton = event.submitter || form.querySelector('button[type="submit"]');
        const postTo = "/api/send-email";

        if (!submitButton) {
            console.error('Form submission failed: No submit button found.');
            fireSweetalert('error', 'Configuration Error', 'Could not submit the form.');
            return;
        }

        // Disable the submit button
        toggleSubmitterState(submitButton, true, false);
        if(isMobile()) {
            submitButton.classList.remove('active');
            setTimeout(() => submitButton.classList.add('active'), 350);
        }

        // Clear previous errors
        errorElements.forEach((el) => {
            el.classList.remove('show');
            el.textContent = '';
        });

        // Create a FormData object from the form
        const formData = new FormData(form);
        // Convert FormData to a plain JavaScript object
        const formObject = Object.fromEntries(formData.entries());

        // Validate form data
        const validationErrors = validateForm(formObject);

        // If any validation errors are found - display them to the user
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([fieldName, errorMessage]) => {
                const errorEl = errorElements.get(fieldName);
                if (errorEl) {
                    errorEl.textContent = errorMessage;
                    errorEl.classList.add('show');
                }
            });
            toggleSubmitterState(submitButton, false, false);
            return; // Stop the submission if there are errors
        }

        // Disable button and show loading state
        toggleSubmitterState(submitButton, true, true);

        try {
            const response = await fetch(postTo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            const result = await response;

            if (!response.ok) {
                // Get the response status
                const status = response.status;

                // Handle 'not found'
                if (status === 404) {
                    fireSweetalert(
                        'error', '404',
                        'The form route could not be found.',
                    );
                } else if (status === 0) {
                    fireSweetalert(
                        'error', 'Network Error',
                        'Could not connect to the server. Please check your internet connection and try again.'
                    );
                } else if (status === 429) {
                    fireSweetalert(
                        'warning', 'Too Many Requests',
                        'You have submitted this form too many times. Please wait a moment and try again.'
                    );
                } else {
                    // Handle other server errors (like 500, etc.)
                    throw new Error(result.message || 'An unknown error occurred.');
                }
            } else {
                // Handle success
                fireSweetalert(
                    'success',
                    result.title || 'Thank You!',
                    result.message || 'Your form has been submitted successfully.'
                );
                form.reset(); // Reset the form fields
                window.dispatchEvent(new CustomEvent('form-reset'));
            }
        } catch (error) {
            // Handle other exceptions
            console.error('Submission Error:', error);
            fireSweetalert(
                'error',
                'Something went wrong on my end.',
                'An unexpected error occurred. Please try again later. If the issue persists, contact me directly on 02.christensendaniel@gmail.com.'
            );
        } finally {
            // This block runs whether the request succeeds or fails
            // Re-enable the button and remove the loader class
            toggleSubmitterState(submitButton, false, false);
        }
    });
};

/**
 * Validates the form data based on a set of rules.
 * @param {object} data - The plain object from the form.
 * @returns {object} An object containing any validation errors.
 */
function validateForm(data) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email format

    // Rule: Name - required, string, max:255
    if (!data.name || data.name.trim() === '') {
        errors.name = 'The name field is required.';
    } else if (data.name.length > 255) {
        errors.name = 'The name may not be greater than 255 characters.';
    }

    // Rule: Subject - required, string, max:255
    // Note: This assumes you have a 'subject' field in your HTML form.
    if (data.subject !== undefined) {
        if (!data.subject || data.subject.trim() === '') {
            errors.subject = 'The subject field is required.';
        } else if (data.subject.length > 255) {
            errors.subject = 'The subject may not be greater than 255 characters.';
        }
    }

    // Rule: Email - required, email, max:255
    if (!data.email || data.email.trim() === '') {
        errors.email = 'The email field is required.';
    } else if (data.email.length > 255) {
        errors.email = 'The email may not be greater than 255 characters.';
    } else if (!emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    // Rule: Message - required, string, max:2000
    if (!data.message || data.message.trim() === '') {
        errors.message = 'The message field is required.';
    } else if (data.message.length > 2000) {
        errors.message = 'The message may not be greater than 2000 characters.';
    }

    return errors;
}
