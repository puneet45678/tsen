import Link from "next/link";
import Image from "next/image";
import BreadCrumbsWithBackButton from "../Layouts/BreadCrumbsWithBackButton";

const MyNestContentWithBreadcrumbs = (props) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col w-full min-h-full">
        <div className="flex justify-start items-start mx-8 pt-8 pb-6 border-b-[1px] border-light-neutral-500">
          <BreadCrumbsWithBackButton
            backButtonLink={props.breadcrumbBackButtonLink}
            items={props.breadcrumbItems}
          />
        </div>
        <div className="pt-6 px-8 pb-8">{props.children}</div>
      </div>
    </div>
  );
};

export default MyNestContentWithBreadcrumbs;
