// ==UserScript==
// @name Jut.su Naruto Colorizer
// @namespace jutsu-naruto-colorizer
// @version 0.1.0
// @description An extension that colors the Naruto series on Jut.su according to their importance, described in the guide https://vk.com/@narutosmotri-gaid-po-prosmotru-naruto
// @description:ru Расширение, которое окрашивает серии Наруто на сайте Jut.su в соотвествии с их важностью, описанной в гайде https://vk.com/@narutosmotri-gaid-po-prosmotru-naruto
// @author addefan
// @match https://jut.su/naruuto/season-1/
// @match https://jut.su/naruuto/season-2/
// @icon https://gen.jut.su/templates/school/images/dark_mode_moon.png
// @updateURL https://github.com/Addefan/jutsu-naruto-colorizer/raw/main/main.user.js
// @downloadURL https://github.com/Addefan/jutsu-naruto-colorizer/raw/main/main.user.js
// ==/UserScript==

(function () {
    "use strict";

    const range = (from, to) => {
        return [...Array(to - from + 1).keys()].map(i => i + from);
    };

    const flipObject = (obj) => {
        return Object.freeze(Object.entries(obj).reduce((acc, [key, values]) => {
            values.forEach(value => {
                acc[value] = key;
            });
            return acc;
        }, {}));
    };

    const SEASON_1_TYPE_TO_EPISODES = Object.freeze({
        "С": [...range(1, 25), ...range(27, 96), 98, 100, ...range(107, 135)],
        "С]+[Ф4": [220],
        "Ф1": [99, ...range(101, 106), ...range(136, 141)],
        "Ф2": [97, ...range(148, 157), 161, ...range(169, 173), ...range(178, 183), 185, ...range(187, 192), 194],
        "Ф3": [...range(142, 147), 158, 159, 160, ...range(162, 168), 186,
               193, 195, 196, ...range(203, 207), ...range(209, 215)],
        "Ф4": [...range(174, 177), 184, ...range(197, 201), 208, ...range(216, 219)],
        "П": [26, 202],
    });

    const SEASON_2_TYPE_TO_EPISODES = Object.freeze({
        "С": [...range(1, 53), 55, ...range(72, 88), ...range(113, 143), ...range(152, 169), ...range(172, 175),
              ...range(197, 217), 221, 222, 243, 244, 245, ...range(247, 253), 255, 256, ...range(261, 270),
              ...range(272, 278), 282, 283, ...range(297, 301), 322, 323, 326, 329, ...range(332, 336),
              ...range(339, 345), 362, 363, ...range(364, 367), 372, 375, ...range(378, 384), 387, 391, 392, 393,
              414, 420, 421, 424, 425, 459, 463, 470, 471, ...range(473, 477)],
        "С]+[Н": [451, 458],
        "С]+[Ф1": [54, 56, 71, 89, 90, 112, 176, 178, 181, 246, 254,
                   321, 324, 325, 327, 328, 330, 331, 337, 338, 346, 350, 418, 419, 462, 472, 478, 479],
        "С]+[Ф2": [179, 180, 218, 219, 220, 373, 374, 385, 386, 388, 415, 417, 427],
        "С]+[Ф3": [296, 302, 426],
        "Н": [...range(452, 457), ...range(484, 500)],
        "Ф1": [...range(57, 70), ...range(91, 111), ...range(144, 151), 177, 185, 189, 194, 196,
               280, 284, 285, 288, 289, 316, 317, 319, 347, 348, 349, ...range(351, 361),
               ...range(368, 371), 460, 461, ...range(463, 468), ...range(480, 483)],
        "Ф2": [182, 187, 188, 191, 229, 234, 236, 271, 286, 287, 309, 310, 311, 313, 314, 315, 318,
               389, 390, 416, 428, 431, 469],
        "Ф3": [170, 171, 186, 192, 193, 232, 237, 242, 279, ...range(290, 295), ...range(303, 308),
               ...range(394, 413), 422, 423],
        "Ф4": [183, 184, 190, 195, ...range(223, 228), 230, 231, 233, 235, ...range(238, 241), 281,
               312, 320, 376, 377, 429, 430, ...range(432, 450)],
        "П": [...range(257, 260)],
    });

    const TYPE_TO_COLOR = Object.freeze({
        "[С]": "#1cff00",
        "[С]+[Н]": "#1cff00",
        "[С]+[Ф1]": "#1cff00",
        "[С]+[Ф2]": "#1cff00",
        "[С]+[Ф3]": "#1cff00",
        "[С]+[Ф4]": "#1cff00",
        "[Н]": "#921ceb",
        "[Ф1]": "#18e000",
        "[Ф2]": "#14bb00",
        "[Ф3]": "#198000",
        "[Ф4]": "#136000",
        "[П]": "#5b5b5b",
    });

    const SEASON_1_EPISODE_TO_TYPE = flipObject(SEASON_1_TYPE_TO_EPISODES);
    const SEASON_2_EPISODE_TO_TYPE = flipObject(SEASON_2_TYPE_TO_EPISODES);

    const getEpisodes = () => document.querySelectorAll(".short-btn.green.video");
    const getEpisodeNum = (episode) => parseInt(episode.innerText.split(" ")[0]);
    const fixClassName = (name) => name.replace(/[\[\]+]/g, "");

    const removeDefaultTypes = () => {
        const episodes = getEpisodes();
        episodes.forEach(episode => {
            const type = episode.querySelector("sup");
            if (type) {
                type.remove();
            }
        });
    };

    const addTypeStyles = (type_to_color_mapper) => {
        let css = "";
        for (let [type, color] of Object.entries(type_to_color_mapper)) {
            css += `.${fixClassName(type)} { background-color: ${color}!important }\n`;
            css += `.${fixClassName(type)} sup:before { content: ' ${type}'!important }\n`;
        }

        const styleTag = document.createElement("style");
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
    };

    const addTypeClassesAndTags = (episode_to_type_mapper) => {
        const episodes = getEpisodes();
        episodes.forEach(episode => {
            const episodeNum = getEpisodeNum(episode);
            const typeText = `[${episode_to_type_mapper[episodeNum]}]`;
            const type = document.createElement("sup");

            episode.classList.add(fixClassName(typeText));
            episode.appendChild(type);
        });
    };

    const main = (episode_to_type_mapper, type_to_color_mapper) => {
        removeDefaultTypes();
        addTypeStyles(type_to_color_mapper);
        addTypeClassesAndTags(episode_to_type_mapper, type_to_color_mapper);
    };

    switch (window.location.pathname) {
        case "/naruuto/season-1/":
            main(SEASON_1_EPISODE_TO_TYPE, TYPE_TO_COLOR);
            break;
        case "/naruuto/season-2/":
            main(SEASON_2_EPISODE_TO_TYPE, TYPE_TO_COLOR);
            break;
    }
})();