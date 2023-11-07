import React, { useEffect } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";

export default function CustomButtonPositionSplide({ children, arrows, perPage, perPageLessThan1080, perPageLessThan720, perMove, gap, padding, paddingLessThan1080, paddingLessThan720, splideElRef, pagination, start, direction, type, length, index }) {
    let _perPageLessThan1080 = perPageLessThan1080 === undefined || perPageLessThan1080 === null ? perPage - 1 : perPageLessThan1080;
    let _perPageLessThan720 = perPageLessThan720 === undefined || perPageLessThan720 === null ? perPage - 1 : perPageLessThan720;
    let _paddingLessThan720 = paddingLessThan720 === undefined || paddingLessThan720 === null ? padding : paddingLessThan720;
    let _paddingLessThan1080 = paddingLessThan1080 === undefined || paddingLessThan1080 === null ? padding : paddingLessThan1080;

    //If autoWidth is set then perPage is disregarded  
    return (
        <>
            <Splide
                tag="section"
                ref={splideElRef}
                options={{
                    direction: direction || "ltr",
                    height: direction ? "100%" : "auto",
                    start: start,
                    pagination: pagination,
                    focus: "center",
                    arrows: arrows,
                    type: type || "slide",
                    perPage: perPage,
                    perMove: perMove,
                    gap: gap,
                    padding: padding,
                    breakpoints: {
                        1080: {
                            perPage: _perPageLessThan1080,
                            padding: _paddingLessThan1080
                        },
                        720: {
                            perPage: _perPageLessThan720,
                            padding: _paddingLessThan720
                        },
                    },
                }}
                hasTrack={false}
            >
                <SplideTrack>
                    {React.Children.map(children, (child, index) => {
                        return <SplideSlide className="flex justify-center">{child}</SplideSlide>;
                    })}
                </SplideTrack>
                <div className="splide__arrows relative" style={{ opacity: "100%" }}>
                    <button className={`splide__arrow splide__arrow--prev`} style={{ background: index === 0 ? "linear-gradient(90deg,#b0b6ba,#646F79)" : "linear-gradient(90deg,#0052D4,#2175BB)" }} id="prevButton">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" className="w-10 h-10 fill-white" style={{ width: "3rem", marginRight: "2px", height: "3rem", backgroundColor: "transparent", fill: "transparent", stroke: "white" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                    <button className={`splide__arrow splide__arrow--next`} style={{ background: index === length - 1 ? "linear-gradient(90deg,#b0b6ba,#646F79)" : "linear-gradient(90deg,#0052D4,#2175BB)" }} id="nextButton">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" className="w-10 h-10 fill-white" style={{ width: "3rem", marginLeft: "6px", height: "6rem", backgroundColor: "transparent", fill: "transparent", stroke: "white" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </Splide>
        </>
    );
}
