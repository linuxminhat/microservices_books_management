'use client';

import { Carousel } from "./Carousel";
import { ExploreTopBooks } from "./ExploreTopBooks";
import { Heros } from "./Heros";
import { LibraryServices } from "./LibraryServices";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    );
}

