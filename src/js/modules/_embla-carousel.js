import EmblaCarousel from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";

export const init = () => {

    /*
     * Home page, Showcase section, Top Right card, Auto scroll tags
     */
    (() => {
        const emblaNodes = document.querySelectorAll("#s_home_showcase .embla.auto-scroll-tags");
        emblaNodes.forEach((emblaNode) => {
            const viewportNode = emblaNode.querySelector('.embla__viewport');

            EmblaCarousel(viewportNode, { loop: true }, [
                AutoScroll({
                    speed: parseFloat(emblaNode.dataset.speed) || 1,
                    startDelay: 0,
                    direction: emblaNode.dataset.direction || "forward",
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                    playOnInit: true,
                }),
            ]);
        });
    })();

    /*
     * Home page, Showcase section, Bottom Right card, Auto scroll current project cards
     */
    (() => {
        const emblaNode = document.querySelector("#s_home_showcase .embla.hover_scroll_cards");
        const viewportNode = emblaNode.querySelector('.embla__viewport');

        EmblaCarousel(viewportNode, { loop: true }, [
            AutoScroll({
                speed: 0.6,
                startDelay: 0,
                direction: "forward",
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                playOnInit: true,
            }),
        ]);
    })();
}