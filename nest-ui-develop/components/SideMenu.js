import Link from "next/link";

const SideMenu = (props) => {
  return (
    <div className={`h-max py-2 sticky top-32 ${props.className}`}>
      <h1 className="text-primary-brand text-2xl m-2 font-medium">
        {props.heading}
      </h1>
      <ul className="flex flex-col">
        {props.links.map((link, index) => (
          <Link
            key={index}
            href={link.to}
            scroll="false"
            className="m-2 text-gray-500 cursor-pointer font-medium"
          >
            {link.title}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
