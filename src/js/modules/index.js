//
// // Toggle the hover class from an element on mouse-enter and mouse-leave
// import(`./_mouse_hover_state.js`).then(module => module.init());
//
// // initialise bootstrap tooltips
// import(`./_bs_tooltips.js`).then(module => module.init());
//
// // Project code for Embla carousels
// import(`./_embla_carousel.js`).then(module => module.init());
//
// // Globe from Cobe
// import(`./_cobe_globe.js`).then(module => module.init());
//
//
// import(`./_image_slider.js`).then(module => module.init());
//
// import(`./_counter_animation.js`).then(module => module.init());
// import(`./_contact_form_handler.js`).then(module => module.init());


export const init = async () => {
    // Use Promise.all to run all module initializations at the same time
    await Promise.all([
        import(`./_mouse_hover_state.js`).then(module => module.init()),
        import(`./_bs_tooltips.js`).then(module => module.init()),
        import(`./_embla_carousel.js`).then(module => module.init()),
        import(`./_cobe_globe.js`).then(module => module.init()),
        import(`./_image_slider.js`).then(module => module.init()),
        import(`./_counter_animation.js`).then(module => module.init()),
        import(`./_contact_form_handler.js`).then(module => module.init())
    ]);
};