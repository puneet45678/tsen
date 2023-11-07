import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const Tier = (props) => {

    const router= useRouter();
    // const tierData = useSelector((state)=>state.tier);

  return (
    <div>
        <div className='relative w-full bg-cover bg-no-repeat border-[1px] border-transparent' style={{backgroundImage:`url('https://images.unsplash.com/photo-1532009172808-fe52563c17aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`}}>
            <div className='absolute w-[70%] h-full bg-gradient-to-r from-black to-transparent z-0'></div>
            <div className='my-[77px] ml-[212px] z-10 relative'>
                <h1 className='text-headline-sm text-white font-[600]'>Hengstland Scouts foot and mounted</h1>
                <h2 className='mt-2 text-md text-light-neutral-50'>
                    Modular STL files for 3d printing. 300+ files of legendary warriors of the Ancient Era are ready for your game. Free bonuses and bits inside - come in!
                </h2>
            </div>            
        </div>
        <div className='mt-[46px] px-[212px]'>
            <div className='flex text-headline-2xs items-end'>
                <span onClick={()=>router.push(`${props.tiersLink}/${props.campaignId}/tiers`)} className='text-dark-neutral-700 font-[500]'>
                    Tiers
                </span>               
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M13.3333 8L20.3905 15.0572C20.9112 15.5779 20.9112 16.4221 20.3905 16.9428L13.3333 24" stroke="#E5E5E7" strokeWidth="2" strokeLinecap="round"/>
                </svg>  
                <span className='text-primary-purple-500 font-[500]'>
                    Torii: Gates to the Sacred Spaces in the shuttle
                </span>
                <button className='ml-auto text-md text-white bg-primary-purple-500 text-center px-[18px] py-[11px] rounded-md w-[250px]'>
                    Add this tier to cart
                </button>
            </div>            
            <div className='w-full h-[1px] bg-light-neutral-600 mt-6'></div>
        </div>
        <div className='mt-6 mb-[126px] px-[212px] flex flex-col gap-6'>
            {[1,2,3].map((item, index)=>(
                <div className='w-full h-fit flex bg-white rounded-[6px] border-[1px] border-light-neutral-600 p-6'>
                    <div className='w-[25%] aspect-square relative overflow-hidden z-0 rounded-md'>                                               
                        <img src='https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg' className='w-full aspect-square object-cover object-right rounded-md' />
                        <button className='w-full text-md border-[1px] border-primary-purple-600 text-primary-purple-500 font-[500] text-center mt-6 px-[18px] py-3 rounded-lg shadow-xs'>
                            Visit on marketplace
                        </button>
                    </div>
                    <div className='w-[57%] pl-[74px] pr-6 flex flex-col gap-8' style={{borderRadius:"0px 6px 6px 0px"}}>                        
                        <h1 className='text-2xs text-dark-neutral-700 font-[600] truncate'>
                            akira toriyama
                        </h1>                        
                        <div className='bg-light-neutral-50 py-[18px] pl-[50px] text-lg flex items-center'>
                            <span className='text-black font-[500]'>IKN-P-20</span>
                            <span className='ml-2 text-dark-neutral-200'>
                                License
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className='ml-[5px]'>
                              <path d="M7 9.5V6.5M7 5V4.995M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z" stroke="#525D6A" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className='text-black font-[500] ml-[100px]'>20</span>
                            <span className='ml-[8px] text-dark-neutral-200'>
                                Prints allowed
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className='ml-[5px]'>
                              <path d="M7 9.5V6.5M7 5V4.995M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z" stroke="#525D6A" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className='border-t-[1px] border-light-neutral-600 pt-6 px-[26px]'>
                            <div className='flex gap-3 text-headline-2xs text-dark-neutral-700'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75V13.25ZM16 14.75C16.4142 14.75 16.75 14.4142 16.75 14C16.75 13.5858 16.4142 13.25 16 13.25V14.75ZM8 5.25C7.58579 5.25 7.25 5.58579 7.25 6C7.25 6.41421 7.58579 6.75 8 6.75V5.25ZM16 6.75C16.4142 6.75 16.75 6.41421 16.75 6C16.75 5.58579 16.4142 5.25 16 5.25V6.75ZM8 9.25C7.58579 9.25 7.25 9.58579 7.25 10C7.25 10.4142 7.58579 10.75 8 10.75V9.25ZM16 10.75C16.4142 10.75 16.75 10.4142 16.75 10C16.75 9.58579 16.4142 9.25 16 9.25V10.75ZM5 17.25C4.58579 17.25 4.25 17.5858 4.25 18C4.25 18.4142 4.58579 18.75 5 18.75V17.25ZM19 18.75C19.4142 18.75 19.75 18.4142 19.75 18C19.75 17.5858 19.4142 17.25 19 17.25V18.75ZM5.07805 21.7748L4.73232 22.4404L5.07805 21.7748ZM4.22517 20.9219L3.55961 21.2677L4.22517 20.9219ZM19.7748 20.9219L20.4404 21.2677L19.7748 20.9219ZM18.9219 21.7748L19.2677 22.4404L18.9219 21.7748ZM18.9219 2.22517L19.2677 1.55961L18.9219 2.22517ZM19.7748 3.07805L20.4404 2.73232L19.7748 3.07805ZM5.07805 2.22517L4.73232 1.55961L5.07805 2.22517ZM4.22517 3.07805L3.55961 2.73232L4.22517 3.07805ZM8 14.75H16V13.25H8V14.75ZM8 6.75H16V5.25H8V6.75ZM8 10.75H16V9.25H8V10.75ZM5 18.75H19V17.25H5V18.75ZM7.22 2.75H16.78V1.25H7.22V2.75ZM19.25 5.22V18.78H20.75V5.22H19.25ZM16.78 21.25H7.22V22.75H16.78V21.25ZM4.75 18.78V5.22H3.25V18.78H4.75ZM7.22 21.25C6.63792 21.25 6.24722 21.2494 5.94653 21.2244C5.65482 21.2002 5.51562 21.157 5.42378 21.1093L4.73232 22.4404C5.07395 22.6179 5.43624 22.6872 5.82239 22.7193C6.19956 22.7506 6.6631 22.75 7.22 22.75V21.25ZM3.25 18.78C3.25 19.3369 3.2494 19.8004 3.28072 20.1776C3.31279 20.5638 3.38215 20.926 3.55961 21.2677L4.89073 20.5762C4.84303 20.4844 4.7998 20.3452 4.77557 20.0535C4.7506 19.7528 4.75 19.3621 4.75 18.78H3.25ZM5.42378 21.1093C5.19548 20.9907 5.00933 20.8045 4.89073 20.5762L3.55961 21.2677C3.82052 21.77 4.23005 22.1795 4.73232 22.4404L5.42378 21.1093ZM19.25 18.78C19.25 19.3621 19.2494 19.7528 19.2244 20.0535C19.2002 20.3452 19.157 20.4844 19.1093 20.5762L20.4404 21.2677C20.6179 20.926 20.6872 20.5638 20.7193 20.1776C20.7506 19.8004 20.75 19.3369 20.75 18.78H19.25ZM16.78 22.75C17.3369 22.75 17.8004 22.7506 18.1776 22.7193C18.5638 22.6872 18.926 22.6179 19.2677 22.4404L18.5762 21.1093C18.4844 21.157 18.3452 21.2002 18.0535 21.2244C17.7528 21.2494 17.3621 21.25 16.78 21.25V22.75ZM19.1093 20.5762C18.9907 20.8045 18.8045 20.9907 18.5762 21.1093L19.2677 22.4404C19.7699 22.1795 20.1795 21.77 20.4404 21.2677L19.1093 20.5762ZM16.78 2.75C17.3621 2.75 17.7528 2.7506 18.0535 2.77557C18.3452 2.7998 18.4844 2.84302 18.5762 2.89073L19.2677 1.55961C18.926 1.38215 18.5638 1.31279 18.1776 1.28072C17.8004 1.2494 17.3369 1.25 16.78 1.25V2.75ZM20.75 5.22C20.75 4.6631 20.7506 4.19956 20.7193 3.82239C20.6872 3.43624 20.6179 3.07395 20.4404 2.73232L19.1093 3.42378C19.157 3.51562 19.2002 3.65482 19.2244 3.94653C19.2494 4.24722 19.25 4.63792 19.25 5.22H20.75ZM18.5762 2.89073C18.8045 3.00933 18.9907 3.19548 19.1093 3.42378L20.4404 2.73232C20.1795 2.23005 19.7699 1.82052 19.2677 1.55961L18.5762 2.89073ZM7.22 1.25C6.6631 1.25 6.19956 1.2494 5.82239 1.28072C5.43624 1.31279 5.07395 1.38215 4.73232 1.55961L5.42378 2.89073C5.51562 2.84303 5.65482 2.7998 5.94653 2.77557C6.24722 2.7506 6.63792 2.75 7.22 2.75V1.25ZM4.75 5.22C4.75 4.63792 4.7506 4.24722 4.77557 3.94653C4.7998 3.65482 4.84302 3.51562 4.89073 3.42378L3.55961 2.73232C3.38215 3.07395 3.31279 3.43624 3.28072 3.82239C3.2494 4.19956 3.25 4.6631 3.25 5.22H4.75ZM4.73232 1.55961C4.23005 1.82052 3.82052 2.23005 3.55961 2.73232L4.89073 3.42378C5.00933 3.19548 5.19548 3.00933 5.42378 2.89073L4.73232 1.55961Z" fill="#323539"/>
                                </svg>
                                <span>
                                    Description
                                </span>                                
                            </div>
                            <span className='text-md text-dark-neutral-200 mt-4'>
                                What is Lorem Ipsum?
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Why do we use it?
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                What is Lorem Ipsum?
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            
                                Why do we use it?
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                            </span>
                        </div>
                        <div className='border-t-[1px] border-light-neutral-600 pt-6 px-[26px]'>
                            <div className='flex gap-3 text-headline-2xs text-dark-neutral-700'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75V13.25ZM16 14.75C16.4142 14.75 16.75 14.4142 16.75 14C16.75 13.5858 16.4142 13.25 16 13.25V14.75ZM8 5.25C7.58579 5.25 7.25 5.58579 7.25 6C7.25 6.41421 7.58579 6.75 8 6.75V5.25ZM16 6.75C16.4142 6.75 16.75 6.41421 16.75 6C16.75 5.58579 16.4142 5.25 16 5.25V6.75ZM8 9.25C7.58579 9.25 7.25 9.58579 7.25 10C7.25 10.4142 7.58579 10.75 8 10.75V9.25ZM16 10.75C16.4142 10.75 16.75 10.4142 16.75 10C16.75 9.58579 16.4142 9.25 16 9.25V10.75ZM5 17.25C4.58579 17.25 4.25 17.5858 4.25 18C4.25 18.4142 4.58579 18.75 5 18.75V17.25ZM19 18.75C19.4142 18.75 19.75 18.4142 19.75 18C19.75 17.5858 19.4142 17.25 19 17.25V18.75ZM5.07805 21.7748L4.73232 22.4404L5.07805 21.7748ZM4.22517 20.9219L3.55961 21.2677L4.22517 20.9219ZM19.7748 20.9219L20.4404 21.2677L19.7748 20.9219ZM18.9219 21.7748L19.2677 22.4404L18.9219 21.7748ZM18.9219 2.22517L19.2677 1.55961L18.9219 2.22517ZM19.7748 3.07805L20.4404 2.73232L19.7748 3.07805ZM5.07805 2.22517L4.73232 1.55961L5.07805 2.22517ZM4.22517 3.07805L3.55961 2.73232L4.22517 3.07805ZM8 14.75H16V13.25H8V14.75ZM8 6.75H16V5.25H8V6.75ZM8 10.75H16V9.25H8V10.75ZM5 18.75H19V17.25H5V18.75ZM7.22 2.75H16.78V1.25H7.22V2.75ZM19.25 5.22V18.78H20.75V5.22H19.25ZM16.78 21.25H7.22V22.75H16.78V21.25ZM4.75 18.78V5.22H3.25V18.78H4.75ZM7.22 21.25C6.63792 21.25 6.24722 21.2494 5.94653 21.2244C5.65482 21.2002 5.51562 21.157 5.42378 21.1093L4.73232 22.4404C5.07395 22.6179 5.43624 22.6872 5.82239 22.7193C6.19956 22.7506 6.6631 22.75 7.22 22.75V21.25ZM3.25 18.78C3.25 19.3369 3.2494 19.8004 3.28072 20.1776C3.31279 20.5638 3.38215 20.926 3.55961 21.2677L4.89073 20.5762C4.84303 20.4844 4.7998 20.3452 4.77557 20.0535C4.7506 19.7528 4.75 19.3621 4.75 18.78H3.25ZM5.42378 21.1093C5.19548 20.9907 5.00933 20.8045 4.89073 20.5762L3.55961 21.2677C3.82052 21.77 4.23005 22.1795 4.73232 22.4404L5.42378 21.1093ZM19.25 18.78C19.25 19.3621 19.2494 19.7528 19.2244 20.0535C19.2002 20.3452 19.157 20.4844 19.1093 20.5762L20.4404 21.2677C20.6179 20.926 20.6872 20.5638 20.7193 20.1776C20.7506 19.8004 20.75 19.3369 20.75 18.78H19.25ZM16.78 22.75C17.3369 22.75 17.8004 22.7506 18.1776 22.7193C18.5638 22.6872 18.926 22.6179 19.2677 22.4404L18.5762 21.1093C18.4844 21.157 18.3452 21.2002 18.0535 21.2244C17.7528 21.2494 17.3621 21.25 16.78 21.25V22.75ZM19.1093 20.5762C18.9907 20.8045 18.8045 20.9907 18.5762 21.1093L19.2677 22.4404C19.7699 22.1795 20.1795 21.77 20.4404 21.2677L19.1093 20.5762ZM16.78 2.75C17.3621 2.75 17.7528 2.7506 18.0535 2.77557C18.3452 2.7998 18.4844 2.84302 18.5762 2.89073L19.2677 1.55961C18.926 1.38215 18.5638 1.31279 18.1776 1.28072C17.8004 1.2494 17.3369 1.25 16.78 1.25V2.75ZM20.75 5.22C20.75 4.6631 20.7506 4.19956 20.7193 3.82239C20.6872 3.43624 20.6179 3.07395 20.4404 2.73232L19.1093 3.42378C19.157 3.51562 19.2002 3.65482 19.2244 3.94653C19.2494 4.24722 19.25 4.63792 19.25 5.22H20.75ZM18.5762 2.89073C18.8045 3.00933 18.9907 3.19548 19.1093 3.42378L20.4404 2.73232C20.1795 2.23005 19.7699 1.82052 19.2677 1.55961L18.5762 2.89073ZM7.22 1.25C6.6631 1.25 6.19956 1.2494 5.82239 1.28072C5.43624 1.31279 5.07395 1.38215 4.73232 1.55961L5.42378 2.89073C5.51562 2.84303 5.65482 2.7998 5.94653 2.77557C6.24722 2.7506 6.63792 2.75 7.22 2.75V1.25ZM4.75 5.22C4.75 4.63792 4.7506 4.24722 4.77557 3.94653C4.7998 3.65482 4.84302 3.51562 4.89073 3.42378L3.55961 2.73232C3.38215 3.07395 3.31279 3.43624 3.28072 3.82239C3.2494 4.19956 3.25 4.6631 3.25 5.22H4.75ZM4.73232 1.55961C4.23005 1.82052 3.82052 2.23005 3.55961 2.73232L4.89073 3.42378C5.00933 3.19548 5.19548 3.00933 5.42378 2.89073L4.73232 1.55961Z" fill="#323539"/>
                                </svg>
                                <span>
                                    Printing Details
                                </span>                                
                            </div>
                            <span className='text-md text-dark-neutral-200 mt-4'>
                                Modular STL files for 3d printing. 300+ files of legendary warriors of the Ancient Era are ready for your game. Free bonuses and bits inside - come in! Modular STL files for 3d printing. 300+ files of legendary warriors of the Ancient Era are ready for your game. Free bonuses and bits inside - come in!
                            </span>
                            <div className='mt-6 flex'>
                                <div className='text-md text-dark-neutral-200 flex flex-col gap-4 font-[500]'>
                                    <p>Material type</p>
                                    <p>Material quantity</p>
                                    <p>Material dimensions</p>
                                    <p>Maximum scale</p>
                                    <p>Minimum scale</p>
                                    <p>Time to print</p>
                                    <p>Support required</p>
                                </div>
                                <div className='text-md text-dark-neutral-700 font-[600] ml-[66px] flex flex-col gap-4'>
                                    <p>Polyester</p>
                                    <p>180 gm</p>
                                    <p>200(length) X 300(depth) X 400(height)</p>
                                    <p>2:1</p>
                                    <p>2:1</p>
                                    <p>3h 5min</p>
                                    <p>yes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tier