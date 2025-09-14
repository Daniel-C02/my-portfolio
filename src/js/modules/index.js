export const init = async () => {
    // Use Promise.all to run all module initializations at the same time
    await Promise.all([
        import(`./_mouse_hover_state.js`).then(module => module.init()),
        import(`./_bs_tooltips.js`).then(module => module.init()),
        import(`./_embla_carousel.js`).then(module => module.init()),
        import(`./_cobe_globe.js`).then(module => module.init()),
        import(`./_image_slider.js`).then(module => module.init()),
        import(`./_counter_animation.js`).then(module => module.init()),
        import(`./_contact_form_handler.js`).then(module => module.init()),
        import(`./_btn_arrow_anim_wait.js`).then(module => module.init())
    ]);
};