
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import bgImage from "../public/images/image7.png";
import Image from "next/image";
import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";
import Head from "next/head";
import Link from "next/link";

export const ActionPage = () => {
  const router = useRouter();
  const getCampaignId = async () => {
    if (await Session.doesSessionExist()) {
      router.push(`/my-nest/mycampaigns`);
    } else {
      router.push("/login");
    }
  };

  var Live = [
    {
      coverPic: "/images/image7.png",
      displayPic: "/images/profile.jpg",
      creatorName: "test2",
      likes: 100,
      views: 400,
      goal: 9000,
      backers: 1225,
      daysLeft: 28,
    },
  ];

  return (
    <>
      <Head>
        <title>Ikarus Nest</title>
      </Head>
      {/* <Header /> */}
      <div>
        {/* <div className="flex justify-center items-center min-h-full w-full">

          <div className="flex gap-2 md:gap-28 flex-col sm:flex-row z-30 top-0">
            <button
              onClick={getCampaignId}
              className="bg-primary-brand hover:bg-sky-500 w-[0px] h-[50px] py-3 rounded-sm text-white text-center"
            >
              Create Campaign
            </button>
            <button
              onClick={() => router.push("/campaigns")}
              className="bg-primary-brand hover:bg-sky-500 w-[0px] h-[50px] py-3 rounded-sm text-white text-center"
            >
              Explore Other Campaigns
            </button>
          </div>
        </div> */}

        <div className="flex flex-col bg-gradient-to-b from-[#c0bebe] to-white">
          <div className="title m-auto mt-24 font-bold text-4xl tracking-wider">
            IKARUS NEST
          </div>
          <div className="mt-4 font-normal text-base m-auto">
            Earn your effort’s worth with Ikarus Nest
          </div>

          <div className="mt-16">
            <div className="flex gap-6 m-auto justify-center">
              <button
                onClick={getCampaignId}
                className="bg-primary-brand p-2 text-white rounded-md"
              >
                Create Campaign
              </button>
              <Link
                href="/marketplace"
                className="bg-primary-brand p-2 text-white rounded-md"
              >
                Explore Models
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-6 justify-center mt-28">
          <div className="w-[20rem]">
            <div className="image w-[5rem] h-[5rem] bg-slate-300 m-auto"></div>
            <div className="mt-6 font-bold text-sm text-center">
              Control file distribution
            </div>
            <div className="text-xs text-ellipsis text-center mt-4">
              Experience true autonomy with Ikarus Nest. Our platform places you
              in the driver's seat, allowing you to set the distribution limit
              for your 3D models. You determine how many times your masterpiece
              can be printed, ensuring your creativity remains exclusive and
              valued.Nest respects your artistic rights. Retain full control and
              rights over your work. With Ikarus Nest, it's not just about
              sharing, it's about controlled sharing. Your art, your rules.
            </div>
          </div>
          <div className="w-[20rem]">
            <div className="image w-[5rem] h-[5rem] bg-slate-300 m-auto"></div>
            <div className="mt-6 font-bold text-sm text-center">
              Trustworthy quality
            </div>
            <div className="text-xs text-ellipsis text-center mt-4">
              We deliver more than just promises. We guarantee premium quality
              3D models, curated from a pool of gifted artists worldwide. Each
              model uploaded onto our platform undergoes a rigorous quality
              check to ensure it meets our exacting standards. Rest assured,
              your 3D printing journey with us will be uncompromised in
              precision, detail, and excellence. With Ikarus Nest, print with
              confidence, print with quality.
            </div>
          </div>

          <div className="w-[20rem]">
            <div className="image w-[5rem] h-[5rem] bg-slate-300 m-auto"></div>
            <div className="mt-6 font-bold text-sm text-center">
              Find your people
            </div>
            <div className="text-xs text-ellipsis text-center mt-4">
              Dive into the world of Ikarus Nest and join our vibrant community
              of passionate 3D enthusiasts.Whether you're an artist or a
              printer, there's a place for you here. Connect, collaborate,
              inspire and be inspired by like-minded individuals who share your
              love for 3D creativity. Grow with us and be a part of a movement
              that bridges the gap between imagination and reality. At Ikarus
              Nest, cayou're family. Welcome home.{" "}
            </div>
          </div>
        </div>

        <div className=" mt-36 flex  justify-evenly">
          <div className="">
            <div className="text-4xl font-bold">30K</div>
            <div className="text-sm">3D Artist</div>
          </div>
          {/* duv */}
          <div className="border-r-2"></div>
          <div className="">
            <div className="text-4xl font-bold">15k</div>
            <div className="text-sm">3D Printers</div>
          </div>
          <div className="border-r-2"></div>
          <div className="">
            <div className="text-4xl font-bold">30K</div>
            <div className="text-sm">3D Artist</div>
          </div>
          <div className="border-r-2"></div>
          <div className="">
            <div className="text-4xl font-bold">30K</div>
            <div className="text-sm">3D Artist</div>
          </div>
        </div>

        <div className="most-viewed-models">
          <div className="flex flex-row mx-16 mt-32">
            <div className="font-bold text-xl">Most viewed models</div>
            <div className="  ml-auto">
              <button className="text-xs font-normal">View All</button>
            </div>
          </div>
          <div
            className={` pt-8 pb-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-x-4 gap-y-10 mx-16 bg-white`}
          >
            {[...Array(6)].map((star, i) => {
              return (
                <div className="flex flex-col w-full max-w-[26rem] m-auto rounded-md  transition-all ease-in-out duration-500 border-[2px] relative overflow-hidden">
                  <div className="">
                    <img
                      src={Live[0].coverPic}
                      alt="Campaign Cover Image"
                      className="w-full h-[10rem] rounded-sm"
                    />
                  </div>

                  <div className="">
                    <div className="px-3  flex flex-row">
                      <div className="title py-3 pr-6 text-sm ">
                        The Underground Army marketing sign-up
                      </div>
                    </div>

                    <div className="flex flex-row text-xs px-3 ">
                      <div className="profilePicSvg pr-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_3160_3413)">
                            <path
                              d="M4 16C4 17.5759 4.31039 19.1363 4.91345 20.5922C5.5165 22.0481 6.40042 23.371 7.51472 24.4853C8.62902 25.5996 9.95189 26.4835 11.4078 27.0866C12.8637 27.6896 14.4241 28 16 28C17.5759 28 19.1363 27.6896 20.5922 27.0866C22.0481 26.4835 23.371 25.5996 24.4853 24.4853C25.5996 23.371 26.4835 22.0481 27.0866 20.5922C27.6896 19.1363 28 17.5759 28 16C28 14.4241 27.6896 12.8637 27.0866 11.4078C26.4835 9.95189 25.5996 8.62902 24.4853 7.51472C23.371 6.40042 22.0481 5.5165 20.5922 4.91345C19.1363 4.31039 17.5759 4 16 4C14.4241 4 12.8637 4.31039 11.4078 4.91345C9.95189 5.5165 8.62902 6.40042 7.51472 7.51472C6.40042 8.62902 5.5165 9.95189 4.91345 11.4078C4.31039 12.8637 4 14.4241 4 16Z"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 13.332C12 14.3929 12.4214 15.4103 13.1716 16.1605C13.9217 16.9106 14.9391 17.332 16 17.332C17.0609 17.332 18.0783 16.9106 18.8284 16.1605C19.5786 15.4103 20 14.3929 20 13.332C20 12.2712 19.5786 11.2537 18.8284 10.5036C18.0783 9.75346 17.0609 9.33203 16 9.33203C14.9391 9.33203 13.9217 9.75346 13.1716 10.5036C12.4214 11.2537 12 12.2712 12 13.332Z"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.22461 25.1307C8.55462 24.0323 9.2299 23.0696 10.1503 22.3853C11.0706 21.7011 12.1871 21.3317 13.3339 21.332H18.6673C19.8156 21.3316 20.9334 21.7019 21.8545 22.3877C22.7755 23.0736 23.4506 24.0384 23.7793 25.1387"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3160_3413">
                              <rect width="32" height="32" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className=" text-gray-400">BOTTEGA 3D</div>
                    </div>

                    <div className="rating flex flex-row text-xs px-3 py-2">
                      <div className="font-bold">4.5</div>
                      {[...Array(5)].map((star, i) => {
                        return (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 cursor-pointer transition duration-200 ease-in-outtext-yellow-500 text-gray-300`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15.3l4.418 2.717-1.135-4.647 3.603-2.946-4.785-.408L12 4.1l-1.69 4.014-4.785.408 3.603 2.946-1.136 4.647L12 15.3z"
                            />
                          </svg>
                        );
                      })}
                    </div>

                    {/* <div className="bg-accent2 mt-2 mb-2 mx-3 rounded-md">
                      <div className="flex flex-row mx-4">
                        <div className="backers flex flex-row ">
                          <div className="pr-2 pt-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_3896_2414)">
                                <path d="M8 7C8 7.53043 8.21071 8.03914 8.58579 8.41421C8.96086 8.78929 9.46957 9 10 9C10.5304 9 11.0391 8.78929 11.4142 8.41421C11.7893 8.03914 12 7.53043 12 7C12 6.46957 11.7893 5.96086 11.4142 5.58579C11.0391 5.21071 10.5304 5 10 5C9.46957 5 8.96086 5.21071 8.58579 5.58579C8.21071 5.96086 8 6.46957 8 7Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 15V14C6 13.4696 6.21071 12.9609 6.58579 12.5858C6.96086 12.2107 7.46957 12 8 12H12C12.5304 12 13.0391 12.2107 13.4142 12.5858C13.7893 12.9609 14 13.4696 14 14V15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 7C15 7.53043 15.2107 8.03914 15.5858 8.41421C15.9609 8.78929 16.4696 9 17 9C17.5304 9 18.0391 8.78929 18.4142 8.41421C18.7893 8.03914 19 7.53043 19 7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5C16.4696 5 15.9609 5.21071 15.5858 5.58579C15.2107 5.96086 15 6.46957 15 7Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17 12H19C19.5304 12 20.0391 12.2107 20.4142 12.5858C20.7893 12.9609 21 13.4696 21 14V15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </g>
                              <defs>
                                <clipPath id="clip0_3896_2414">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div>
                            <span className="font-bold text-xs pr-2 ">234</span>
                            <span className="text-xs">Backers</span>
                          </div>
                        </div>

                        <div className="ml-auto flex flex-row">
                          <div className=" pr-2 pt-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_3896_2424)">
                                <path d="M12 3L8 10H16L12 3Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 17C14 17.7956 14.3161 18.5587 14.8787 19.1213C15.4413 19.6839 16.2044 20 17 20C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17C20 16.2044 19.6839 15.4413 19.1213 14.8787C18.5587 14.3161 17.7956 14 17 14C16.2044 14 15.4413 14.3161 14.8787 14.8787C14.3161 15.4413 14 16.2044 14 17Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 15C4 14.7348 4.10536 14.4804 4.29289 14.2929C4.48043 14.1054 4.73478 14 5 14H9C9.26522 14 9.51957 14.1054 9.70711 14.2929C9.89464 14.4804 10 14.7348 10 15V19C10 19.2652 9.89464 19.5196 9.70711 19.7071C9.51957 19.8946 9.26522 20 9 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </g>
                              <defs>
                                <clipPath id="clip0_3896_2424">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div>
                            <span className="font-bold text-xs pr-2">5</span>
                            <span className="text-xs">Reward Tiers</span>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="most-viewed campaign">
          <div className="flex flex-row mx-16 mt-12">
            <div className="font-bold text-xl">Most viewed campaign</div>
            <div className="  ml-auto">
              <button className="text-xs font-normal">View All</button>
            </div>
          </div>
          <div
            className={` pt-8 pb-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 mx-16 bg-white`}
          >
            {[...Array(4)].map((star, i) => {
              return (
                <div className="flex flex-col w-full max-w-[26rem] m-auto rounded-sm  transition-all ease-in-out duration-500 border-[2px] relative overflow-hidden">
                  <div className="bg-accent2">
                    <div className="flex flex-col p-3">
                      <div>
                        <button className=" bg-primary-brand px-2 text-white rounded-md w-[50px]">
                          Live
                        </button>
                      </div>
                      <div className="flex flex-row mt-3">
                        <div className="price text-base">
                          <span className="font-bold">$ 400</span> raised
                        </div>
                        <div className="ending flex flex-row text-sm ml-auto">
                          <div className="mx-1">
                            <svg
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_3896_1958)">
                                <path
                                  d="M3 5.75C3 5.35218 3.15804 4.97064 3.43934 4.68934C3.72064 4.40804 4.10218 4.25 4.5 4.25H13.5C13.8978 4.25 14.2794 4.40804 14.5607 4.68934C14.842 4.97064 15 5.35218 15 5.75V14.75C15 15.1478 14.842 15.5294 14.5607 15.8107C14.2794 16.092 13.8978 16.25 13.5 16.25H4.5C4.10218 16.25 3.72064 16.092 3.43934 15.8107C3.15804 15.5294 3 15.1478 3 14.75V5.75Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 2.75V5.75"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 2.75V5.75"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M3 8.75H15"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 11.75H7.5V13.25H6V11.75Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_3896_1958">
                                  <rect
                                    width="18"
                                    height="18"
                                    fill="white"
                                    transform="translate(0 0.5)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          End on{" "}
                          <span className="font-bold mx-1"> 28 June</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <img
                      src={Live[0].coverPic}
                      alt="Campaign Cover Image"
                      className="w-full h-[12rem] rounded-sm"
                    />
                  </div>

                  <div className="">
                    <div className="px-3  flex flex-row">
                      <div className="title py-3 pr-6 text-sm ">
                        The Underground Army marketing sign-up
                      </div>
                    </div>

                    <div className="flex flex-row text-xs px-3 ">
                      <div className="profilePicSvg pr-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_3160_3413)">
                            <path
                              d="M4 16C4 17.5759 4.31039 19.1363 4.91345 20.5922C5.5165 22.0481 6.40042 23.371 7.51472 24.4853C8.62902 25.5996 9.95189 26.4835 11.4078 27.0866C12.8637 27.6896 14.4241 28 16 28C17.5759 28 19.1363 27.6896 20.5922 27.0866C22.0481 26.4835 23.371 25.5996 24.4853 24.4853C25.5996 23.371 26.4835 22.0481 27.0866 20.5922C27.6896 19.1363 28 17.5759 28 16C28 14.4241 27.6896 12.8637 27.0866 11.4078C26.4835 9.95189 25.5996 8.62902 24.4853 7.51472C23.371 6.40042 22.0481 5.5165 20.5922 4.91345C19.1363 4.31039 17.5759 4 16 4C14.4241 4 12.8637 4.31039 11.4078 4.91345C9.95189 5.5165 8.62902 6.40042 7.51472 7.51472C6.40042 8.62902 5.5165 9.95189 4.91345 11.4078C4.31039 12.8637 4 14.4241 4 16Z"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 13.332C12 14.3929 12.4214 15.4103 13.1716 16.1605C13.9217 16.9106 14.9391 17.332 16 17.332C17.0609 17.332 18.0783 16.9106 18.8284 16.1605C19.5786 15.4103 20 14.3929 20 13.332C20 12.2712 19.5786 11.2537 18.8284 10.5036C18.0783 9.75346 17.0609 9.33203 16 9.33203C14.9391 9.33203 13.9217 9.75346 13.1716 10.5036C12.4214 11.2537 12 12.2712 12 13.332Z"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.22461 25.1307C8.55462 24.0323 9.2299 23.0696 10.1503 22.3853C11.0706 21.7011 12.1871 21.3317 13.3339 21.332H18.6673C19.8156 21.3316 20.9334 21.7019 21.8545 22.3877C22.7755 23.0736 23.4506 24.0384 23.7793 25.1387"
                              stroke="#121212"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3160_3413">
                              <rect width="32" height="32" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className=" text-gray-400">BOTTEGA 3D</div>
                    </div>

                    <div className="rating flex flex-row text-xs px-3 py-2">
                      <div className="font-bold">4.5</div>
                      {[...Array(5)].map((star, i) => {
                        return (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 cursor-pointer transition duration-200 ease-in-outtext-yellow-500 text-gray-300`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15.3l4.418 2.717-1.135-4.647 3.603-2.946-4.785-.408L12 4.1l-1.69 4.014-4.785.408 3.603 2.946-1.136 4.647L12 15.3z"
                            />
                          </svg>
                        );
                      })}
                    </div>

                    <div className="bg-accent2 mt-2 mb-2 mx-3 rounded-md">
                      <div className="flex flex-row mx-4">
                        <div className="backers flex flex-row ">
                          <div className="pr-2 pt-1">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_3896_2414)">
                                <path
                                  d="M8 7C8 7.53043 8.21071 8.03914 8.58579 8.41421C8.96086 8.78929 9.46957 9 10 9C10.5304 9 11.0391 8.78929 11.4142 8.41421C11.7893 8.03914 12 7.53043 12 7C12 6.46957 11.7893 5.96086 11.4142 5.58579C11.0391 5.21071 10.5304 5 10 5C9.46957 5 8.96086 5.21071 8.58579 5.58579C8.21071 5.96086 8 6.46957 8 7Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 15V14C6 13.4696 6.21071 12.9609 6.58579 12.5858C6.96086 12.2107 7.46957 12 8 12H12C12.5304 12 13.0391 12.2107 13.4142 12.5858C13.7893 12.9609 14 13.4696 14 14V15"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M15 7C15 7.53043 15.2107 8.03914 15.5858 8.41421C15.9609 8.78929 16.4696 9 17 9C17.5304 9 18.0391 8.78929 18.4142 8.41421C18.7893 8.03914 19 7.53043 19 7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5C16.4696 5 15.9609 5.21071 15.5858 5.58579C15.2107 5.96086 15 6.46957 15 7Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17 12H19C19.5304 12 20.0391 12.2107 20.4142 12.5858C20.7893 12.9609 21 13.4696 21 14V15"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_3896_2414">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div>
                            <span className="font-bold text-xs pr-2 ">234</span>
                            <span className="text-xs">Backers</span>
                          </div>
                        </div>

                        <div className="ml-auto flex flex-row">
                          <div className=" pr-2 pt-1">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_3896_2424)">
                                <path
                                  d="M12 3L8 10H16L12 3Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 17C14 17.7956 14.3161 18.5587 14.8787 19.1213C15.4413 19.6839 16.2044 20 17 20C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17C20 16.2044 19.6839 15.4413 19.1213 14.8787C18.5587 14.3161 17.7956 14 17 14C16.2044 14 15.4413 14.3161 14.8787 14.8787C14.3161 15.4413 14 16.2044 14 17Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M4 15C4 14.7348 4.10536 14.4804 4.29289 14.2929C4.48043 14.1054 4.73478 14 5 14H9C9.26522 14 9.51957 14.1054 9.70711 14.2929C9.89464 14.4804 10 14.7348 10 15V19C10 19.2652 9.89464 19.5196 9.70711 19.7071C9.51957 19.8946 9.26522 20 9 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15Z"
                                  stroke="#121212"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_3896_2424">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div>
                            <span className="font-bold text-xs pr-2">5</span>
                            <span className="text-xs">Reward Tiers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="community mt-12 flex flex-col items-center">
          <div className="font-bold text-xl w-[28rem]">
            Join the biggest 3D printing community And get everything you need
            in one place!
          </div>
          <div className="flex gap-6 mt-6">
            <button className="bg-primary-brand py-2 px-6 text-white rounded-md">
              Join Community
            </button>
            <button className="bg-primary-brand py-2 px-6 text-white rounded-md">
              Create Campaign
            </button>
            <button className="bg-primary-brand py-2 px-6 text-white rounded-md">
              Explore Campaign
            </button>
          </div>
        </div>

        <div className="recent-blogs ">
          <div className="flex flex-col mx-16 mt-28">
            <div className="font-bold text-xl">Recent Blog Posts</div>
            <div>
              <div
                className={` pt-8 pb-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10  bg-white`}
              >
                {[...Array(4)].map((star, i) => {
                  return (
                    <div className="flex flex-col w-full max-w-[26rem]  m-auto   transition-all ease-in-out duration-500  relative overflow-hidden">
                      <div className="">
                        <img
                          src={Live[0].coverPic}
                          alt="Campaign Cover Image"
                          className="w-full h-[14rem] "
                        />
                      </div>

                      <div className="flex flex-col">
                        <div className="blog-user-publish-date  text-neutral-500 text-xs mt-4">
                          Phoenix Baker • 19 Jan 2022
                        </div>
                        <div className="  ">
                          <div className="title py-2 font-bold pr-6 text-sm ">
                            The Underground Army marketing sign-up
                          </div>

                          <div className="text-sm text-gray-500">
                            Linear helps streamline software projects, sprints,
                            tasks, and bug tracking. Here’s how to get...
                          </div>

                          <div className="tags mt-2">
                            <div className="flex flex-row">
                              <div className=" bg-neutral-200 text-xs rounded-full p-2">
                                Design
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionPage;
