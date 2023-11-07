import { useRouter } from "next/router";

const UploadModelMenu = ({ items, currentPage, modelId, modelErrors }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 w-[250px] min-w-[250px] h-full">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${
            currentPage === item.to
              ? "bg-primary-brand text-white rounded-[5px]"
              : "bg-transparent text-black"
          } flex items-center justify-center gap-1 cursor-pointer px-3 py-1 w-fit`}
        >
          <span
            onClick={() => {
              router.push(`/my-nest/models/upload/${modelId}/${item.to}`);
            }}
            className="font-semibold"
          >
            {item.title}
          </span>
          {modelErrors?.[item.value] &&
            Object.keys(modelErrors[item.value]).length > 0 && (
              <div className="flex items-center justify-center rounded-full text-white bg-black font-bold h-5 w-5 text-[0.625rem]">
                {Object.keys(modelErrors[item.value]).length}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};
export default UploadModelMenu;
