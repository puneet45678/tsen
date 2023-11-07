import Image from 'next/image'
import {useState, useEffect} from 'react'
import TermsAndConditionsComponent from "../../components/TermsAndConditions/TermsAndConditions"
import {useRouter} from 'next/router';

export default function UserTermsAndPrivacy() {
    const [sectionSelected, setSectionSelected] = useState("terms");
    const router = useRouter();

    const [page, setPage] = useState(router.query?.page?.[0]);

    useEffect(() => {
        setPage(router.query?.page?.[0]);
        console.log("page_query: ",router.query?.page?.[0])
      }, [router.query.page]);

  return (
    <div className="bg-white w-full h-full px-[212px] pt-[80px]">

      <div className="flex gap-[124px] w-full">
    <div className="flex flex-col gap-[32px]">
    <Image
    src={"/NestLogoTandC.svg"}
    height={100}
    width={100}
    />
    <div className="flex flex-col gap-[16px] w-full">
    <button 
    onClick={()=>{setSectionSelected("terms"); router.push(`/user-conditions/terms-and-conditions`)}}
    className={`text-left whitespace-nowrap px-[16px] py-[11px] text-md font-semibold rounded-[6px] ${sectionSelected==="terms"?"text-primary-purple-500 bg-primary-purple-50":"text-dark-neutral-200"}`}>
        Terms and Conditions
    </button>
    <button
    onClick={()=>{setSectionSelected("privacy"); router.push(`/user-conditions/privacy-policy`)}}
    className={`text-left whitespace-nowrap px-[16px] py-[11px] text-md font-semibold rounded-[6px] ${sectionSelected==="privacy"?"text-primary-purple-500 bg-primary-purple-50":"text-dark-neutral-200"}`}>
        Privacy Policy
    </button>
    </div>
    </div>
    {page==="terms-and-conditions"?(<TermsAndConditionsComponent/>):(null)}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
    const page = context.query?.page?.[0];
    if (page === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "/user-conditions/terms-and-conditions",
        },
        props: {},
      };
    }

    return {
      props: {},
    };
  }