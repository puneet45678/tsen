import Link from "next/link";
import Image from "next/image";

const MyNestContent = (props) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col w-full min-h-full">
        <div className="flex justify-start items-start mx-8 pt-8 pb-6 border-b-[1px] border-light-neutral-500">
          <h1 className="font-semibold text-headline-sm text-dark-neutral-700">
            {props.heading}
          </h1>
        </div>
        {props.empty ? (
          <div className="w-full grow flex flex-col items-center justify-center gap-8 p-8">
            <div className="relative w-96 h-80">
              <Image src={props.emptyImage} alt="Empty Image" fill />
            </div>
            <h6 className="text-headline-sm font-medium">
              {props.emptyHeading}
            </h6>
            <Link
              href={props.emptyButtonLink}
              className="flex items-center justify-center h-9 bg-primary-purple-500 text-white rounded-[5px] px-3 text-button-text-sm font-semibold shadow-xs"
            >
              {props.emptyButtonText}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-6 px-8 pb-8">
            {/* <div className="flex justify-between items-center">
              <div className="flex items-center justify-center gap-2 border-[1px] rounded-[5px] bg-white h-10 px-2 w-full max-w-[30rem] ml-[32px] text-light-neutral-900 text-sm">
                <div className="h-5 w-5 text-light-neutral-900">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder={props.searchPlaceholderText}
                  className="grow rounded-r-sm focus:outline-none w-full bg-transparent placeholder-gray-500 "
                  value={props.searchValue}
                  onChange={(event) => props.onSearchChange(event.target.value)}
                />
              </div>
              <div></div>
            </div>
            <div>{props.children}</div> */}
            {props.children}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyNestContent;
