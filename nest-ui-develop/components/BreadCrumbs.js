import Link from "next/link";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";

const BreadCrumbs = ({ items, previousPageButtonUrl }) => {
  return (
    <div className="flex items-center gap-2">
      {previousPageButtonUrl && (
        <Link
          href={previousPageButtonUrl}
          className="p-2 bg-primary-brand rounded-[5px] text-white"
        >
          <div className="h-4 w-4">
            <ArrowLeftIcon />
          </div>
        </Link>
      )}
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <Link
              key={`breadcrumb-${item.title}-${index}`}
              href={item.to}
              className="text-primary-brand"
            >
              {item.title}
            </Link>
          );
        } else {
          return (
            <div key={`breadcrumb-${item.title}-${index}`}>
              <Link href={item.to}>{item.title}</Link>
              <span className="ml-1">{">"}</span>
            </div>
          );
        }
      })}
    </div>
  );
};
export default BreadCrumbs;
